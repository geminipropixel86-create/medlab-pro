import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { LabTest } from '../tests/test.entity';
import { Patient } from '../patients/patient.entity';
import { TestResult } from '../results/result.entity';
import { Payment } from '../payments/payment.entity';
import { TestsModule } from '../tests/tests.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LabTest, Patient, TestResult, Payment]),
    TestsModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}