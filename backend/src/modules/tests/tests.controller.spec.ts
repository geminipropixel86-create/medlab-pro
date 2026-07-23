import { Test, TestingModule } from '@nestjs/testing';
import { TestsController } from './tests.controller';
import { TestsService } from './tests.service';
import { mockRequest, buildLabTest } from '../../../test/helpers/mock-factory';

describe('TestsController', () => {
  let controller: TestsController;
  const service = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    updateStatus: jest.fn(),
    getStats: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestsController],
      providers: [{ provide: TestsService, useValue: service }],
    }).compile();

    controller = module.get<TestsController>(TestsController);
  });

  describe('create', () => {
    it('should create with dto and req.user.id', async () => {
      const dto = { testName: 'CBC', patientId: 'p1' };
      const req = mockRequest();
      service.create.mockResolvedValue(buildLabTest());

      await controller.create(dto, req);
      expect(service.create).toHaveBeenCalledWith(dto, req.user.id);
    });
  });

  describe('findAll', () => {
    it('should pass query params', async () => {
      const query = { status: 'completed', page: '1' };
      service.findAll.mockResolvedValue({ data: [], meta: {} });

      await controller.findAll(query);
      expect(service.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('getStats', () => {
    it('should call service.getStats', async () => {
      service.getStats.mockResolvedValue({ total: 50, completed: 30, completionRate: 60 });
      const result = await controller.getStats();
      expect(result).toHaveProperty('completionRate', 60);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with id', async () => {
      const test = buildLabTest();
      service.findOne.mockResolvedValue(test);

      const result = await controller.findOne(test.id);
      expect(service.findOne).toHaveBeenCalledWith(test.id);
      expect(result).toEqual(test);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      service.update.mockResolvedValue(buildLabTest({ notes: 'Updated' }));

      const result = await controller.update('test-id', { notes: 'Updated' });
      expect(service.update).toHaveBeenCalledWith('test-id', { notes: 'Updated' });
      expect(result.notes).toBe('Updated');
    });
  });

  describe('updateStatus', () => {
    it('should call service.updateStatus', async () => {
      const req = mockRequest();
      service.updateStatus.mockResolvedValue(buildLabTest({ status: 'completed' as any }));

      await controller.updateStatus('test-id', 'completed', req);
      expect(service.updateStatus).toHaveBeenCalledWith('test-id', 'completed', req.user.id);
    });
  });

  describe('remove', () => {
    it('should call service.updateStatus with cancelled', async () => {
      service.updateStatus.mockResolvedValue(buildLabTest({ status: 'cancelled' as any }));

      await controller.remove('test-id');
      expect(service.updateStatus).toHaveBeenCalledWith('test-id', 'cancelled');
    });
  });
});