import { Test, TestingModule } from '@nestjs/testing';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { mockRequest, buildPatient } from '../../../test/helpers/mock-factory';

describe('PatientsController', () => {
  let controller: PatientsController;
  const service = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getStats: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientsController],
      providers: [{ provide: PatientsService, useValue: service }],
    }).compile();

    controller = module.get<PatientsController>(PatientsController);
  });

  describe('create', () => {
    it('should create with dto and req.user.id', async () => {
      const dto = { firstName: 'Jane', lastName: 'Smith' };
      const req = mockRequest();
      service.create.mockResolvedValue(buildPatient());

      await controller.create(dto, req);
      expect(service.create).toHaveBeenCalledWith(dto, req.user.id);
    });
  });

  describe('findAll', () => {
    it('should pass query params through', async () => {
      const query = { page: '1', limit: '20', search: 'Jane' };
      service.findAll.mockResolvedValue({ data: [], meta: {} });

      await controller.findAll(query);
      expect(service.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('getStats', () => {
    it('should call service.getStats', async () => {
      service.getStats.mockResolvedValue({ total: 10, active: 8, monthly: [] });

      const result = await controller.getStats();
      expect(service.getStats).toHaveBeenCalled();
      expect(result).toEqual({ total: 10, active: 8, monthly: [] });
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with id', async () => {
      const patient = buildPatient();
      service.findOne.mockResolvedValue(patient);

      const result = await controller.findOne(patient.id);
      expect(service.findOne).toHaveBeenCalledWith(patient.id);
      expect(result).toEqual(patient);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const dto = { firstName: 'Updated' };
      service.update.mockResolvedValue(buildPatient({ firstName: 'Updated' }));

      const result = await controller.update('patient-id', dto);
      expect(service.update).toHaveBeenCalledWith('patient-id', dto);
      expect(result.firstName).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('should call service.remove with id', async () => {
      service.remove.mockResolvedValue(undefined);

      await controller.remove('patient-id');
      expect(service.remove).toHaveBeenCalledWith('patient-id');
    });
  });
});