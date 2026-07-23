import { Test, TestingModule } from '@nestjs/testing';
import { ResultsController } from './results.controller';
import { ResultsService } from './results.service';
import { mockRequest, buildTestResult } from '../../../test/helpers/mock-factory';

describe('ResultsController', () => {
  let controller: ResultsController;
  const service = {
    create: jest.fn(),
    findByTest: jest.fn(),
    update: jest.fn(),
    verify: jest.fn(),
    getPatientResults: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResultsController],
      providers: [{ provide: ResultsService, useValue: service }],
    }).compile();

    controller = module.get<ResultsController>(ResultsController);
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto = { testId: 'test-1', parameters: [], summary: 'Normal' };
      service.create.mockResolvedValue(buildTestResult());

      await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findByTest', () => {
    it('should call service.findByTest with testId', async () => {
      const result = buildTestResult();
      service.findByTest.mockResolvedValue(result);

      const res = await controller.findByTest('test-1');
      expect(service.findByTest).toHaveBeenCalledWith('test-1');
      expect(res).toEqual(result);
    });
  });

  describe('getPatientResults', () => {
    it('should call service.getPatientResults with patientId', async () => {
      service.getPatientResults.mockResolvedValue([]);

      await controller.getPatientResults('patient-1');
      expect(service.getPatientResults).toHaveBeenCalledWith('patient-1');
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      service.update.mockResolvedValue(buildTestResult({ interpretation: 'Updated' }));

      const result = await controller.update('result-id', { interpretation: 'Updated' });
      expect(service.update).toHaveBeenCalledWith('result-id', { interpretation: 'Updated' });
      expect(result.interpretation).toBe('Updated');
    });
  });

  describe('verify', () => {
    it('should call service.verify with id and user id', async () => {
      const req = mockRequest();
      service.verify.mockResolvedValue(buildTestResult({ verifiedById: req.user.id }));

      const result = await controller.verify('result-id', req);
      expect(service.verify).toHaveBeenCalledWith('result-id', req.user.id);
      expect(result.verifiedById).toBe(req.user.id);
    });
  });
});