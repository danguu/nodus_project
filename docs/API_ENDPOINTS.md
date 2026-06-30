# NODUS API — Catálogo de Endpoints MVP

Base URL: `https://api.nodus.911mipyme.co/api`
Auth: `Authorization: Bearer <JWT>`

## Auth
| Método | Endpoint             | Descripción                        |
|--------|----------------------|------------------------------------|
| POST   | /auth/login          | Login multi-rol                    |
| POST   | /auth/register       | Registro (flujo Mipyme onboarding) |
| POST   | /auth/refresh        | Refresh JWT                        |
| POST   | /auth/logout         | Invalidar sesión                   |

## Companies
| Método | Endpoint             | Descripción                                  |
|--------|----------------------|----------------------------------------------|
| POST   | /companies           | Crear empresa (validación duplicados RF-002) |
| GET    | /companies           | Listar empresas                              |
| GET    | /companies/:id       | Detalle + historial de casos                 |

## Cases
| Método | Endpoint                     | Descripción                              |
|--------|------------------------------|------------------------------------------|
| POST   | /cases                       | Crear caso T1 (RF-007 a RF-014)         |
| GET    | /cases                       | Listar con filtros                       |
| GET    | /cases/:id                   | Detalle + timeline                       |
| PATCH  | /cases/:id                   | Editar (solo en estado CREADO, RF-013)   |
| PATCH  | /cases/:id/status            | Transición de estado                     |
| GET    | /cases/:id/audit-log         | Bitácora del caso (RT-001 a RT-005)      |

## Classification
| Método | Endpoint                       | Descripción                 |
|--------|--------------------------------|-----------------------------|
| POST   | /cases/:id/classification      | Plantilla T2                |

## Bolsa & Applications
| Método | Endpoint                         | Descripción                   |
|--------|----------------------------------|-------------------------------|
| GET    | /bolsa                           | Casos visibles por elegibilidad |
| POST   | /cases/:id/applications          | Postulación T3C               |
| POST   | /applications/:id/evaluate       | Evaluación T3D + asignación   |

## Proposals
| Método | Endpoint                                   | Descripción              |
|--------|--------------------------------------------|--------------------------|
| POST   | /cases/:id/proposals                       | Crear propuesta TP4C v1  |
| PUT    | /proposals/:id                             | Nueva versión (RF-041)   |
| POST   | /proposals/:id/attachments                 | Anexos TP4D–G            |
| POST   | /proposals/:id/methodological-review       | TP4H checklist del Go    |
| POST   | /proposals/:id/authorize-send              | Autorización envío       |
| POST   | /proposals/:id/peer-review                 | Peer review opcional     |

## Client Decisions
| Método | Endpoint                          | Descripción          |
|--------|-----------------------------------|----------------------|
| POST   | /cases/:id/decision               | TP6A decisión        |
| POST   | /cases/:id/adjustment-request     | TP6B ajustes         |

## Contracting
| Método | Endpoint                              | Descripción             |
|--------|---------------------------------------|-------------------------|
| GET    | /cases/:id/checklist                  | T7A estado              |
| PATCH  | /cases/:id/checklist/:itemId          | Actualizar ítem T7A     |
| POST   | /cases/:id/operational-framework      | T7B marco operativo     |

## Execution
| Método | Endpoint                       | Descripción       |
|--------|--------------------------------|-------------------|
| POST   | /cases/:id/agenda              | T8A agenda        |
| POST   | /cases/:id/activities          | T8B actividades   |
| POST   | /cases/:id/milestones          | T8C hitos         |
| POST   | /cases/:id/incidents           | T8D incidencias   |
| POST   | /cases/:id/deliverables        | T8G entregables   |

## Closure
| Método | Endpoint                            | Descripción        |
|--------|-------------------------------------|--------------------|
| POST   | /cases/:id/technical-closure        | T9A cierre técnico |
| POST   | /cases/:id/final-deliverables       | T9B consolidado    |
| POST   | /cases/:id/final-review             | T9C checklist      |
| POST   | /cases/:id/delivery-act             | T9D acta           |
| POST   | /cases/:id/client-acceptance        | T9F aceptación     |
| POST   | /cases/:id/satisfaction-survey      | T9G encuesta       |
| POST   | /cases/:id/consultant-evaluation    | T9H evaluación     |

## Documents
| Método | Endpoint                    | Descripción                  |
|--------|-----------------------------|------------------------------|
| POST   | /documents/upload           | Subida con signed URL (S3)   |
| GET    | /cases/:id/documents        | Repositorio por etapa        |

## LOV & Config
| Método | Endpoint              | Descripción               |
|--------|-----------------------|---------------------------|
| GET    | /lov/:category        | Lista de valores           |
| GET    | /sla/alerts           | Alertas activas            |
| GET    | /pmo/kpis             | Dashboard ejecutivo KPIs  |
