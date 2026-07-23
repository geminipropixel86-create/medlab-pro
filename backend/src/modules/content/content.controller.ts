import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ContentService } from './content.service';

@ApiTags('Content Management')
@Controller('content')
export class ContentController {
  constructor(private service: ContentService) {}

  @Get(':slug')
  @ApiOperation({ summary: 'Get page content by slug' })
  getPage(@Param('slug') slug: string) {
    return this.service.getPage(slug);
  }

  @Put(':slug')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Update page content' })
  upsertPage(@Param('slug') slug: string, @Body() body: any) {
    return this.service.upsertPage(slug, body);
  }
}