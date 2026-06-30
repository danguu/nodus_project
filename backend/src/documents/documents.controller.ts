import { Controller, Get, Post, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { DocumentsService } from './documents.service';

@ApiTags('Documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class DocumentsController {
  constructor(private documents: DocumentsService) {}

  @Post('documents/upload')
  @ApiOperation({ summary: 'Generar URL firmada para subir documento (RT-019 a RT-023)' })
  getUploadUrl(@Body() dto: any, @Request() req: any) {
    return this.documents.getUploadUrl(dto.caseId, dto, req.user);
  }

  @Get('cases/:id/documents')
  @ApiOperation({ summary: 'Listar documentos del caso agrupados por etapa' })
  getCaseDocuments(@Param('id') id: string, @Request() req: any) {
    return this.documents.getCaseDocuments(id, req.user);
  }
}
