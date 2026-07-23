import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  UseGuards, Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PatientsService } from './patients.service';

@ApiTags('Patients')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Controller('patients')
export class PatientsController {
  constructor(private service: PatientsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new patient' })
  create(@Body() dto: any, @Req() req) {
    return this.service.create(dto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'List all patients' })
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Patient statistics' })
  getStats() {
    return this.service.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get patient by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update patient' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate patient' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}