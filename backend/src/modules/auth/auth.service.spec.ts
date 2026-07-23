import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { User, UserRole, UserStatus } from './user.entity';
import { mockRepository, mockJwtService, buildUser } from '../../../test/helpers/mock-factory';

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: ReturnType<typeof mockRepository>;
  let jwtService: ReturnType<typeof mockJwtService>;

  beforeEach(async () => {
    userRepo = mockRepository();
    jwtService = mockJwtService();

    // jwtService.signAsync returns different values for access vs refresh
    jwtService.signAsync
      .mockResolvedValueOnce('mocked-access-token')
      .mockResolvedValueOnce('mocked-refresh-token');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: userRepo },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  // ─── register ─────────────────────────────────────────

  describe('register', () => {
    const dto = {
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice@example.com',
      password: 'Secret123!',
      phone: '+1111111111',
    };

    it('should register a new user and return tokens', async () => {
      userRepo.findOne.mockResolvedValue(null);
      userRepo.create.mockReturnValue(buildUser({ email: dto.email }));
      userRepo.save.mockResolvedValue(buildUser({ email: dto.email }));

      const result = await service.register(dto);

      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { email: dto.email.toLowerCase() },
      });
      expect(userRepo.create).toHaveBeenCalled();
      expect(userRepo.save).toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken', 'mocked-access-token');
      expect(result).toHaveProperty('refreshToken', 'mocked-refresh-token');
      expect(result.user).not.toHaveProperty('passwordHash');
      expect(result.user).not.toHaveProperty('refreshToken');
    });

    it('should throw ConflictException if email already exists', async () => {
      userRepo.findOne.mockResolvedValue(buildUser({ email: dto.email }));

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
      expect(userRepo.save).not.toHaveBeenCalled();
    });

    it('should hash the password with bcrypt', async () => {
      userRepo.findOne.mockResolvedValue(null);
      const hashSpy = jest.spyOn(bcrypt, 'hash');
      userRepo.save.mockResolvedValue(buildUser({ email: dto.email }));

      await service.register(dto);
      expect(hashSpy).toHaveBeenCalledWith(dto.password, 12);
    });

    it('should assign default PATIENT role when none given', async () => {
      userRepo.findOne.mockResolvedValue(null);
      // Create a dto without role by destructuring and omitting it
      const dtoWithoutRole = {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        password: dto.password,
        phone: dto.phone,
      };
      userRepo.save.mockImplementation((u: any) => Promise.resolve(u));

      await service.register(dtoWithoutRole);
      expect(userRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ role: UserRole.PATIENT }),
      );
    });
  });

  // ─── login ────────────────────────────────────────────

  describe('login', () => {
    const email = 'alice@example.com';
    const password = 'Secret123!';

    it('should return tokens for valid credentials', async () => {
      const user = buildUser({ email });
      userRepo.findOne.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.login(email, password);

      expect(result).toHaveProperty('accessToken');
      expect(result.user).not.toHaveProperty('passwordHash');
      expect(userRepo.save).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for unknown email', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(service.login(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      const user = buildUser({ email });
      userRepo.findOne.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.login(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for inactive account', async () => {
      const user = buildUser({ email, status: UserStatus.INACTIVE });
      userRepo.findOne.mockResolvedValue(user);

      await expect(service.login(email, password)).rejects.toThrow(
        'Account is inactive',
      );
    });

    it('should update lastLoginAt on successful login', async () => {
      const user = buildUser({ email });
      userRepo.findOne.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      await service.login(email, password);
      expect(user.lastLoginAt).toBeInstanceOf(Date);
      expect(userRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ lastLoginAt: expect.any(Date) }),
      );
    });
  });

  // ─── refresh ──────────────────────────────────────────

  describe('refresh', () => {
    it('should return new tokens for a valid refresh token', async () => {
      const user = buildUser({ refreshToken: 'valid-refresh-token' });
      jwtService.verify.mockReturnValue({ sub: user.id });
      userRepo.findOne.mockResolvedValue(user);

      jwtService.signAsync
        .mockReset()
        .mockResolvedValueOnce('new-access-token')
        .mockResolvedValueOnce('new-refresh-token');

      const result = await service.refresh('valid-refresh-token');

      expect(result).toHaveProperty('accessToken', 'new-access-token');
      expect(result).toHaveProperty('refreshToken', 'new-refresh-token');
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refresh('bad-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw if stored token does not match', async () => {
      const user = buildUser({ refreshToken: 'different-token' });
      jwtService.verify.mockReturnValue({ sub: user.id });
      userRepo.findOne.mockResolvedValue(user);

      await expect(service.refresh('some-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  // ─── getProfile ───────────────────────────────────────

  describe('getProfile', () => {
    it('should return sanitized user', async () => {
      const user = buildUser();
      userRepo.findOne.mockResolvedValue(user);

      const result = await service.getProfile(user.id);

      expect(result).not.toHaveProperty('passwordHash');
      expect(result).not.toHaveProperty('refreshToken');
      expect(result.id).toEqual(user.id);
    });

    it('should throw if user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(service.getProfile('nonexistent')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});