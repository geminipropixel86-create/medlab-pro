import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class InitialMigration1700000000000 implements MigrationInterface {
  name = 'InitialMigration1700000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    // Users table
    await queryRunner.createTable(new Table({
      name: 'users',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true },
        { name: 'firstName', type: 'varchar', length: '100' },
        { name: 'lastName', type: 'varchar', length: '100' },
        { name: 'email', type: 'varchar', length: '255', isUnique: true },
        { name: 'phone', type: 'varchar', length: '20', isNullable: true },
        { name: 'passwordHash', type: 'varchar' },
        { name: 'role', type: 'enum', enum: ['super_admin', 'lab_admin', 'technician', 'receptionist', 'patient'], default: "'patient'" },
        { name: 'status', type: 'enum', enum: ['active', 'inactive', 'suspended'], default: "'active'" },
        { name: 'avatarUrl', type: 'varchar', isNullable: true },
        { name: 'isEmailVerified', type: 'boolean', default: false },
        { name: 'lastLoginAt', type: 'timestamp', isNullable: true },
        { name: 'refreshToken', type: 'varchar', isNullable: true },
        { name: 'createdAt', type: 'timestamp', default: 'now()' },
        { name: 'updatedAt', type: 'timestamp', default: 'now()' },
      ],
    }));

    // Patients table
    await queryRunner.createTable(new Table({
      name: 'patients',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true },
        { name: 'patientId', type: 'varchar', length: '50', isUnique: true },
        { name: 'firstName', type: 'varchar', length: '100' },
        { name: 'lastName', type: 'varchar', length: '100' },
        { name: 'dateOfBirth', type: 'date', isNullable: true },
        { name: 'gender', type: 'enum', enum: ['male', 'female', 'other'], isNullable: true },
        { name: 'phone', type: 'varchar', length: '20', isNullable: true },
        { name: 'email', type: 'varchar', length: '255', isNullable: true },
        { name: 'address', type: 'text', isNullable: true },
        { name: 'bloodGroup', type: 'varchar', isNullable: true },
        { name: 'isActive', type: 'boolean', default: true },
        { name: 'userId', type: 'uuid', isNullable: true },
        { name: 'medicalHistory', type: 'jsonb', isNullable: true },
        { name: 'createdById', type: 'uuid', isNullable: true },
        { name: 'createdAt', type: 'timestamp', default: 'now()' },
        { name: 'updatedAt', type: 'timestamp', default: 'now()' },
      ],
    }));

    // Lab Tests table
    await queryRunner.createTable(new Table({
      name: 'lab_tests',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true },
        { name: 'testNumber', type: 'varchar', length: '50', isUnique: true },
        { name: 'testName', type: 'varchar', length: '200' },
        { name: 'testCategory', type: 'varchar', length: '100', isNullable: true },
        { name: 'description', type: 'text', isNullable: true },
        { name: 'status', type: 'enum', enum: ['pending', 'sample_collected', 'in_progress', 'completed', 'cancelled'], default: "'pending'" },
        { name: 'priority', type: 'enum', enum: ['routine', 'urgent', 'stat'], default: "'routine'" },
        { name: 'patientId', type: 'uuid' },
        { name: 'orderedDate', type: 'date' },
        { name: 'sampleCollectedDate', type: 'date', isNullable: true },
        { name: 'resultDate', type: 'date', isNullable: true },
        { name: 'assignedToId', type: 'uuid', isNullable: true },
        { name: 'parameters', type: 'jsonb', isNullable: true },
        { name: 'notes', type: 'text', isNullable: true },
        { name: 'price', type: 'decimal', precision: 10, scale: 2, default: 0 },
        { name: 'isPaid', type: 'boolean', default: false },
        { name: 'createdById', type: 'uuid', isNullable: true },
        { name: 'createdAt', type: 'timestamp', default: 'now()' },
        { name: 'updatedAt', type: 'timestamp', default: 'now()' },
      ],
    }));

    // Test Results table
    await queryRunner.createTable(new Table({
      name: 'test_results',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true },
        { name: 'testId', type: 'uuid' },
        { name: 'parameters', type: 'jsonb' },
        { name: 'summary', type: 'text', isNullable: true },
        { name: 'interpretation', type: 'text', isNullable: true },
        { name: 'pdfUrl', type: 'varchar', isNullable: true },
        { name: 'isPatientNotified', type: 'boolean', default: false },
        { name: 'verifiedById', type: 'uuid', isNullable: true },
        { name: 'verifiedAt', type: 'timestamp', isNullable: true },
        { name: 'createdAt', type: 'timestamp', default: 'now()' },
        { name: 'updatedAt', type: 'timestamp', default: 'now()' },
      ],
    }));

    // Payments table
    await queryRunner.createTable(new Table({
      name: 'payments',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true },
        { name: 'invoiceNumber', type: 'varchar', length: '50', isUnique: true },
        { name: 'patientId', type: 'uuid' },
        { name: 'amount', type: 'decimal', precision: 10, scale: 2 },
        { name: 'discount', type: 'decimal', precision: 10, scale: 2, default: 0 },
        { name: 'tax', type: 'decimal', precision: 10, scale: 2, default: 0 },
        { name: 'totalAmount', type: 'decimal', precision: 10, scale: 2 },
        { name: 'status', type: 'enum', enum: ['pending', 'completed', 'failed', 'refunded'], default: "'pending'" },
        { name: 'paymentMethod', type: 'enum', enum: ['cash', 'card', 'online', 'insurance', 'upi'], default: "'cash'" },
        { name: 'transactionId', type: 'varchar', isNullable: true },
        { name: 'notes', type: 'text', isNullable: true },
        { name: 'createdAt', type: 'timestamp', default: 'now()' },
        { name: 'updatedAt', type: 'timestamp', default: 'now()' },
      ],
    }));

    // Notifications table
    await queryRunner.createTable(new Table({
      name: 'notifications',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true },
        { name: 'userId', type: 'uuid', isNullable: true },
        { name: 'patientId', type: 'uuid', isNullable: true },
        { name: 'title', type: 'varchar', length: '100' },
        { name: 'message', type: 'text' },
        { name: 'data', type: 'jsonb', isNullable: true },
        { name: 'channel', type: 'enum', enum: ['push', 'sms', 'whatsapp', 'email', 'in_app'], default: "'in_app'" },
        { name: 'status', type: 'enum', enum: ['pending', 'sent', 'delivered', 'failed', 'read'], default: "'pending'" },
        { name: 'sentAt', type: 'timestamp', isNullable: true },
        { name: 'readAt', type: 'timestamp', isNullable: true },
        { name: 'createdAt', type: 'timestamp', default: 'now()' },
      ],
    }));

    // Price Items table
    await queryRunner.createTable(new Table({
      name: 'price_items',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true },
        { name: 'name', type: 'varchar', length: '200' },
        { name: 'category', type: 'varchar', length: '100', isNullable: true },
        { name: 'description', type: 'text', isNullable: true },
        { name: 'price', type: 'decimal', precision: 10, scale: 2 },
        { name: 'costPrice', type: 'decimal', precision: 10, scale: 2, default: 0 },
        { name: 'isActive', type: 'boolean', default: true },
        { name: 'preparationInstructions', type: 'text', isNullable: true },
        { name: 'createdAt', type: 'timestamp', default: 'now()' },
        { name: 'updatedAt', type: 'timestamp', default: 'now()' },
      ],
    }));

    // Offers table
    await queryRunner.createTable(new Table({
      name: 'offers',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true },
        { name: 'title', type: 'varchar', length: '200' },
        { name: 'description', type: 'text', isNullable: true },
        { name: 'discountPercentage', type: 'decimal', precision: 5, scale: 2 },
        { name: 'applicableTests', type: 'jsonb', isNullable: true },
        { name: 'validFrom', type: 'date' },
        { name: 'validUntil', type: 'date' },
        { name: 'isActive', type: 'boolean', default: true },
        { name: 'couponCode', type: 'varchar', isNullable: true },
        { name: 'maxDiscount', type: 'decimal', precision: 10, scale: 2, isNullable: true },
        { name: 'minPurchase', type: 'decimal', precision: 10, scale: 2, isNullable: true },
        { name: 'createdAt', type: 'timestamp', default: 'now()' },
        { name: 'updatedAt', type: 'timestamp', default: 'now()' },
      ],
    }));

    // Indexes
    await queryRunner.createIndex('users', new TableIndex({ name: 'IDX_USERS_EMAIL', columnNames: ['email'] }));
    await queryRunner.createIndex('patients', new TableIndex({ name: 'IDX_PATIENTS_PATIENT_ID', columnNames: ['patientId'] }));
    await queryRunner.createIndex('lab_tests', new TableIndex({ name: 'IDX_TESTS_NUMBER', columnNames: ['testNumber'] }));
    await queryRunner.createIndex('lab_tests', new TableIndex({ name: 'IDX_TESTS_PATIENT', columnNames: ['patientId'] }));
    await queryRunner.createIndex('notifications', new TableIndex({ name: 'IDX_NOTIF_USER', columnNames: ['userId'] }));

    // Foreign keys
    await queryRunner.query(`ALTER TABLE patients ADD CONSTRAINT FK_patients_created_by FOREIGN KEY (createdById) REFERENCES users(id)`);
    await queryRunner.query(`ALTER TABLE lab_tests ADD CONSTRAINT FK_tests_patient FOREIGN KEY (patientId) REFERENCES patients(id)`);
    await queryRunner.query(`ALTER TABLE lab_tests ADD CONSTRAINT FK_tests_created_by FOREIGN KEY (createdById) REFERENCES users(id)`);
    await queryRunner.query(`ALTER TABLE lab_tests ADD CONSTRAINT FK_tests_assigned_to FOREIGN KEY (assignedToId) REFERENCES users(id)`);
    await queryRunner.query(`ALTER TABLE test_results ADD CONSTRAINT FK_results_test FOREIGN KEY (testId) REFERENCES lab_tests(id)`);
    await queryRunner.query(`ALTER TABLE test_results ADD CONSTRAINT FK_results_verified_by FOREIGN KEY (verifiedById) REFERENCES users(id)`);
    await queryRunner.query(`ALTER TABLE payments ADD CONSTRAINT FK_payments_patient FOREIGN KEY (patientId) REFERENCES patients(id)`);
    await queryRunner.query(`ALTER TABLE notifications ADD CONSTRAINT FK_notifications_user FOREIGN KEY (userId) REFERENCES users(id)`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('offers');
    await queryRunner.dropTable('price_items');
    await queryRunner.dropTable('notifications');
    await queryRunner.dropTable('payments');
    await queryRunner.dropTable('test_results');
    await queryRunner.dropTable('lab_tests');
    await queryRunner.dropTable('patients');
    await queryRunner.dropTable('users');
  }
}