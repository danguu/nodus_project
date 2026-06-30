import { Controller, Post, Put, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ProposalsService } from './proposals.service';
import { Role } from '@prisma/client';

@ApiTags('Proposals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class ProposalsController {
  constructor(private proposals: ProposalsService) {}

  @Post('cases/:id/proposals')
  @Roles(Role.CONSULTOR, Role.ADVISORY, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Crear propuesta v1 — TP4C (RF-037 a RF-045)' })
  create(@Param('id') id: string, @Body() dto: any, @Request() req: any) {
    return this.proposals.create(id, dto, req.user);
  }

  @Put('proposals/:id')
  @Roles(Role.CONSULTOR, Role.ADVISORY, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Actualizar propuesta — nueva versión (RF-041, RF-042)' })
  update(@Param('id') id: string, @Body() dto: any, @Request() req: any) {
    return this.proposals.update(id, dto, req.user);
  }

  @Post('proposals/:id/methodological-review')
  @Roles(Role.ADVISORY, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Revisión metodológica — TP4H (RF-046 a RF-054)' })
  review(@Param('id') id: string, @Body() dto: any, @Request() req: any) {
    return this.proposals.methodologicalReview(id, dto, req.user);
  }

  @Post('proposals/:id/authorize-send')
  @Roles(Role.ADVISORY, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Autorizar envío al cliente (RF-055, RF-056)' })
  authorizeSend(@Param('id') id: string, @Request() req: any) {
    return this.proposals.authorizeSend(id, req.user);
  }
}
