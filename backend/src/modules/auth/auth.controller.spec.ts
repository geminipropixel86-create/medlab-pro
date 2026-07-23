import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { mockRequest, buildUser } from '../../../test/helpers/mock-factory';

describe('AuthController', () => {
  let controller: AuthController;
  const service = {
    register: jest.fn(),
    login: jest.fn(),
    refresh: jest.fn(),
    getProfile: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: service }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('register', () => {
    it('should delegate to authService.register', async () => {
      const dto = { firstName: 'A', lastName: 'B', email: 'a@b.com', password: '123456' };
      service.register.mockResolvedValue({ accessToken: 't', user: {} });

      const result = await controller.register(dto);
      expect(service.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ accessToken: 't', user: {} });
    });
  });

  describe('login', () => {
    it('should delegate to authService.login', async () => {
      const dto = { email: 'a@b.com', password: '123456' };
      service.login.mockResolvedValue({ accessToken: 't', user: {} });

      const result = await controller.login(dto);
      expect(service.login).toHaveBeenCalledWith(dto.email, dto.password);
      expect(result).toHaveProperty('accessToken');
    });
  });

  describe('refresh', () => {
    it('should delegate to authService.refresh', async () => {
      const dto = { refreshToken: 'rtoken' };
      service.refresh.mockResolvedValue({ accessToken: 'new', refreshToken: 'new-rt' });

      const result = await controller.refresh(dto);
      expect(service.refresh).toHaveBeenCalledWith('rtoken');
      expect(result).toHaveProperty('accessToken');
    });
  });

  describe('getProfile', () => {
    it('should delegate to authService.getProfile with req.user.id', async () => {
      const req = mockRequest();
      const user = buildUser();
      service.getProfile.mockResolvedValue(user);

      const result = await controller.getProfile(req);
      expect(service.getProfile).toHaveBeenCalledWith(req.user.id);
      expect(result).toEqual(user);
    });
  });
});