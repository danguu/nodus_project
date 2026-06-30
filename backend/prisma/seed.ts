import { PrismaClient, Role, Urgency, Impact, Complexity, ConsultorLevel, CaseStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding NODUS database...');

  // ── LOV Items ──────────────────────────────────────────────
  const lovData = [
    { category: 'area', value: 'Tecnología', label: 'Tecnología', order: 1 },
    { category: 'area', value: 'Finanzas', label: 'Finanzas', order: 2 },
    { category: 'area', value: 'Operaciones', label: 'Operaciones', order: 3 },
    { category: 'area', value: 'Estrategia', label: 'Estrategia', order: 4 },
    { category: 'area', value: 'Legal', label: 'Legal', order: 5 },
    { category: 'area', value: 'RRHH', label: 'RRHH', order: 6 },
    { category: 'area', value: 'Analítica', label: 'Analítica', order: 7 },
    { category: 'area', value: 'Transformación digital', label: 'Transformación digital', order: 8 },
    { category: 'intervention_type', value: 'Diagnóstico', label: 'Diagnóstico', order: 1 },
    { category: 'intervention_type', value: 'Evaluación', label: 'Evaluación', order: 2 },
    { category: 'intervention_type', value: 'Diseño', label: 'Diseño', order: 3 },
    { category: 'intervention_type', value: 'Implementación', label: 'Implementación', order: 4 },
    { category: 'intervention_type', value: 'Optimización', label: 'Optimización', order: 5 },
    { category: 'intervention_type', value: 'Acompañamiento', label: 'Acompañamiento', order: 6 },
    { category: 'incident_type', value: 'Retraso cliente', label: 'Retraso cliente', order: 1 },
    { category: 'incident_type', value: 'Falta información', label: 'Falta información', order: 2 },
    { category: 'incident_type', value: 'Cambio de alcance', label: 'Cambio de alcance', order: 3 },
    { category: 'incident_type', value: 'Bloqueo operativo', label: 'Bloqueo operativo', order: 4 },
    { category: 'urgency', value: 'ALTA', label: 'Alta', order: 1 },
    { category: 'urgency', value: 'MEDIA', label: 'Media', order: 2 },
    { category: 'urgency', value: 'BAJA', label: 'Baja', order: 3 },
    { category: 'impact', value: 'CRITICO', label: 'Crítico', order: 1 },
    { category: 'impact', value: 'ALTO', label: 'Alto', order: 2 },
    { category: 'impact', value: 'MEDIO', label: 'Medio', order: 3 },
    { category: 'impact', value: 'BAJO', label: 'Bajo', order: 4 },
    { category: 'complexity', value: 'ESTRATEGICO', label: 'Estratégico', order: 1 },
    { category: 'complexity', value: 'ALTO', label: 'Alto', order: 2 },
    { category: 'complexity', value: 'MEDIO', label: 'Medio', order: 3 },
    { category: 'complexity', value: 'BAJO', label: 'Bajo', order: 4 },
    { category: 'clasificacion', value: 'Implementación tecnológica', label: 'Implementación tecnológica', order: 1 },
    { category: 'clasificacion', value: 'Reestructuración financiera', label: 'Reestructuración financiera', order: 2 },
    { category: 'clasificacion', value: 'Optimización operativa', label: 'Optimización operativa', order: 3 },
    { category: 'clasificacion', value: 'Planeación estratégica', label: 'Planeación estratégica', order: 4 },
    { category: 'clasificacion', value: 'Cumplimiento legal', label: 'Cumplimiento legal', order: 5 },
    { category: 'clasificacion', value: 'Gestión del cambio', label: 'Gestión del cambio', order: 6 },
  ];

  for (const lov of lovData) {
    await prisma.lovItem.upsert({
      where: { category_value: { category: lov.category, value: lov.value } },
      update: {},
      create: lov,
    });
  }

  // ── SLA Rules ──────────────────────────────────────────────
  const slaRules = [
    { id: 'CREADO_EN_REVISION', module: 'CREADO_EN_REVISION', hours: 24, preventivePct: 70, criticalPct: 90, escalationLevel: 'Advisory' },
    { id: 'EN_REVISION_CLASIFICADO', module: 'EN_REVISION_CLASIFICADO', hours: 48, preventivePct: 70, criticalPct: 90, escalationLevel: 'Advisory' },
    { id: 'CLASIFICADO_ASIGNADO', module: 'CLASIFICADO_ASIGNADO', hours: 72, preventivePct: 70, criticalPct: 90, escalationLevel: 'Advisory' },
    { id: 'PROPUESTA_EN_DISENO', module: 'PROPUESTA_EN_DISENO', hours: 168, preventivePct: 70, criticalPct: 90, escalationLevel: 'Consultor' },
    { id: 'QA_ENVIO', module: 'QA_ENVIO', hours: 48, preventivePct: 70, criticalPct: 90, escalationLevel: 'Advisory' },
    { id: 'EN_DECISION', module: 'EN_DECISION', hours: 120, preventivePct: 70, criticalPct: 90, escalationLevel: 'Mipyme' },
    { id: 'CONTRATACION', module: 'CONTRATACION', hours: 72, preventivePct: 70, criticalPct: 90, escalationLevel: 'Advisory' },
    { id: 'EN_EJECUCION', module: 'EN_EJECUCION', hours: 720, preventivePct: 70, criticalPct: 90, escalationLevel: 'Advisory' },
  ];

  for (const rule of slaRules) {
    await prisma.slaRule.upsert({
      where: { id: rule.id },
      update: { hours: rule.hours, preventivePct: rule.preventivePct, criticalPct: rule.criticalPct },
      create: rule,
    });
  }

  // ── Users ──────────────────────────────────────────────────
  const hash = await bcrypt.hash('Admin2026!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@911mipyme.co' },
    update: {},
    create: {
      name: 'Super Admin', email: 'admin@911mipyme.co', password: hash, role: Role.SUPER_ADMIN,
    },
  });

  const advisory = await prisma.user.upsert({
    where: { email: 'advisory@911mipyme.co' },
    update: {},
    create: {
      name: 'Advisory NODUS', email: 'advisory@911mipyme.co',
      password: await bcrypt.hash('Advisory2026!', 10), role: Role.ADVISORY,
    },
  });

  const consultorData = [
    { name: 'María López', email: 'mlopez@nodus.co', specs: ['Tecnología', 'Analítica'], level: ConsultorLevel.EXPERTO },
    { name: 'Carlos Ríos', email: 'crios@nodus.co', specs: ['Finanzas', 'Estrategia'], level: ConsultorLevel.SENIOR },
    { name: 'Ana Torres', email: 'atorres@nodus.co', specs: ['RRHH', 'Operaciones'], level: ConsultorLevel.SENIOR },
    { name: 'Pedro Martínez', email: 'pmartinez@nodus.co', specs: ['Legal', 'Transformación digital'], level: ConsultorLevel.JUNIOR },
  ];

  const consultants: any[] = [];
  for (const c of consultorData) {
    const u = await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: {
        name: c.name, email: c.email,
        password: await bcrypt.hash('Consultor2026!', 10), role: Role.CONSULTOR,
      },
    });
    const cons = await prisma.consultant.upsert({
      where: { userId: u.id },
      update: {},
      create: {
        userId: u.id, specialties: c.specs, level: c.level,
        maxComplexity: Complexity.ALTO, availability: 'DISPONIBLE',
      },
    });
    consultants.push(cons);
  }

  // ── Companies + Mipymes ────────────────────────────────────
  const companies = [
    { name: 'TechCol SAS', nit: '900.123.456-7', city: 'Bogotá', sector: 'Tecnología', user: { name: 'Jorge Ramírez', email: 'jorge@techcol.co' } },
    { name: 'FinanCorp Ltda', nit: '900.987.654-3', city: 'Medellín', sector: 'Finanzas', user: { name: 'Laura Gómez', email: 'laura@financorp.co' } },
    { name: 'OperaSoluciones', nit: '901.456.789-0', city: 'Cali', sector: 'Operaciones', user: { name: 'Carlos Mesa', email: 'carlos@operasol.co' } },
  ];

  const companyRecords: any[] = [];
  for (const co of companies) {
    const company = await prisma.company.upsert({
      where: { nit: co.nit },
      update: {},
      create: { name: co.name, nit: co.nit, city: co.city, sector: co.sector },
    });
    companyRecords.push(company);

    await prisma.user.upsert({
      where: { email: co.user.email },
      update: {},
      create: {
        name: co.user.name, email: co.user.email,
        password: await bcrypt.hash('Mipyme2026!', 10), role: Role.MIPYME, companyId: company.id,
      },
    });
  }

  // ── Demo Cases ─────────────────────────────────────────────
  const mipyme1 = await prisma.user.findUnique({ where: { email: 'jorge@techcol.co' } });
  const mipyme2 = await prisma.user.findUnique({ where: { email: 'laura@financorp.co' } });
  const mipyme3 = await prisma.user.findUnique({ where: { email: 'carlos@operasol.co' } });

  const casesData = [
    {
      caseCode: 'NOD-2026-001', title: 'Modernización ERP con integración DIAN',
      description: 'Modernización del ERP interno con integración a facturación electrónica DIAN.',
      area: 'Tecnología', urgency: Urgency.ALTA, impact: Impact.CRITICO, complexity: Complexity.ALTO,
      classification: 'Implementación tecnológica', status: CaseStatus.EN_EJECUCION,
      companyId: companyRecords[0].id, contactId: mipyme1!.id, consultantId: consultants[0].id,
    },
    {
      caseCode: 'NOD-2026-002', title: 'Reestructuración financiera integral',
      description: 'Diagnóstico y reestructuración de procesos financieros y fiscales.',
      area: 'Finanzas', urgency: Urgency.ALTA, impact: Impact.ALTO, complexity: Complexity.ALTO,
      classification: 'Reestructuración financiera', status: CaseStatus.PROPUESTA_ENVIADA,
      companyId: companyRecords[1].id, contactId: mipyme2!.id, consultantId: consultants[1].id,
    },
    {
      caseCode: 'NOD-2026-003', title: 'Optimización de cadena de suministro',
      description: 'Análisis y optimización de la cadena de suministro para reducir costos operativos.',
      area: 'Operaciones', urgency: Urgency.MEDIA, impact: Impact.MEDIO, complexity: Complexity.MEDIO,
      classification: 'Optimización operativa', status: CaseStatus.CREADO,
      companyId: companyRecords[2].id, contactId: mipyme3!.id,
    },
  ];

  for (const c of casesData) {
    const caso = await prisma.case.upsert({
      where: { caseCode: c.caseCode },
      update: {},
      create: c,
    });

    const existingLog = await prisma.auditLog.findFirst({ where: { caseId: caso.id } });
    if (!existingLog) {
      await prisma.auditLog.create({
        data: { caseId: caso.id, actorId: admin.id, action: 'Caso creado — seed inicial', entity: 'Case', newState: c.status },
      });
    }
  }

  console.log('Seed completed successfully.');
  console.log('Usuarios de prueba:');
  console.log('  admin@911mipyme.co / Admin2026!');
  console.log('  advisory@911mipyme.co / Advisory2026!');
  console.log('  mlopez@nodus.co / Consultor2026!');
  console.log('  jorge@techcol.co / Mipyme2026!');
  console.log('  laura@financorp.co / Mipyme2026!');
  console.log('  carlos@operasol.co / Mipyme2026!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
