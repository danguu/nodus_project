import { Controller, Get, Post, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApplicationsService } from './applications.service';
import { Role } from '@prisma/client';

@ApiTags('Applications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class ApplicationsController {
  constructor(private applications: ApplicationsService) {}

  @Get('bolsa')
  @Roles(Role.CONSULTOR)
  @ApiOperation({ summary: 'Ver bolsa interna de casos (RF-027, RF-028)' })
  getBolsa(@Request() req: any) {
    return this.applications.getBolsa(req.user);
  }

  @Post('cases/:id/applications')
  @Roles(Role.CONSULTOR)
  @ApiOperation({ summary: 'Postular a un caso — T3C (RF-026 a RF-032)' })
  apply(@Param('id') id: string, @Body() dto: any, @Request() req: any) {
    return this.applications.apply(id, dto, req.user);
  }

  @Post('applications/:id/evaluate')
  @Roles(Role.ADVISORY, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Evaluar y asignar consultor — T3D (RF-033 a RF-036)' })
  evaluate(@Param('id') id: string, @Body() dto: any, @Request() req: any) {
    return this.applications.evaluate(id, dto, req.user);
  }
}
