import { Controller, Get, Post, Patch, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ContractingService } from './contracting.service';
import { Role } from '@prisma/client';

@ApiTags('Contracting')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('cases/:id')
export class ContractingController {
  constructor(private contracting: ContractingService) {}

  @Get('checklist')
  @Roles(Role.ADVISORY, Role.SUPER_ADMIN, Role.CONSULTOR)
  @ApiOperation({ summary: 'Ver checklist T7A (RF-066, RF-067)' })
  getChecklist(@Param('id') id: string) {
    return this.contracting.getChecklist(id);
  }

  @Patch('checklist/:itemId')
  @Roles(Role.ADVISORY, Role.SUPER_ADMIN, Role.CONSULTOR)
  @ApiOperation({ summary: 'Actualizar ítem del checklist T7A' })
  updateChecklistItem(@Param('id') id: string, @Param('itemId') itemId: string, @Body() dto: any) {
    return this.contracting.updateChecklistItem(id, itemId, dto);
  }

  @Post('operational-framework')
  @Roles(Role.ADVISORY, Role.SUPER_ADMIN, Role.CONSULTOR)
  @ApiOperation({ summary: 'Crear marco operativo T7B (RF-068, RF-069)' })
  createOperationalFramework(@Param('id') id: string, @Body() dto: any, @Request() req: any) {
    return this.contracting.createOperationalFramework(id, dto);
  }

  @Post('authorize-execution')
  @Roles(Role.ADVISORY, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Autorizar ejecución — RF-070 (valida checklist + T7B)' })
  authorizeExecution(@Param('id') id: string, @Request() req: any) {
    return this.contracting.authorizeExecution(id, req.user);
  }
}
