import { Module } from '@nestjs/common';
import { ClientDecisionsController } from './client-decisions.controller';
import { ClientDecisionsService } from './client-decisions.service';
import { WorkflowModule } from '../workflow/workflow.module';

@Module({
  imports: [WorkflowModule],
  controllers: [ClientDecisionsController],
  providers: [ClientDecisionsService],
})
export class ClientDecisionsModule {}
