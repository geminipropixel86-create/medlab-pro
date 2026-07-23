import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Patient } from './patient.entity';
import { PatientsService } from './patients.service';
import { mockRepository, buildPatient } from '../../../test/helpers/mock-factory';

describe('PatientsService', () => {
  let service: PatientsService;
  let repo: ReturnType<typeof mockRepository>;

  beforeEach(async () => {
    repo = mockRepository();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientsService,
        { provide: getRepositoryToken(Patient), useValue: repo },
      ],
    }).compile();

    service = module.get<PatientsService>(PatientsService);
  });

  afterEach(() => jest.clearAllMocks());

  // ─── create ─────────────────────────────────────────────

  describe('create', () => {
    it('should create a patient with auto-generated ID', async () => {
      repo.count.mockResolvedValue(0);
      const saved = buildPatient({ patientId: 'ML-00001' });
      repo.save.mockResolvedValue(saved);

      const result = await service.create(
        { firstName: 'Jane', lastName: 'Smith' },
        'user-id-123',
      );

      expect(repo.count).toHaveBeenCalled();
      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          patientId: 'ML-00001',
          createdById: 'user-id-123',
        }),
      );
      expect(result.patientId).toBe('ML-00001');
    });

    it('should increment patient ID correctly', async () => {
      repo.count.mockResolvedValue(42);
      repo.save.mockImplementation((p: any) => Promise.resolve(p));

      const result = await service.create({ firstName: 'John' }, 'user-1');
      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({ patientId: 'ML-00043' }),
      );
    });
  });

  // ─── findAll ────────────────────────────────────────────

  describe('findAll', () => {
    it('should return paginated patients', async () => {
      const patients = [buildPatient(), buildPatient()];
      repo.findAndCount.mockResolvedValue([patients, 2]);

      const result = await service.findAll({ page: 1, limit: 20 });

      expect(result.data).toHaveLength(2);
      expect(result.meta).toEqual({
        page: 1, limit: 20, total: 2, totalPages: 1,
      });
    });

    it('should apply search filter', async () => {
      repo.findAndCount.mockResolvedValue([[], 0]);

      await service.findAll({ search: 'Jane' });

      expect(repo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            firstName: expect.objectContaining({ _value: '%Jane%' }),
          }),
        }),
      );
    });

    it('should filter by status', async () => {
      repo.findAndCount.mockResolvedValue([[], 0]);

      await service.findAll({ status: 'active' });

      expect(repo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ isActive: true }),
        }),
      );
    });
  });

  // ─── findOne ────────────────────────────────────────────

  describe('findOne', () => {
    it('should return a patient by id', async () => {
      const patient = buildPatient();
      repo.findOne.mockResolvedValue(patient);

      const result = await service.findOne(patient.id);
      expect(result).toEqual(patient);
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ─── update ─────────────────────────────────────────────

  describe('update', () => {
    it('should update and return the patient', async () => {
      const patient = buildPatient();
      repo.findOne.mockResolvedValue(patient);
      repo.save.mockImplementation((p: any) => Promise.resolve(p));

      const result = await service.update(patient.id, { firstName: 'Updated' });

      expect(result.firstName).toBe('Updated');
      expect(repo.save).toHaveBeenCalled();
    });

    it('should throw on non-existent patient', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.update('bad-id', {})).rejects.toThrow(NotFoundException);
    });
  });

  // ─── remove (soft delete) ───────────────────────────────

  describe('remove', () => {
    it('should set isActive to false', async () => {
      const patient = buildPatient({ isActive: true });
      repo.findOne.mockResolvedValue(patient);
      repo.save.mockImplementation((p: any) => Promise.resolve(p));

      await service.remove(patient.id);
      expect(patient.isActive).toBe(false);
      expect(repo.save).toHaveBeenCalledWith(patient);
    });
  });

  // ─── getStats ───────────────────────────────────────────

  describe('getStats', () => {
    it('should return aggregated stats', async () => {
      repo.count.mockResolvedValueOnce(100).mockResolvedValueOnce(80);
      repo.createQueryBuilder().getRawMany.mockResolvedValue([
        { month: '2024-01-01', count: '30' },
      ]);

      const result = await service.getStats();

      expect(result).toEqual({
        total: 100,
        active: 80,
        monthly: [{ month: '2024-01-01', count: '30' }],
      });
    });
  });
});