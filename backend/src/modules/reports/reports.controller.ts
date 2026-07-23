import { Controller, Get, Post, Delete, Param, Query, Res, Body } from '@nestjs/common';
import { Response } from 'express';
import { ReportsService } from './reports.service';

@Controller('api/reports')
export class ReportsController {
  constructor(private service: ReportsService) {}

  @Get('dashboard')
  getDashboardStats() {
    return this.service.getDashboardStats();
  }

  @Get('financial')
  getFinancialReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.service.getFinancialReport(startDate, endDate);
  }

  @Get('patients')
  getPatientStats() {
    return this.service.getPatientStats();
  }

  @Get('test-categories')
  getTestCategoryStats() {
    return this.service.getTestCategoryStats();
  }

  @Get('export/:type')
  async exportCsv(
    @Param('type') type: 'patients' | 'tests' | 'payments' | 'income-outcome',
    @Res() res: Response,
  ) {
    const csv = await this.service.exportToCsv(type);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${type}-${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csv);
  }

  @Post('subscribe')
  subscribeToReports(@Body() body: { email: string; frequency?: 'daily' | 'weekly' }) {
    return this.service.subscribeToEmailReports(body.email, body.frequency || 'daily');
  }

  @Delete('unsubscribe/:id')
  unsubscribeFromReports(@Param('id') id: string) {
    return this.service.unsubscribeFromReports(id);
  }
}