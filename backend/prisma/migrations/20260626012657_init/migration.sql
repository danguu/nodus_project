-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADVISORY', 'CONSULTOR', 'MIPYME', 'CONSULTOR_REVISOR');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVO', 'INACTIVO', 'PENDIENTE');

-- CreateEnum
CREATE TYPE "Urgency" AS ENUM ('ALTA', 'MEDIA', 'BAJA');

-- CreateEnum
CREATE TYPE "Impact" AS ENUM ('CRITICO', 'ALTO', 'MEDIO', 'BAJO');

-- CreateEnum
CREATE TYPE "Complexity" AS ENUM ('ESTRATEGICO', 'ALTO', 'MEDIO', 'BAJO');

-- CreateEnum
CREATE TYPE "ConsultorLevel" AS ENUM ('EXPERTO', 'SENIOR', 'JUNIOR');

-- CreateEnum
CREATE TYPE "Availability" AS ENUM ('DISPONIBLE', 'OCUPADO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('CREADO', 'EN_REVISION', 'CLASIFICADO', 'EN_POSTULACION', 'ASIGNADO', 'PROPUESTA_EN_DISENO', 'PROPUESTA_LISTA_QA', 'PROPUESTA_ENVIADA', 'EN_DECISION', 'AJUSTES', 'PROPUESTA_ACEPTADA', 'PENDIENTE_CONTRATACION', 'AUTORIZADO_EJECUCION', 'EN_EJECUCION', 'CERRADO', 'CERRADO_SIN_CONTRATACION');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDIENTE', 'EVALUADA', 'ASIGNADA', 'RECHAZADA');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('BORRADOR', 'EN_REVISION', 'LISTA_QA', 'ENVIADA', 'ACEPTADA', 'AJUSTES', 'RECHAZADA');

-- CreateEnum
CREATE TYPE "ActivityStatus" AS ENUM ('NO_INICIADA', 'EN_CURSO', 'COMPLETADA', 'BLOQUEADA', 'REPROGRAMADA');

-- CreateEnum
CREATE TYPE "MilestoneStatus" AS ENUM ('PENDIENTE', 'CUMPLIDO', 'VENCIDO', 'REPROGRAMADO');

-- CreateEnum
CREATE TYPE "DeliverableStatus" AS ENUM ('PENDIENTE', 'EN_DESARROLLO', 'CARGADO', 'EN_REVISION_D', 'AJUSTADO', 'LISTO_CIERRE');

-- CreateEnum
CREATE TYPE "NotifChannel" AS ENUM ('EMAIL', 'WHATSAPP', 'IN_APP');

-- CreateEnum
CREATE TYPE "NotifStatus" AS ENUM ('ENVIADO', 'FALLIDO', 'LEIDO');

-- CreateEnum
CREATE TYPE "EvalType" AS ENUM ('SATISFACCION_CLIENTE', 'DESEMPENO_CONSULTOR');

-- CreateEnum
CREATE TYPE "MeetingType" AS ENUM ('PRESENTACION_PROPUESTA', 'CIERRE');

-- CreateEnum
CREATE TYPE "DocStage" AS ENUM ('ONBOARDING', 'EVALUACION', 'BOLSA', 'PROPUESTA', 'DECISION', 'CONTRATACION', 'EJECUCION', 'CIERRE');

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email_domain" TEXT,
    "nit" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Colombia',
    "city" TEXT,
    "sector" TEXT,
    "status" TEXT NOT NULL DEFAULT 'activa',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "company_id" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultants" (
    "id" TEXT NOT NULL,
    "specialties" TEXT[],
    "level" "ConsultorLevel" NOT NULL,
    "max_complexity" "Complexity" NOT NULL,
    "availability" "Availability" NOT NULL DEFAULT 'DISPONIBLE',
    "reputation_score" DECIMAL(65,30),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "consultants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cases" (
    "id" TEXT NOT NULL,
    "case_code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "urgency" "Urgency" NOT NULL,
    "impact" "Impact" NOT NULL,
    "complexity" "Complexity",
    "intervention_type" TEXT,
    "classification" TEXT,
    "status" "CaseStatus" NOT NULL DEFAULT 'CREADO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "company_id" TEXT NOT NULL,
    "contact_id" TEXT NOT NULL,
    "consultant_id" TEXT,

    CONSTRAINT "cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "interest_statement" TEXT NOT NULL,
    "relevant_experience" TEXT NOT NULL,
    "availability_confirmed" BOOLEAN NOT NULL,
    "evaluation_notes" TEXT,
    "evaluation_score" INTEGER,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDIENTE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "case_id" TEXT NOT NULL,
    "consultant_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposals" (
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "executive_summary" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "exclusions" TEXT,
    "activities" JSONB NOT NULL,
    "deliverables" JSONB NOT NULL,
    "timeline" JSONB NOT NULL,
    "effort_valuation" JSONB,
    "conditions_assumptions" TEXT,
    "methodological_review" JSONB,
    "peer_review_notes" TEXT,
    "status" "ProposalStatus" NOT NULL DEFAULT 'BORRADOR',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "case_id" TEXT NOT NULL,
    "consultant_id" TEXT NOT NULL,

    CONSTRAINT "proposals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposal_attachments" (
    "id" TEXT NOT NULL,
    "template_code" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "proposal_id" TEXT NOT NULL,

    CONSTRAINT "proposal_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_decisions" (
    "id" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "adjustment_request" TEXT,
    "consultant_response" TEXT,
    "formal_acceptance" JSONB,
    "closure_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "case_id" TEXT NOT NULL,
    "proposal_id" TEXT NOT NULL,

    CONSTRAINT "client_decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contracting_items" (
    "id" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "responsible" TEXT NOT NULL,
    "target_date" TIMESTAMP(3) NOT NULL,
    "completion_date" TIMESTAMP(3),
    "evidence_path" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pendiente',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "case_id" TEXT NOT NULL,

    CONSTRAINT "contracting_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operational_frameworks" (
    "id" TEXT NOT NULL,
    "operating_conditions" TEXT NOT NULL,
    "estimated_duration" TEXT NOT NULL,
    "main_milestones" JSONB NOT NULL,
    "base_schedule" JSONB NOT NULL,
    "committed_deliverables" JSONB NOT NULL,
    "client_dependencies" TEXT,
    "assumptions" TEXT,
    "execution_constraints" TEXT,
    "primary_contact_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "case_id" TEXT NOT NULL,

    CONSTRAINT "operational_frameworks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "execution_agendas" (
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "case_id" TEXT NOT NULL,

    CONSTRAINT "execution_agendas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "target_date" TIMESTAMP(3) NOT NULL,
    "status" "ActivityStatus" NOT NULL DEFAULT 'NO_INICIADA',
    "evidence_path" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agenda_id" TEXT NOT NULL,
    "responsible_id" TEXT NOT NULL,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "milestones" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "target_date" TIMESTAMP(3) NOT NULL,
    "expected_deliverable" TEXT NOT NULL,
    "criticality" TEXT NOT NULL,
    "status" "MilestoneStatus" NOT NULL DEFAULT 'PENDIENTE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agenda_id" TEXT NOT NULL,
    "responsible_id" TEXT NOT NULL,

    CONSTRAINT "milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incidents" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "impact" TEXT NOT NULL,
    "suggested_action" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'abierta',
    "decision" TEXT,
    "reported_by" TEXT NOT NULL,
    "reported_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "case_id" TEXT NOT NULL,

    CONSTRAINT "incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deliverables" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "target_date" TIMESTAMP(3) NOT NULL,
    "status" "DeliverableStatus" NOT NULL DEFAULT 'PENDIENTE',
    "version" INTEGER NOT NULL DEFAULT 1,
    "file_path" TEXT,
    "is_final" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "case_id" TEXT NOT NULL,
    "responsible_id" TEXT NOT NULL,

    CONSTRAINT "deliverables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "stage" "DocStage" NOT NULL,
    "type" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "case_id" TEXT NOT NULL,
    "uploaded_by_id" TEXT NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "previous_state" TEXT,
    "new_state" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "case_id" TEXT,
    "company_id" TEXT,
    "actor_id" TEXT NOT NULL,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sla_rules" (
    "id" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "hours" INTEGER NOT NULL,
    "preventive_pct" INTEGER NOT NULL DEFAULT 75,
    "critical_pct" INTEGER NOT NULL DEFAULT 90,
    "escalation_level" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "sla_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sla_alerts" (
    "id" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "triggered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),
    "case_id" TEXT NOT NULL,
    "sla_rule_id" TEXT NOT NULL,
    "escalated_to_id" TEXT,

    CONSTRAINT "sla_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "template_code" TEXT NOT NULL,
    "channel" "NotifChannel" NOT NULL,
    "status" "NotifStatus" NOT NULL DEFAULT 'ENVIADO',
    "payload" JSONB,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "case_id" TEXT,
    "recipient_id" TEXT NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluations" (
    "id" TEXT NOT NULL,
    "type" "EvalType" NOT NULL,
    "target_id" TEXT NOT NULL,
    "scores" JSONB NOT NULL,
    "comments" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "case_id" TEXT NOT NULL,

    CONSTRAINT "evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meetings" (
    "id" TEXT NOT NULL,
    "type" "MeetingType" NOT NULL,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "participants" JSONB NOT NULL,
    "summary" TEXT,
    "meeting_link" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "case_id" TEXT NOT NULL,

    CONSTRAINT "meetings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lov_items" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "lov_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_email_domain_key" ON "companies"("email_domain");

-- CreateIndex
CREATE UNIQUE INDEX "companies_nit_key" ON "companies"("nit");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "consultants_user_id_key" ON "consultants"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "cases_case_code_key" ON "cases"("case_code");

-- CreateIndex
CREATE UNIQUE INDEX "operational_frameworks_case_id_key" ON "operational_frameworks"("case_id");

-- CreateIndex
CREATE UNIQUE INDEX "lov_items_category_value_key" ON "lov_items"("category", "value");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultants" ADD CONSTRAINT "consultants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_consultant_id_fkey" FOREIGN KEY ("consultant_id") REFERENCES "consultants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_consultant_id_fkey" FOREIGN KEY ("consultant_id") REFERENCES "consultants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_consultant_id_fkey" FOREIGN KEY ("consultant_id") REFERENCES "consultants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_attachments" ADD CONSTRAINT "proposal_attachments_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_decisions" ADD CONSTRAINT "client_decisions_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracting_items" ADD CONSTRAINT "contracting_items_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operational_frameworks" ADD CONSTRAINT "operational_frameworks_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "execution_agendas" ADD CONSTRAINT "execution_agendas_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_agenda_id_fkey" FOREIGN KEY ("agenda_id") REFERENCES "execution_agendas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_responsible_id_fkey" FOREIGN KEY ("responsible_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_agenda_id_fkey" FOREIGN KEY ("agenda_id") REFERENCES "execution_agendas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_responsible_id_fkey" FOREIGN KEY ("responsible_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliverables" ADD CONSTRAINT "deliverables_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliverables" ADD CONSTRAINT "deliverables_responsible_id_fkey" FOREIGN KEY ("responsible_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sla_alerts" ADD CONSTRAINT "sla_alerts_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sla_alerts" ADD CONSTRAINT "sla_alerts_sla_rule_id_fkey" FOREIGN KEY ("sla_rule_id") REFERENCES "sla_rules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sla_alerts" ADD CONSTRAINT "sla_alerts_escalated_to_id_fkey" FOREIGN KEY ("escalated_to_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
