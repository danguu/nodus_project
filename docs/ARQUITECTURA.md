# NODUS — Arquitectura Técnica Detallada

## Stack por capa

### Presentation Layer — Next.js 15
- **Framework**: Next.js 15 con App Router
- **Lenguaje**: TypeScript estricto
- **UI**: TailwindCSS + Shadcn/UI (accesible, consistente)
- **Animaciones**: Framer Motion (transiciones de estado del workflow)
- **Estado**: Zustand (sesión, filtros) + TanStack Query (cache servidor)
- **Formularios**: React Hook Form + Zod (esquemas por plantilla T1–T9H)

### API Layer — NestJS
- **Arquitectura**: Monolito modular (18 módulos independientes)
- **Patrón**: Controller → Service → Repository (Prisma)
- **Validación**: class-validator + class-transformer en DTOs
- **Docs**: OpenAPI/Swagger auto-generado en /api/docs
- **Guards**: JwtAuthGuard (autenticación) + RolesGuard (autorización RBAC)

### Workflow Engine
El motor de workflow es el servicio más crítico de NODUS.
- Tabla `case_state_transitions` con transiciones permitidas
- `requiredChecks` por transición para bloqueos (RF-070, RF-046, etc.)
- Cada transición ejecuta una **transacción atómica**: update de estado + insert en audit_log
- Reglas de bloqueo implementadas:
  - `PENDIENTE_CONTRATACION → AUTORIZADO`: checklist T7A 100% + T7B cargado
  - `PROPUESTA_EN_DISENO → PROPUESTA_LISTA_QA`: TP4H con methodologicalReview
  - `EN_EJECUCION → CERRADO`: todos los deliverables con isFinal=true

### Data Layer — PostgreSQL + Prisma
- **24 entidades** con integridad referencial completa
- Enums definidos en Prisma para todos los estados y tipos (LOV)
- Tabla `audit_logs` configurada append-only a nivel de aplicación
- `lov_items` centraliza todas las listas de valores (RT-015 a RT-018)

### Storage Layer — AWS S3
- Todos los documentos se almacenan con path estructurado:
  `{caseCode}/{stage}/{type}/v{version}/{filename}`
- Signed URLs con expiración de 1 hora para descargas
- Nunca se sobrescriben versiones anteriores (RF-042)

### Audit Layer — Bitácora centralizada
- Tabla `audit_logs` con campo `createdAt` y sin `updatedAt`
- La aplicación nunca emite UPDATE o DELETE sobre esta tabla
- Cada transición de workflow, upload, comunicación y decisión genera un log
- Campos: actor, action, entity, previousState, newState, description, timestamp

### Notification Layer — Resend
- Plantillas de email por evento definidas en `notifications/templates/`
- Cola de notificaciones con reintentos automáticos
- Registro en tabla `notifications` de cada envío

### SLA Layer — NestJS Schedule
- Cron cada hora verifica tiempos por etapa
- Niveles: preventiva (75%), crítica (90%), escalamiento (100%)
- Alertas registradas en `sla_alerts` sin duplicados

## Seguridad

### Autenticación
- JWT con expiración corta (15 minutos)
- Refresh tokens rotativos (7 días) en HTTP-only cookie
- Endpoint: POST /api/auth/refresh

### Autorización RBAC
- Guard a nivel de endpoint: `@Roles(Role.ADVISORY, Role.SUPER_ADMIN)`
- Guard a nivel de campo: datos sensibles del cliente invisibles para consultores no asignados (RF-036)

### Row-level Security
PostgreSQL RLS para aislar datos entre empresas:
```sql
-- Mipymes solo ven sus propios casos
CREATE POLICY case_isolation ON cases
  USING (company_id = current_setting('app.company_id')::uuid);
```

## Escalabilidad (Fase 2+)

El monolito modular está diseñado para extraerse en microservicios:
- Cada módulo NestJS tiene sus propias dependencias declaradas
- Comunicación preparada para migrar a eventos (EventEmitter → Kafka/RabbitMQ)
- API Gateway posible con Kong o AWS API Gateway
- Multi-tenancy: añadir `tenant_id` a tablas principales
