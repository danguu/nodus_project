import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { WorkflowModule } from './workflow/workflow.module';
import { AuditModule } from './audit/audit.module';
import { SlaModule } from './sla/sla.module';
import { CasesModule } from './cases/cases.module';
import { LovModule } from './lov/lov.module';
import { CompaniesModule } from './companies/companies.module';
import { ClassificationModule } from './classification/classification.module';
import { ApplicationsModule } from './applications/applications.module';
import { ProposalsModule } from './proposals/proposals.module';
import { ClientDecisionsModule } from './client-decisions/client-decisions.module';
import { ContractingModule } from './contracting/contracting.module';
import { ExecutionModule } from './execution/execution.module';
import { ClosureModule } from './closure/closure.module';
import { ConsultantsModule } from './consultants/consultants.module';
import { DocumentsModule } from './documents/documents.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PmoModule } from './pmo/pmo.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    WorkflowModule,
    AuditModule,
    SlaModule,
    CasesModule,
    LovModule,
    CompaniesModule,
    ClassificationModule,
    ApplicationsModule,
    ProposalsModule,
    ClientDecisionsModule,
    ContractingModule,
    ExecutionModule,
    ClosureModule,
    ConsultantsModule,
    DocumentsModule,
    NotificationsModule,
    PmoModule,
  ],
})
export class AppModule {}
