import { Controller, Get, Post, Patch, Body, Param, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { TransitionCaseDto } from './dto/transition-case.dto';

@ApiTags('Cases')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear caso — Plantilla T1 (RF-007 a RF-014)' })
  create(@Body() dto: CreateCaseDto, @Request() req: any) {
    return this.casesService.create(dto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Listar casos filtrable por estado, empresa, consultor' })
  findAll(@Query() query: any, @Request() req: any) {
    return this.casesService.findAll(query, req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalle del caso + timeline' })
  findOne(@Param('id') id: string) {
    return this.casesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar caso — solo en estado CREADO (RF-013)' })
  update(@Param('id') id: string, @Body() dto: CreateCaseDto, @Request() req: any) {
    return this.casesService.update(id, dto, req.user);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Transición de estado — valida workflow engine (RF-016,024,034,etc.)' })
  transition(@Param('id') id: string, @Body() dto: TransitionCaseDto, @Request() req: any) {
    return this.casesService.transition(id, dto, req.user);
  }

  @Get(':id/audit-log')
  @ApiOperation({ summary: 'Bitácora completa del caso (solo lectura, RT-001 a RT-005)' })
  auditLog(@Param('id') id: string) {
    return this.casesService.getAuditLog(id);
  }
}
