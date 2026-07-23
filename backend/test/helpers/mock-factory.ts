import { v4 as uuid } from 'uuid';
import { User, UserRole, UserStatus } from '../../src/modules/auth/user.entity';
import { Patient, Gender } from '../../src/modules/patients/patient.entity';
import { LabTest, TestStatus, TestPriority } from '../../src/modules/tests/test.entity';
import { TestResult } from '../../src/modules/results/result.entity';

/** Type-safe mock repository factory. Returns a plain object with the
 *  same shape as a TypeORM Repository — all methods jest.fn(). */
export function mockRepository<T = any>() {
  const qb = mockQueryBuilder();
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    findAndCount: jest.fn(),
    create: jest.fn((e: any) => e),
    save: jest.fn((e: any) => Promise.resolve(e)),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(() => qb),
    softDelete: jest.fn(),
    restore: jest.fn(),
  };
}

function mockQueryBuilder() {
  return {
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getRawMany: jest.fn().mockResolvedValue([]),
    getRawOne: jest.fn().mockResolvedValue(null),
    getMany: jest.fn().mockResolvedValue([]),
    getOne: jest.fn().mockResolvedValue(null),
    getCount: jest.fn().mockResolvedValue(0),
  };
}

/** Mock JwtService */
export function mockJwtService() {
  return {
    sign: jest.fn().mockReturnValue('mocked-access-token'),
    signAsync: jest.fn().mockResolvedValue('mocked-access-token'),
    verify: jest.fn().mockReturnValue({ sub: 'user-id', email: 'test@test.com', role: 'patient' }),
    verifyAsync: jest.fn().mockResolvedValue({ sub: 'user-id', email: 'test@test.com', role: 'patient' }),
    decode: jest.fn().mockReturnValue({ sub: 'user-id' }),
  };
}

/** Mock ConfigService */
export function mockConfigService(overrides: Record<string, string> = {}) {
  return {
    get: jest.fn((key: string, defaultValue?: string) => overrides[key] ?? defaultValue ?? 'test-value'),
    getOrThrow: jest.fn((key: string) => overrides[key] ?? 'test-value'),
  };
}

/** Mock request object (as set by AuthGuard) */
export function mockRequest(overrides: Partial<any> = {}) {
  return {
    user: {
      id: 'user-id-123',
      email: 'admin@medlabpro.com',
      role: UserRole.SUPER_ADMIN,
      firstName: 'Test',
      lastName: 'User',
    },
    ...overrides,
  };
}

// ─── Entity Factories ─────────────────────────────────

export function buildUser(overrides: Partial<User> = {}): User {
  const user = new User();
  user.id = overrides.id ?? uuid();
  user.firstName = overrides.firstName ?? 'John';
  user.lastName = overrides.lastName ?? 'Doe';
  user.email = overrides.email ?? 'john.doe@example.com';
  user.phone = overrides.phone ?? '+1234567890';
  user.passwordHash = overrides.passwordHash ?? '$2b$12$hashedpassword';
  user.role = overrides.role ?? UserRole.PATIENT;
  user.status = overrides.status ?? UserStatus.ACTIVE;
  user.isEmailVerified = overrides.isEmailVerified ?? true;
  user.refreshToken = overrides.refreshToken ?? (null as unknown as string);
  user.lastLoginAt = overrides.lastLoginAt ?? (null as unknown as Date);
  user.createdAt = overrides.createdAt ?? new Date();
  user.updatedAt = overrides.updatedAt ?? new Date();
  return user;
}

export function buildPatient(overrides: Partial<Patient> = {}): Patient {
  const patient = new Patient();
  patient.id = overrides.id ?? uuid();
  patient.patientId = overrides.patientId ?? 'ML-00001';
  patient.firstName = overrides.firstName ?? 'Jane';
  patient.lastName = overrides.lastName ?? 'Smith';
  patient.dateOfBirth = overrides.dateOfBirth ?? new Date('1990-01-01');
  patient.gender = overrides.gender ?? Gender.FEMALE;
  patient.phone = overrides.phone ?? '+1987654321';
  patient.email = overrides.email ?? 'jane.smith@example.com';
  patient.address = overrides.address ?? '123 Health St';
  patient.bloodGroup = overrides.bloodGroup ?? 'O+';
  patient.isActive = overrides.isActive ?? true;
  patient.createdById = overrides.createdById ?? 'user-id-123';
  patient.createdAt = overrides.createdAt ?? new Date();
  patient.updatedAt = overrides.updatedAt ?? new Date();
  return patient;
}

export function buildLabTest(overrides: Partial<LabTest> = {}): LabTest {
  const test = new LabTest();
  test.id = overrides.id ?? uuid();
  test.testNumber = overrides.testNumber ?? 'T-20240101-0001';
  test.testName = overrides.testName ?? 'Complete Blood Count';
  test.testCategory = overrides.testCategory ?? 'Hematology';
  test.description = overrides.description ?? 'Standard hematology panel';
  test.status = overrides.status ?? TestStatus.PENDING;
  test.priority = overrides.priority ?? TestPriority.ROUTINE;
  test.patientId = overrides.patientId ?? 'patient-id-123';
  test.orderedDate = overrides.orderedDate ?? new Date();
  test.sampleCollectedDate = overrides.sampleCollectedDate ?? undefined;
  test.resultDate = overrides.resultDate ?? undefined;
  test.assignedToId = overrides.assignedToId ?? undefined;
  test.parameters = overrides.parameters ?? undefined;
  test.notes = overrides.notes ?? undefined;
  test.price = overrides.price ?? 500;
  test.isPaid = overrides.isPaid ?? false;
  test.createdById = overrides.createdById ?? 'user-id-123';
  test.createdAt = overrides.createdAt ?? new Date();
  test.updatedAt = overrides.updatedAt ?? new Date();
  return test;
}

export function buildTestResult(overrides: Partial<TestResult> = {}): TestResult {
  const result = new TestResult();
  result.id = overrides.id ?? uuid();
  result.testId = overrides.testId ?? 'test-id-123';
  result.parameters = overrides.parameters ?? [
    { name: 'Hemoglobin', value: '14.5', unit: 'g/dL', referenceRange: '13-17', flag: 'normal' as const },
  ];
  result.summary = overrides.summary ?? 'All parameters within normal range';
  result.interpretation = overrides.interpretation ?? 'Normal';
  result.pdfUrl = overrides.pdfUrl ?? undefined;
  result.isPatientNotified = overrides.isPatientNotified ?? false;
  result.verifiedById = overrides.verifiedById ?? undefined;
  result.verifiedAt = overrides.verifiedAt ?? undefined;
  result.createdAt = overrides.createdAt ?? new Date();
  result.updatedAt = overrides.updatedAt ?? new Date();
  return result;
}