import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LabTest, TestStatus, TestPriority } from './test.entity';
import { TestsService } from './tests.service';
import { mockRepository, buildLabTest, buildPatient } from '../../../test/helpers/mock-factory';

describe('TestsService', () => {
  let service: TestsService;
  let repo: ReturnType<typeof mockRepository>;

  beforeEach(async () => {
    repo = mockRepository();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestsService,
        { provide: getRepositoryToken(LabTest), useValue: repo },
      ],
    }).compile();

    service = module.get<TestsService>(TestsService);
  });

  afterEach(() => jest.clearAllMocks());

  // ─── create ─────────────────────────────────────────────

  describe('create', () => {
    it('should create a test with auto-generated number', async () => {
      repo.count.mockResolvedValue(0);
      const saved = buildLabTest({ testNumber: 'T-20240101-0001' });
      repo.save.mockResolvedValue(saved);

      const result = await service.create(
        { testName: 'CBC', patientId: 'patient-1', price: 500 },
        'user-id-123',
      );

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          testNumber: expect.stringMatching(/^T-\d{8}-\d{4}$/),
          createdById: 'user-id-123',
          status: TestStatus.PENDING,
        }),
      );
      expect(result.testNumber).toBe('T-20240101-0001');
    });

    it('should set default status to PENDING', async () => {
      repo.count.mockResolvedValue(0);
      repo.save.mockImplementation((t: any) => Promise.resolve(t));

      await service.create({ testName: 'X', patientId: 'p1' }, 'u1');
      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({ status: TestStatus.PENDING }),
      );
    });
  });

  // ─── findAll ────────────────────────────────────────────

  describe('findAll', () => {
    it('should return paginated result', async () => {
      const tests = [buildLabTest()];
      repo.findAndCount.mockResolvedValue([tests, 1]);

      const result = await service.findAll({ page: 1, limit: 20 });

      expect(result.data).toHaveLength(1);
      expect(result.meta.totalPages).toBe(1);
    });

    it('should filter by status', async () => {
      repo.findAndCount.mockResolvedValue([[], 0]);

      await service.findAll({ status: 'completed' });
      expect(repo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'completed' }),
        }),
      );
    });

    it('should filter by patientId', async () => {
      repo.findAndCount.mockResolvedValue([[], 0]);

      await service.findAll({ patientId: 'patient-456' });
      expect(repo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ patientId: 'patient-456' }),
        }),
      );
    });
  });

  // ─── findOne ────────────────────────────────────────────

  describe('findOne', () => {
    it('should return a test by id', async () => {
      const test = buildLabTest();
      repo.findOne.mockResolvedValue(test);

      const result = await service.findOne(test.id);
      expect(result).toEqual(test);
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── update ─────────────────────────────────────────────

  describe('update', () => {
    it('should update and return the test', async () => {
      const test = buildLabTest();
      repo.findOne.mockResolvedValue(test);
      repo.save.mockImplementation((t: any) => Promise.resolve(t));

      const result = await service.update(test.id, { notes: 'Urgent' });
      expect(result.notes).toBe('Urgent');
    });
  });

  // ─── updateStatus ───────────────────────────────────────

  describe('updateStatus', () => {
    it('should update status and set sampleCollectedDate', async () => {
      const test = buildLabTest();
      repo.findOne.mockResolvedValue(test);
      repo.save.mockImplementation((t: any) => Promise.resolve(t));

      const result = await service.updateStatus(test.id, TestStatus.SAMPLE_COLLECTED, 'tech-1');

      expect(result.status).toBe(TestStatus.SAMPLE_COLLECTED);
      expect(result.sampleCollectedDate).toBeInstanceOf(Date);
      expect(result.assignedToId).toBe('tech-1');
    });

    it('should set resultDate when completed', async () => {
      const test = buildLabTest();
      repo.findOne.mockResolvedValue(test);
      repo.save.mockImplementation((t: any) => Promise.resolve(t));

      const result = await service.updateStatus(test.id, TestStatus.COMPLETED);

      expect(result.status).toBe(TestStatus.COMPLETED);
      expect(result.resultDate).toBeInstanceOf(Date);
    });

    it('should throw on non-existent test', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(
        service.updateStatus('bad-id', TestStatus.COMPLETED),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ─── getStats ───────────────────────────────────────────

  describe('getStats', () => {
    it('should return counts and completion rate', async () => {
      repo.count
        .mockResolvedValueOnce(100)  // total
        .mockResolvedValueOnce(10)   // pending
        .mockResolvedValueOnce(20)   // in_progress
        .mockResolvedValueOnce(60)   // completed
        .mockResolvedValueOnce(10);  // cancelled

      const result = await service.getStats();

      expect(result).toEqual({
        total: 100,
        pending: 10,
        inProgress: 20,
        completed: 60,
        cancelled: 10,
        completionRate: 60,
      });
    });

    it('should return 0 completion rate when no tests', async () => {
      repo.count.mockResolvedValue(0);

      const result = await service.getStats();

      expect(result.completionRate).toBe(0);
    });
  });
});