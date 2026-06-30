import { Controller, Post, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ClosureService } from './closure.service';
import { Role } from '@prisma/client';

@ApiTags('Closure')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('cases/:id')
export class ClosureController {
  constructor(private closure: ClosureService) {}

  @Post('technical-closure')
  @Roles(Role.CONSULTOR, Role.ADVISORY, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Declarar cierre técnico T9A (RF-081)' })
  technicalClosure(@Param('id') id: string, @Body() dto: any, @Request() req: any) {
    return this.closure.technicalClosure(id, dto, req.user);
  }

  @Post('final-deliverables')
  @Roles(Role.CONSULTOR, Role.ADVISORY, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Confirmar entregables finales T9B (RF-082)' })
  finalDeliverables(@Param('id') id: string, @Body() dto: any) {
    return this.closure.finalDeliverables(id, dto);
  }

  @Post('final-review')
  @Roles(Role.ADVISORY, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Revisión final T9C y acta T9D (RF-083)' })
  finalReview(@Param('id') id: string, @Body() dto: any, @Request() req: any) {
    return this.closure.finalReview(id, dto, req.user);
  }

  @Post('client-acceptance')
  @Roles(Role.MIPYME, Role.ADVISORY, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Aceptación del cliente T9F (RF-084)' })
  clientAcceptance(@Param('id') id: string, @Body() dto: any, @Request() req: any) {
    return this.closure.clientAcceptance(id, dto, req.user);
  }

  @Post('satisfaction-survey')
  @Roles(Role.MIPYME)
  @ApiOperation({ summary: 'Encuesta de satisfacción T9G (RF-085, RF-086)' })
  satisfactionSurvey(@Param('id') id: string, @Body() dto: any) {
    return this.closure.satisfactionSurvey(id, dto);
  }

  @Post('consultant-evaluation')
  @Roles(Role.ADVISORY, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Evaluación de consultor T9H (RF-087)' })
  consultantEvaluation(@Param('id') id: string, @Body() dto: any, @Request() req: any) {
    return this.closure.consultantEvaluation(id, dto, req.user);
  }
}
