import {
  Controller, Get, Post, Put, Body, Param, Query,
  UseGuards, Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ResultsService } from './results.service';

@ApiTags('Test Results')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Controller('results')
export class ResultsController {
  constructor(private service: ResultsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit test results' })
  create(@Body() dto: any) {
    return this.service.create(dto);
  }

  @Get('test/:testId')
  @ApiOperation({ summary: 'Get result by test ID' })
  findByTest(@Param('testId') testId: string) {
    return this.service.findByTest(testId);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get all results for a patient' })
  getPatientResults(@Param('patientId') patientId: string) {
    return this.service.getPatientResults(patientId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update result' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.service.update(id, dto);
  }

  @Put(':id/verify')
  @ApiOperation({ summary: 'Verify a test result' })
  verify(@Param('id') id: string, @Req() req) {
    return this.service.verify(id, req.user.id);
  }
}