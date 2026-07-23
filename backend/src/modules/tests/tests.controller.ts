import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  UseGuards, Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TestsService } from './tests.service';

@ApiTags('Lab Tests')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Controller('tests')
export class TestsController {
  constructor(private service: TestsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new lab test' })
  create(@Body() dto: any, @Req() req: any) {
    return this.service.create(dto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'List all tests' })
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Test statistics' })
  getStats() {
    return this.service.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get test by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update test' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.service.update(id, dto);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update test status' })
  updateStatus(@Param('id') id: string, @Body('status') status: string, @Req() req: any) {
    return this.service.updateStatus(id, status as any, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel test' })
  remove(@Param('id') id: string) {
    return this.service.updateStatus(id, 'cancelled' as any);
  }
}