// NODUS — Tipos compartidos MVP v1.0

export type Role = 'SUPER_ADMIN' | 'ADVISORY' | 'CONSULTOR' | 'MIPYME' | 'CONSULTOR_REVISOR';

export type CaseStatus =
  | 'CREADO' | 'EN_REVISION' | 'CLASIFICADO' | 'EN_POSTULACION' | 'ASIGNADO'
  | 'PROPUESTA_EN_DISENO' | 'PROPUESTA_LISTA_QA' | 'PROPUESTA_ENVIADA'
  | 'EN_DECISION' | 'AJUSTES' | 'PROPUESTA_ACEPTADA'
  | 'PENDIENTE_CONTRATACION' | 'AUTORIZADO_EJECUCION'
  | 'EN_EJECUCION' | 'CERRADO' | 'CERRADO_SIN_CONTRATACION';

export interface Company {
  id: string;
  name: string;
  nit?: string;
  emailDomain?: string;
  city?: string;
  sector?: string;
  status: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: string;
  companyId?: string;
  company?: Company;
}

export interface Consultant {
  id: string;
  userId: string;
  user: User;
  specialties: string[];
  level: 'EXPERTO' | 'SENIOR' | 'JUNIOR';
  maxComplexity: string;
  availability: 'DISPONIBLE' | 'OCUPADO' | 'INACTIVO';
  reputationScore?: number;
}

export interface Case {
  id: string;
  caseCode: string;
  title: string;
  description: string;
  area: string;
  urgency: 'ALTA' | 'MEDIA' | 'BAJA';
  impact: 'CRITICO' | 'ALTO' | 'MEDIO' | 'BAJO';
  complexity?: string;
  interventionType?: string;
  classification?: string;
  status: CaseStatus;
  companyId: string;
  company: Company;
  contactId: string;
  contact: User;
  consultantId?: string;
  consultant?: Consultant;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  caseId?: string;
  actorId: string;
  actor: { name: string; role: Role };
  action: string;
  entity: string;
  previousState?: string;
  newState?: string;
  description?: string;
  createdAt: string;
}

export interface Proposal {
  id: string;
  caseId: string;
  version: number;
  executiveSummary: string;
  objective: string;
  scope: string;
  exclusions?: string;
  activities: object[];
  deliverables: object[];
  timeline: object;
  effortValuation?: object;
  methodologicalReview?: object;
  status: string;
  createdAt: string;
}

export interface SlaAlert {
  id: string;
  caseId: string;
  level: 'preventiva' | 'critica' | 'escalada';
  triggeredAt: string;
  resolvedAt?: string;
}

// Plantilla T1 — Registro de necesidad
export interface T1Form {
  title: string;
  description: string;
  area: string;
  urgency: 'ALTA' | 'MEDIA' | 'BAJA';
  impact: 'CRITICO' | 'ALTO' | 'MEDIO' | 'BAJO';
  complexity?: string;
  companyId?: string;
}
