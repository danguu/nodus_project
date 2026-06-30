import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private resend: Resend;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.resend = new Resend(this.config.get('RESEND_API_KEY', 're_placeholder'));
  }

  async send(recipientId: string, templateCode: string, caseId: string, channel: string = 'EMAIL') {
    const recipient = await this.prisma.user.findUnique({ where: { id: recipientId } });
    if (!recipient) {
      this.logger.warn(`Recipient ${recipientId} not found`);
      return;
    }

    const templates: Record<string, { subject: string; text: string }> = {
      CASO_CREADO: { subject: 'Caso creado exitosamente', text: 'Su caso ha sido creado y está en revisión.' },
      CASO_CLASIFICADO: { subject: 'Su caso ha sido clasificado', text: 'Su caso ha sido clasificado por nuestro equipo.' },
      CASO_EN_BOLSA: { subject: 'Nuevo caso en bolsa', text: 'Un nuevo caso está disponible para postulación.' },
      CONSULTOR_ASIGNADO: { subject: 'Consultor asignado a su caso', text: 'Se ha asignado un consultor a su caso.' },
      PROPUESTA_ENVIADA: { subject: 'Propuesta enviada', text: 'La propuesta para su caso ha sido enviada.' },
      PROPUESTA_ACEPTADA: { subject: 'Propuesta aceptada', text: 'Su propuesta ha sido aceptada por el cliente.' },
      CONTRATACION_AUTORIZADA: { subject: 'Contratación autorizada', text: 'La contratación ha sido autorizada.' },
      CASO_CERRADO: { subject: 'Caso cerrado', text: 'Su caso ha sido cerrado exitosamente.' },
    };

    const tmpl = templates[templateCode];
    if (!tmpl) {
      this.logger.warn(`Template ${templateCode} not found`);
      return;
    }

    try {
      if (channel === 'EMAIL' && this.config.get('RESEND_API_KEY')) {
        await this.resend.emails.send({
          from: this.config.get('EMAIL_FROM', 'nodus@911mipyme.co'),
          to: recipient.email,
          subject: tmpl.subject,
          text: tmpl.text,
        });
      }

      await this.prisma.notification.create({
        data: {
          recipientId,
          templateCode,
          caseId,
          channel: channel as any,
          status: 'ENVIADO',
          payload: { subject: tmpl.subject, text: tmpl.text },
        },
      });
    } catch (error) {
      this.logger.error(`Failed to send notification: ${error}`);

      await this.prisma.notification.create({
        data: {
          recipientId,
          templateCode,
          caseId,
          channel: channel as any,
          status: 'FALLIDO',
          payload: { error: String(error) },
        },
      });
    }
  }
}
