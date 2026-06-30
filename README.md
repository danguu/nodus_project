# NODUS — Plataforma SaaS de Orquestación Empresarial
### 911MiPyme · MVP v1.0

## ¿Qué es NODUS?

Sistema web que digitaliza el modelo operativo de 911MiPyme: conecta Mipymes con
consultores bajo gobierno metodológico estricto, trazabilidad completa y control
documental. Cada caso atraviesa un workflow de 14 estados con plantillas T1–T9H,
bitácora inmutable, SLA parametrizables y RBAC multi-rol.

## Stack tecnológico

### Frontend
- Next.js 15 + React + TypeScript
- TailwindCSS + Shadcn/UI + Framer Motion + Lucide Icons
- Zustand (estado global) + TanStack Query v5 (data fetching)
- React Hook Form + Zod (formularios T1–T9H)

### Backend
- NestJS + TypeScript (Monolito modular → microservicios Fase 2)
- PostgreSQL + Prisma ORM (24 entidades)
- JWT + RBAC multi-rol (5 roles)
- AWS S3 / Cloudflare R2 (storage documental versionado)

### Infraestructura
- Frontend: Vercel
- Backend API: Railway / Render / Fly.io
- Base de datos: Supabase o Neon (PostgreSQL administrado)
- CI/CD: GitHub Actions
- Monitoreo: Sentry (errores) + Logtail (logs estructurados)
- Notificaciones: Resend (email) · WhatsApp API (Fase 2)

### Seguridad
- JWT + refresh tokens rotativos
- RBAC a nivel de endpoint y campo
- Row-level security en PostgreSQL
- Signed URLs S3 con expiración
- Audit logs append-only (sin UPDATE/DELETE)

## Arquitectura

```
┌──────────────────────────────────────────────────────┐
│            PRESENTATION LAYER                        │
│         Next.js 15 App Router  (Vercel)              │
└──────────────────────┬───────────────────────────────┘
                       │ HTTPS REST
┌──────────────────────▼───────────────────────────────┐
│              API LAYER                               │
│          NestJS REST API  (Railway)                  │
└────────┬─────────────┬──────────────┬────────────────┘
         │             │              │
    ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
    │WORKFLOW │   │BUSINESS │   │NOTIF.   │
    │ENGINE   │   │MODULES  │   │LAYER    │
    │14 states│   │18 mods  │   │Resend   │
    └────┬────┘   └────┬────┘   └─────────┘
         └─────────────┘
                 │
┌───────────────▼──────────────────────────────────────┐
│              DATA LAYER                              │
│       PostgreSQL + Prisma ORM  (Supabase/Neon)       │
└────────────────┬─────────────────────┬───────────────┘
                 │                     │
        ┌────────▼───────┐   ┌─────────▼──────┐
        │  STORAGE LAYER │   │  AUDIT LAYER   │
        │  AWS S3 / R2   │   │  Bitácora      │
        │  Docs versions │   │  append-only   │
        └────────────────┘   └────────────────┘
```

## Flujo operativo (9 puntos)

```
[1] Mipyme registra caso → Plantilla T1
[2] Advisory: Debida diligencia + clasificación → T2
[3] Bolsa interna → Postulación T3C → Asignación T3D
[4] Consultor diseña propuesta → TP4B → TP4C → TP4H
[5] Advisory: QA + peer review → autoriza envío
[6] Mipyme: Decisión → acepta / ajustes / no continúa
[7] Formalización → Checklist T7A + marco operativo T7B
[8] Ejecución → Agenda T8A → hitos T8C → incidencias T8D
[9] Cierre → T9A–T9H → acta → evaluación → CERRADO
```

## Estados del workflow (14)

CREADO → EN_REVISION → CLASIFICADO → EN_POSTULACION → ASIGNADO →
PROPUESTA_EN_DISENO → PROPUESTA_LISTA_QA → PROPUESTA_ENVIADA →
EN_DECISION → PROPUESTA_ACEPTADA → PENDIENTE_CONTRATACION →
AUTORIZADO_EJECUCION → EN_EJECUCION → CERRADO
(+ CERRADO_SIN_CONTRATACION desde EN_DECISION)

## Roles del sistema

| Rol               | Responsabilidades principales                                |
|-------------------|--------------------------------------------------------------|
| Mipyme            | Registrar caso, revisar propuestas, aceptar/rechazar, cierre |
| Consultor         | Ver bolsa, postular, diseñar propuesta, ejecutar, entregar   |
| Advisory NODUS    | Clasificar, asignar, QA, checklist, monitorear todo          |
| Consultor Revisor | Peer review de propuestas específicas (Fase 2)               |
| Super Admin       | Parametrización LOV, usuarios, SLA rules, configuración      |

## Módulos MVP (18)

1. Auth & Usuarios (JWT + RBAC)
2. Empresas (onboarding + deduplicación)
3. Casos (workflow core + T1)
4. Debida diligencia y clasificación (T2)
5. Workflow Engine (14 estados + reglas de bloqueo)
6. Bolsa de consultores (T3C / T3D)
7. Propuestas (TP4A–H + versionamiento sin sobrescritura)
8. QA y Peer Review
9. Decisión del cliente (TP6A–E)
10. Contratación (T7A–D + bloqueo RF-070)
11. Ejecución y seguimiento (T8A–H)
12. Cierre del caso (T9A–H)
13. Gestión documental (S3 + versiones)
14. Bitácora centralizada (append-only)
15. SLA y alertas (cron + escalamientos)
16. Notificaciones (Resend + plantillas oficiales)
17. Gobierno de datos / LOV
18. Dashboard PMO

## Roadmap

| Fase | Duración   | Contenido                                    |
|------|------------|----------------------------------------------|
| 0    | 2 semanas  | Fundación: backlog 87 historias, ERD, monorepo |
| 1    | 2 semanas  | Diseño: wireframes, OpenAPI, schema.prisma   |
| 2    | 12 semanas | Desarrollo: 4 sprints                        |
| 3    | 2 semanas  | Validación, piloto, deploy producción        |

## Inicio rápido

```bash
# Clonar y configurar
git clone <repo>

# Frontend
cd frontend && npm install && npm run dev

# Backend
cd backend && npm install
cp .env.example .env   # configurar variables
npx prisma migrate dev
npx prisma db seed
npm run dev
```
