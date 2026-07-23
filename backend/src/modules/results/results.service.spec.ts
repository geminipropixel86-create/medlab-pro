import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TestResult } from './result.entity';
import { ResultsService } from './results.service';
import { mockRepository, buildTestResult } from '../../../test/helpers/mock-factory';

describe('ResultsService', () => {
  let service: ResultsService;
  let repo: ReturnType<typeof mockRepository>;

  beforeEach(async () => {
    repo = mockRepository();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResultsService,
        { provide: getRepositoryToken(TestResult), useValue: repo },
      ],
    }).compile();

    service = module.get<ResultsService>(ResultsService);
  });

  afterEach(() => jest.clearAllMocks());

  // ─── create ─────────────────────────────────────────────

  describe('create', () => {
    it('should create a test result with parameters', async () => {
      const dto: Partial<TestResult> = {
        testId: 'test-id-123',
        parameters: [
          { name: 'Hemoglobin', value: '14.5', unit: 'g/dL', referenceRange: '13-17', flag: 'normal' as const },
        ],
        summary: 'Normal',
      };
      const saved = buildTestResult(dto);
      repo.save.mockResolvedValue(saved);

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalled();
      expect(result.parameters).toHaveLength(1);
      expect(result.parameters![0].name).toBe('Hemoglobin');
    });
  });

  // ─── findByTest ─────────────────────────────────────────

  describe('findByTest', () => {
    it('should return a result by test ID', async () => {
      const result = buildTestResult();
      repo.findOne.mockResolvedValue(result);

      const res = await service.findByTest(result.testId);
      expect(res).toEqual(result);
      expect(repo.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { testId: result.testId },
          relations: ['test', 'test.patient', 'verifiedBy'],
        }),
      );
    });

    it('should throw NotFoundException when no result for test', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.findByTest('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ─── update ─────────────────────────────────────────────

  describe('update', () => {
    it('should update and return the result', async () => {
      const result = buildTestResult();
      repo.findOne.mockResolvedValue(result);
      repo.save.mockImplementation((r: any) => Promise.resolve(r));

      const updated = await service.update(result.id, {
        interpretation: 'Abnormal - follow up required',
      });

      expect(updated.interpretation).toBe('Abnormal - follow up required');
      expect(repo.save).toHaveBeenCalled();
    });

    it('should throw on non-existent result', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.update('bad-id', {})).rejects.toThrow(NotFoundException);
    });
  });

  // ─── verify ─────────────────────────────────────────────

  describe('verify', () => {
    it('should set verifiedById and verifiedAt', async () => {
      const result = buildTestResult();
      repo.findOne.mockResolvedValue(result);
      repo.save.mockImplementation((r: any) => Promise.resolve(r));

      const verified = await service.verify(result.id, 'verifier-1');

      expect(verified.verifiedById).toBe('verifier-1');
      expect(verified.verifiedAt).toBeInstanceOf(Date);
    });

    it('should throw on non-existent result', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.verify('bad-id', 'u1')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── getPatientResults ─────────────────────────────────

  describe('getPatientResults', () => {
    it('should return results for a patient', async () => {
      const results = [buildTestResult(), buildTestResult()];
      repo.find.mockResolvedValue(results);

      const res = await service.getPatientResults('patient-1');

      expect(res).toHaveLength(2);
      expect(repo.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { test: { patientId: 'patient-1' } },
          order: { createdAt: 'DESC' },
        }),
      );
    });

    it('should return empty array if no results', async () => {
      repo.find.mockResolvedValue([]);

      const res = await service.getPatientResults('patient-no-results');
      expect(res).toEqual([]);
    });
  });
});