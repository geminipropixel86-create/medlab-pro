import {
  Controller, Get, Post, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Controller('payments')
export class PaymentsController {
  constructor(private service: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a payment record' })
  create(@Body() dto: any) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List payments' })
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Monthly revenue statistics' })
  getRevenue() {
    return this.service.getRevenueStats();
  }

  @Get('summary')
  @ApiOperation({ summary: 'Payment summary' })
  getSummary() {
    return this.service.getSummary();
  }
}