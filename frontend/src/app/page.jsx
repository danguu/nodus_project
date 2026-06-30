"use client";
import { useState, useEffect, useCallback } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Michroma&family=Montserrat:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#111621;--bg2:#1A2332;--bg3:#222E40;--bg4:#2B3A4F;
  --border:#2B3A4F;--border2:#3D4F68;
  --text:#E4EDF8;--text2:#B0C5D8;--text3:#7A8FA5;
  --accent:#AE9159;--accent2:#9A7E4B;--accent3:#7A6238;
  --gold:#AE9159;--gold-light:#C4A86E;--light:#D5D1C9;
  --success:#10B981;--warn:#F59E0B;--danger:#EF4444;
  --purple:#8B5CF6;--teal:#14B8A6;--pink:#EC4899;
  --font:'Montserrat',system-ui,sans-serif;--display:'Michroma',system-ui,sans-serif;--mono:'JetBrains Mono',monospace;
  --r:6px;--r2:10px;--r3:14px;
}
body{background:var(--bg);color:var(--text);font-family:var(--font);font-size:13px;line-height:1.5;overflow:hidden;height:100vh}
.shell{display:flex;height:100vh;overflow:hidden}
.sidebar{width:220px;min-width:220px;background:var(--bg2);border-right:1px solid var(--border);display:flex;flex-direction:column;overflow-y:auto}
.main{flex:1;overflow:hidden;display:flex;flex-direction:column;min-width:0}
.topbar{height:52px;min-height:52px;background:var(--bg2);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;padding:0 20px;flex-shrink:0}
.page{padding:24px;flex:1;overflow-y:auto;min-height:0}
.logo{padding:18px 14px 14px;border-bottom:1px solid var(--border)}
.logo-name{font-size:18px;font-weight:400;letter-spacing:1px;color:var(--text);font-family:var(--display)}
.logo-name span{color:var(--accent)}
.logo-sub{font-size:10px;color:var(--text3);margin-top:2px;text-transform:uppercase;letter-spacing:0.6px}
.nav-sect{padding:10px 8px 2px}
.nav-lbl{font-size:9px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;padding:0 6px;margin-bottom:2px}
.nav-item{display:flex;align-items:center;gap:8px;padding:7px 8px;border-radius:var(--r);cursor:pointer;color:var(--text2);font-size:12px;font-weight:500;transition:all .15s;border:none;background:none;width:100%;text-align:left}
.nav-item:hover{background:var(--bg3);color:var(--text)}
.nav-item.active{background:var(--accent3);color:#fff}
.nav-ic{font-size:14px;flex-shrink:0;width:18px;text-align:center}
.nav-badge{margin-left:auto;background:var(--accent);color:#fff;font-size:9px;font-weight:700;padding:1px 5px;border-radius:8px;min-width:16px;text-align:center}
.nav-badge.w{background:var(--warn)}
.nav-badge.d{background:var(--danger)}
.sidebar-footer{margin-top:auto;padding:10px 8px;border-top:1px solid var(--border)}
.topbar-title{font-size:14px;font-weight:600}
.topbar-right{margin-left:auto;display:flex;align-items:center;gap:8px}
.role-switcher{display:flex;background:var(--bg3);border-radius:var(--r);padding:2px;gap:2px}
.role-btn{font-size:10px;font-weight:600;padding:3px 8px;border-radius:4px;border:none;cursor:pointer;background:none;color:var(--text3);transition:all .15s}
.role-btn.active{background:var(--accent);color:#fff}
.card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--r2);padding:18px}
.card-sm{padding:12px 14px}
.card-title{font-size:13px;font-weight:600;margin-bottom:2px}
.card-sub{font-size:11px;color:var(--text3)}
.grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
.stat-num{font-size:26px;font-weight:700;line-height:1;margin-bottom:3px}
.stat-lbl{font-size:11px;color:var(--text3)}
.stat-delta{font-size:10px;margin-top:4px}
.up{color:var(--success)}.dn{color:var(--danger)}.wr{color:var(--warn)}
table{width:100%;border-collapse:collapse;font-size:12px}
th{text-align:left;font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;padding:8px 12px;border-bottom:1px solid var(--border);white-space:nowrap}
td{padding:10px 12px;border-bottom:1px solid var(--border);color:var(--text2);vertical-align:middle}
tr:last-child td{border-bottom:none}
tbody tr{cursor:pointer;transition:background .1s}
tbody tr:hover td{background:var(--bg3)}
.td-bold{color:var(--text);font-weight:600}
.badge{display:inline-flex;align-items:center;font-size:10px;font-weight:600;padding:2px 7px;border-radius:12px;white-space:nowrap;gap:3px}
.b-blue{background:rgba(59,130,246,.15);color:#60A5FA}
.b-green{background:rgba(16,185,129,.15);color:#34D399}
.b-warn{background:rgba(245,158,11,.15);color:#FCD34D}
.b-red{background:rgba(239,68,68,.15);color:#F87171}
.b-purple{background:rgba(139,92,246,.15);color:#C4B5FD}
.b-teal{background:rgba(20,184,166,.15);color:#2DD4BF}
.b-gray{background:rgba(255,255,255,.06);color:var(--text2)}
.b-pink{background:rgba(236,72,153,.15);color:#F9A8D4}
.st-CREADO{background:rgba(139,92,246,.15);color:#C4B5FD}
.st-EN_REVISION{background:rgba(245,158,11,.15);color:#FCD34D}
.st-CLASIFICADO{background:rgba(20,184,166,.15);color:#2DD4BF}
.st-EN_POSTULACION{background:rgba(59,130,246,.15);color:#93C5FD}
.st-ASIGNADO{background:rgba(59,130,246,.2);color:#60A5FA}
.st-PROPUESTA_EN_DISENO{background:rgba(99,102,241,.15);color:#A5B4FC}
.st-PROPUESTA_LISTA_QA{background:rgba(245,158,11,.2);color:#FDE68A}
.st-PROPUESTA_ENVIADA{background:rgba(20,184,166,.18);color:#5EEAD4}
.st-EN_DECISION{background:rgba(249,115,22,.15);color:#FDBA74}
.st-AJUSTES{background:rgba(239,68,68,.15);color:#FCA5A5}
.st-PROPUESTA_ACEPTADA{background:rgba(16,185,129,.15);color:#86EFAC}
.st-PENDIENTE_CONTRATACION{background:rgba(245,158,11,.22);color:#FDE68A}
.st-AUTORIZADO_EJECUCION{background:rgba(20,184,166,.22);color:#2DD4BF}
.st-EN_EJECUCION{background:rgba(59,130,246,.25);color:#60A5FA}
.st-CERRADO{background:rgba(16,185,129,.2);color:#4ADE80}
.st-CERRADO_SIN_CONTRATACION{background:rgba(156,163,175,.12);color:#9CA3AF}
.btn{display:inline-flex;align-items:center;gap:5px;padding:7px 12px;border-radius:var(--r);border:none;cursor:pointer;font-size:12px;font-weight:500;transition:all .15s;font-family:var(--font);white-space:nowrap}
.btn-primary{background:var(--accent);color:#fff}
.btn-primary:hover{background:var(--accent2)}
.btn-ghost{background:transparent;color:var(--text2);border:1px solid var(--border2)}
.btn-ghost:hover{background:var(--bg3);color:var(--text)}
.btn-danger{background:rgba(239,68,68,.12);color:#F87171;border:1px solid rgba(239,68,68,.25)}
.btn-success{background:rgba(16,185,129,.12);color:#34D399;border:1px solid rgba(16,185,129,.25)}
.btn-warn{background:rgba(245,158,11,.12);color:#FCD34D;border:1px solid rgba(245,158,11,.25)}
.btn-sm{padding:4px 9px;font-size:11px}
.btn-xs{padding:2px 7px;font-size:10px}
.btn-ic{width:28px;height:28px;padding:0;display:inline-flex;align-items:center;justify-content:center;background:var(--bg3);border:1px solid var(--border);border-radius:var(--r);cursor:pointer;color:var(--text2);transition:all .15s;font-size:13px}
.btn-ic:hover{color:var(--text);background:var(--bg4)}
.form-group{margin-bottom:14px}
.form-lbl{display:block;font-size:11px;font-weight:500;color:var(--text2);margin-bottom:5px}
.form-input{width:100%;background:var(--bg3);border:1px solid var(--border2);border-radius:var(--r);padding:8px 10px;color:var(--text);font-family:var(--font);font-size:12px;outline:none;transition:border-color .15s}
.form-input:focus{border-color:var(--accent)}
.form-select{width:100%;background:var(--bg3);border:1px solid var(--border2);border-radius:var(--r);padding:8px 10px;color:var(--text);font-family:var(--font);font-size:12px;outline:none;cursor:pointer}
.form-textarea{width:100%;background:var(--bg3);border:1px solid var(--border2);border-radius:var(--r);padding:8px 10px;color:var(--text);font-family:var(--font);font-size:12px;outline:none;resize:vertical;min-height:70px}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.form-row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
.modal-ov{position:fixed;inset:0;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;z-index:200}
.modal{background:var(--bg2);border:1px solid var(--border2);border-radius:var(--r3);padding:24px;width:540px;max-width:95vw;max-height:88vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.6)}
.modal-lg{width:700px}
.modal-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
.modal-title{font-size:15px;font-weight:600}
.modal-close{background:none;border:none;cursor:pointer;color:var(--text3);font-size:16px}
.modal-close:hover{color:var(--text)}
.modal-ft{display:flex;gap:7px;justify-content:flex-end;margin-top:18px;padding-top:14px;border-top:1px solid var(--border)}
.tabs{display:flex;gap:2px;border-bottom:1px solid var(--border);margin-bottom:16px}
.tab{padding:7px 12px;font-size:12px;font-weight:500;color:var(--text3);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;transition:all .15s;background:none;border-left:none;border-right:none;border-top:none}
.tab:hover{color:var(--text2)}
.tab.active{color:var(--accent);border-bottom-color:var(--accent)}
.divider{height:1px;background:var(--border);margin:14px 0}
.alert{padding:10px 12px;border-radius:var(--r);font-size:12px;margin-bottom:12px;border:1px solid;line-height:1.4}
.alert-info{background:rgba(59,130,246,.08);border-color:rgba(59,130,246,.25);color:#93C5FD}
.alert-warn{background:rgba(245,158,11,.08);border-color:rgba(245,158,11,.25);color:#FCD34D}
.alert-danger{background:rgba(239,68,68,.08);border-color:rgba(239,68,68,.25);color:#F87171}
.alert-success{background:rgba(16,185,129,.08);border-color:rgba(16,185,129,.25);color:#34D399}
.progress-track{height:5px;background:var(--bg4);border-radius:3px;overflow:hidden}
.pf{height:100%;border-radius:3px;transition:width .4s ease}
.pf-ok{background:var(--success)}.pf-warn{background:var(--warn)}.pf-danger{background:var(--danger)}.pf-blue{background:var(--accent)}
.timeline{position:relative;padding-left:20px}
.timeline::before{content:'';position:absolute;left:6px;top:0;bottom:0;width:2px;background:var(--border)}
.tl-item{position:relative;margin-bottom:14px}
.tl-dot{position:absolute;left:-17px;width:9px;height:9px;border-radius:50%;background:var(--accent);border:2px solid var(--bg2);top:3px}
.tl-dot.s{background:var(--success)}.tl-dot.w{background:var(--warn)}.tl-dot.g{background:var(--text3)}
.tl-ts{font-size:10px;color:var(--text3);font-family:var(--mono)}
.tl-txt{font-size:12px;color:var(--text2);margin-top:1px}
.tl-actor{font-size:10px;color:var(--accent);margin-top:1px}
.wf-wrap{display:flex;align-items:flex-start;overflow-x:auto;padding-bottom:4px;gap:0}
.wf-step{flex-shrink:0;display:flex;flex-direction:column;align-items:center}
.wf-body{display:flex;flex-direction:column;align-items:center;gap:3px}
.wf-circle{width:24px;height:24px;border-radius:50%;border:2px solid var(--border2);display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;background:var(--bg3);color:var(--text3);transition:all .3s;flex-shrink:0}
.wf-circle.done{background:var(--success);border-color:var(--success);color:#fff}
.wf-circle.active{background:var(--accent);border-color:var(--accent);color:#fff;box-shadow:0 0 0 3px rgba(59,130,246,.25)}
.wf-lbl{font-size:9px;color:var(--text3);text-align:center;max-width:58px;line-height:1.2}
.wf-lbl.active{color:var(--text);font-weight:600}
.wf-conn{height:2px;width:32px;background:var(--border);margin-top:11px;flex-shrink:0;transition:background .3s}
.wf-conn.done{background:var(--success)}
.tag{display:inline-flex;align-items:center;font-size:10px;padding:2px 7px;border-radius:4px;background:var(--bg3);color:var(--text2);border:1px solid var(--border)}
.sla-row{display:flex;align-items:center;gap:8px;margin-bottom:6px}
.sla-lbl{font-size:10px;color:var(--text3);min-width:70px;flex-shrink:0}
.sla-t{font-size:10px;font-family:var(--mono);color:var(--text2);min-width:50px;text-align:right;flex-shrink:0}
.empty{text-align:center;padding:40px 20px;color:var(--text3)}
.empty-ic{font-size:28px;margin-bottom:8px}
.empty-txt{font-size:13px}
.section-title{font-size:17px;font-weight:600;margin-bottom:2px}
.section-sub{font-size:12px;color:var(--text3);margin-bottom:20px}
.check-row{display:flex;align-items:flex-start;gap:8px;padding:8px 0;border-bottom:1px solid var(--border);cursor:pointer}
.check-row:last-child{border-bottom:none}
.check-ic{width:18px;height:18px;border-radius:4px;border:2px solid var(--border2);flex-shrink:0;margin-top:1px;display:flex;align-items:center;justify-content:center;font-size:10px;transition:all .15s}
.check-ic.done{background:var(--success);border-color:var(--success);color:#fff}
.info-row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border)}
.info-row:last-child{border-bottom:none}
.info-k{font-size:11px;color:var(--text3)}
.info-v{font-size:12px;color:var(--text)}
.pill-group{display:flex;flex-wrap:wrap;gap:4px}
.kpi-ring{display:flex;align-items:center;justify-content:center;width:70px;height:70px;border-radius:50%;border:3px solid;font-size:16px;font-weight:700;flex-shrink:0}
`;

// ─── CONSTANTS ─────────────────────────────────────────────────────────────
const STATE_LABELS = {
  CREADO:"Creado",EN_REVISION:"En revisión",CLASIFICADO:"Clasificado",
  EN_POSTULACION:"En postulación",ASIGNADO:"Asignado",
  PROPUESTA_EN_DISENO:"Diseño propuesta",PROPUESTA_LISTA_QA:"Lista para QA",
  PROPUESTA_ENVIADA:"Enviada al cliente",EN_DECISION:"Decisión cliente",
  AJUSTES:"Ajustes",PROPUESTA_ACEPTADA:"Propuesta aceptada",
  PENDIENTE_CONTRATACION:"Pdte. contratación",AUTORIZADO_EJECUCION:"Autorizado",
  EN_EJECUCION:"En ejecución",CERRADO:"Cerrado",CERRADO_SIN_CONTRATACION:"Cerrado sin contrato"
};

const WF_STEPS = ["CREADO","EN_REVISION","CLASIFICADO","EN_POSTULACION","ASIGNADO",
  "PROPUESTA_EN_DISENO","PROPUESTA_LISTA_QA","PROPUESTA_ENVIADA","EN_DECISION",
  "PROPUESTA_ACEPTADA","PENDIENTE_CONTRATACION","AUTORIZADO_EJECUCION","EN_EJECUCION","CERRADO"];

const WF_SHORT = {CREADO:"Creado",EN_REVISION:"Revisión",CLASIFICADO:"Clasificado",
  EN_POSTULACION:"Bolsa",ASIGNADO:"Asignado",PROPUESTA_EN_DISENO:"Diseño",
  PROPUESTA_LISTA_QA:"QA",PROPUESTA_ENVIADA:"Enviado",EN_DECISION:"Decisión",
  PROPUESTA_ACEPTADA:"Aceptado",PENDIENTE_CONTRATACION:"Contratación",
  AUTORIZADO_EJECUCION:"Autorizado",EN_EJECUCION:"Ejecución",CERRADO:"Cerrado"};

const TRANSITIONS = {
  CREADO:          {next:"EN_REVISION",         actor:"Advisory",  label:"Iniciar revisión"},
  EN_REVISION:     {next:"CLASIFICADO",         actor:"Advisory",  label:"Clasificar caso (T2)"},
  CLASIFICADO:     {next:"EN_POSTULACION",      actor:"Advisory",  label:"Publicar en bolsa"},
  EN_POSTULACION:  {next:"ASIGNADO",            actor:"Advisory",  label:"Asignar consultor (T3D)"},
  ASIGNADO:        {next:"PROPUESTA_EN_DISENO", actor:"Sistema",   label:"Habilitar expediente propuesta"},
  PROPUESTA_EN_DISENO:{next:"PROPUESTA_LISTA_QA",actor:"Consultor",label:"Consolidar propuesta (TP4H)"},
  PROPUESTA_LISTA_QA:{next:"PROPUESTA_ENVIADA", actor:"Advisory",  label:"Autorizar y enviar al cliente"},
  PROPUESTA_ENVIADA:{next:"EN_DECISION",        actor:"Sistema",   label:"Abrir período de decisión"},
  EN_DECISION:     {next:"PROPUESTA_ACEPTADA",  actor:"Mipyme",    label:"Aceptar propuesta (TP6D)"},
  PROPUESTA_ACEPTADA:{next:"PENDIENTE_CONTRATACION",actor:"Sistema",label:"Abrir checklist T7A"},
  PENDIENTE_CONTRATACION:{next:"AUTORIZADO_EJECUCION",actor:"Advisory",label:"Autorizar ejecución"},
  AUTORIZADO_EJECUCION:{next:"EN_EJECUCION",    actor:"Sistema",   label:"Activar agenda T8A"},
  EN_EJECUCION:    {next:"CERRADO",             actor:"Advisory",  label:"Cerrar caso (T9C)"},
};

const getSlaClass = (u,t) => { const p=(u/t)*100; return p>=95?"pf-danger":p>=75?"pf-warn":"pf-ok"; };
const getSlaStatus = (u,t) => { const p=(u/t)*100; return p>=95?"danger":p>=75?"warn":"ok"; };

// ─── SEED DATA ──────────────────────────────────────────────────────────────
const SEED_CASES = [
  {id:"NOD-2026-001",empresa:"TechCol SAS",nit:"900.123.456-7",ciudad:"Bogotá",contacto:"Jorge Ramírez",area:"Tecnología",urgencia:"Alta",impacto:"Crítico",complejidad:"Alto",status:"EN_EJECUCION",consultor:"María López",consultorId:"C-001",creado:"2026-01-15",sla:720,slaUsado:480,descripcion:"Modernización del ERP interno con integración a sistemas de facturación electrónica DIAN y flujos automáticos de conciliación.",clasificacion:"Implementación tecnológica",postulaciones:3,version:2,hitos:[{nombre:"Diagnóstico AS-IS",estado:"completado",fecha:"2026-02-10"},{nombre:"Diseño TO-BE",estado:"completado",fecha:"2026-02-28"},{nombre:"Desarrollo módulo core",estado:"en_curso",fecha:"2026-03-20"},{nombre:"Pruebas UAT",estado:"pendiente",fecha:"2026-04-05"},{nombre:"Go-live",estado:"pendiente",fecha:"2026-04-15"}]},
  {id:"NOD-2026-002",empresa:"Cafés del Norte Ltda",nit:"800.987.654-2",ciudad:"Medellín",contacto:"Sandra Mejía",area:"Finanzas",urgencia:"Media",impacto:"Alto",complejidad:"Medio",status:"EN_DECISION",consultor:"Carlos Ríos",consultorId:"C-002",creado:"2026-02-03",sla:120,slaUsado:88,descripcion:"Reestructuración financiera y modelo de gestión de deuda con bancos locales ante presión de costos de la cadena de exportación.",clasificacion:"Diagnóstico financiero",postulaciones:5,version:1,hitos:[]},
  {id:"NOD-2026-003",empresa:"Distribuidora Andina SA",nit:"900.456.789-1",ciudad:"Cali",contacto:"Hernán Ossa",area:"Operaciones",urgencia:"Alta",impacto:"Crítico",complejidad:"Estratégico",status:"EN_POSTULACION",consultor:null,consultorId:null,creado:"2026-03-10",sla:24,slaUsado:20,descripcion:"Optimización de rutas de distribución y modelo de gestión de inventario descentralizado para 12 puntos de despacho.",clasificacion:"Optimización operacional",postulaciones:2,version:0,hitos:[]},
  {id:"NOD-2026-004",empresa:"Clínica Salud Total",nit:"800.321.654-9",ciudad:"Barranquilla",contacto:"Dra. Lucía Peña",area:"Estrategia",urgencia:"Media",impacto:"Medio",complejidad:"Medio",status:"CLASIFICADO",consultor:null,consultorId:null,creado:"2026-04-01",sla:48,slaUsado:10,descripcion:"Diseño del modelo de crecimiento y apertura de dos sedes en municipios intermedios del Caribe colombiano.",clasificacion:"Planeación estratégica",postulaciones:0,version:0,hitos:[]},
  {id:"NOD-2026-005",empresa:"Moda Exclusiva SAS",nit:"901.112.233-4",ciudad:"Bogotá",contacto:"Catalina Niño",area:"RRHH",urgencia:"Baja",impacto:"Bajo",complejidad:"Bajo",status:"CERRADO",consultor:"Ana Torres",consultorId:"C-003",creado:"2025-11-20",sla:120,slaUsado:98,descripcion:"Diseño del manual de funciones y política de compensación variable para equipo comercial.",clasificacion:"Gestión humana",postulaciones:4,version:2,hitos:[]},
  {id:"NOD-2026-006",empresa:"Constructora Bolívar",nit:"901.234.567-3",ciudad:"Bogotá",contacto:"Ramiro Cuéllar",area:"Legal",urgencia:"Alta",impacto:"Alto",complejidad:"Alto",status:"CREADO",consultor:null,consultorId:null,creado:"2026-06-20",sla:24,slaUsado:1,descripcion:"Revisión de contratos de obra civil y estructuración de garantías para proyecto residencial de 240 unidades.",clasificacion:null,postulaciones:0,version:0,hitos:[]},
  {id:"NOD-2026-007",empresa:"Supermercados Éxito Local",nit:"900.777.888-1",ciudad:"Manizales",contacto:"Felipe Ruiz",area:"Analítica",urgencia:"Media",impacto:"Alto",complejidad:"Medio",status:"PENDIENTE_CONTRATACION",consultor:"Diego Montoya",consultorId:"C-004",creado:"2026-02-28",sla:72,slaUsado:68,descripcion:"Implementación de modelo de analítica de ventas y predicción de demanda para optimización de inventario.",clasificacion:"Transformación analítica",postulaciones:6,version:1,hitos:[]},
];

const SEED_CONSULTORES = [
  {id:"C-001",nombre:"María López",email:"mlopez@nodus.co",especialidades:["Tecnología","Analítica","Transformación digital"],nivel:"Experto",disponibilidad:"Disponible",casosActivos:2,casosTotal:8,rating:4.8,reputacion:94,ciudad:"Bogotá"},
  {id:"C-002",nombre:"Carlos Ríos",email:"crios@nodus.co",especialidades:["Finanzas","Estrategia"],nivel:"Senior",disponibilidad:"Ocupado",casosActivos:2,casosTotal:5,rating:4.6,reputacion:88,ciudad:"Medellín"},
  {id:"C-003",nombre:"Ana Torres",email:"atorres@nodus.co",especialidades:["RRHH","Operaciones"],nivel:"Senior",disponibilidad:"Disponible",casosActivos:0,casosTotal:4,rating:4.9,reputacion:96,ciudad:"Bogotá"},
  {id:"C-004",nombre:"Diego Montoya",email:"dmontoya@nodus.co",especialidades:["Analítica","Tecnología"],nivel:"Experto",disponibilidad:"Ocupado",casosActivos:3,casosTotal:9,rating:4.5,reputacion:85,ciudad:"Cali"},
  {id:"C-005",nombre:"Patricia Gómez",email:"pgomez@nodus.co",especialidades:["Legal","Estrategia"],nivel:"Senior",disponibilidad:"Disponible",casosActivos:0,casosTotal:3,rating:4.7,reputacion:91,ciudad:"Bogotá"},
  {id:"C-006",nombre:"Andrés Vargas",email:"avargas@nodus.co",especialidades:["Finanzas","Operaciones"],nivel:"Junior",disponibilidad:"Disponible",casosActivos:1,casosTotal:2,rating:4.2,reputacion:78,ciudad:"Medellín"},
];

const SEED_BITACORA = [
  {id:1,caso:"NOD-2026-001",actor:"Sistema",accion:"Caso creado — Plantilla T1 registrada",est_antes:null,est_des:"CREADO",ts:"2026-01-15 09:00",tipo:"estado"},
  {id:2,caso:"NOD-2026-001",actor:"Advisory",accion:"Revisión iniciada — documento adjunto recibido",est_antes:"CREADO",est_des:"EN_REVISION",ts:"2026-01-15 10:30",tipo:"estado"},
  {id:3,caso:"NOD-2026-001",actor:"Advisory",accion:"Clasificación T2: Implementación tecnológica · Complejidad Alta · Impacto Crítico",est_antes:"EN_REVISION",est_des:"CLASIFICADO",ts:"2026-01-16 14:00",tipo:"estado"},
  {id:4,caso:"NOD-2026-001",actor:"Sistema",accion:"Publicado en bolsa interna — consultores habilitados notificados",est_antes:"CLASIFICADO",est_des:"EN_POSTULACION",ts:"2026-01-16 14:01",tipo:"estado"},
  {id:5,caso:"NOD-2026-001",actor:"María López",accion:"Postulación T3C enviada — 12 años experiencia en ERP",est_antes:null,est_des:null,ts:"2026-01-17 09:15",tipo:"documento"},
  {id:6,caso:"NOD-2026-001",actor:"Advisory",accion:"Consultor asignado: María López (evaluación T3D: 95/100)",est_antes:"EN_POSTULACION",est_des:"ASIGNADO",ts:"2026-01-18 11:00",tipo:"estado"},
  {id:7,caso:"NOD-2026-001",actor:"María López",accion:"Análisis TP4B cargado — hipótesis y riesgos identificados",est_antes:null,est_des:null,ts:"2026-01-21 16:00",tipo:"documento"},
  {id:8,caso:"NOD-2026-001",actor:"María López",accion:"Propuesta TP4C v1 cargada — 10 bloques completos",est_antes:null,est_des:null,ts:"2026-01-22 16:40",tipo:"documento"},
  {id:9,caso:"NOD-2026-001",actor:"Advisory",accion:"Revisión metodológica TP4H: todos los criterios aprobados",est_antes:"PROPUESTA_EN_DISENO",est_des:"PROPUESTA_LISTA_QA",ts:"2026-01-24 10:00",tipo:"estado"},
  {id:10,caso:"NOD-2026-001",actor:"Advisory",accion:"Propuesta autorizada y enviada al cliente TechCol SAS",est_antes:"PROPUESTA_LISTA_QA",est_des:"PROPUESTA_ENVIADA",ts:"2026-01-25 09:30",tipo:"estado"},
  {id:11,caso:"NOD-2026-001",actor:"TechCol SAS",accion:"Propuesta aceptada — Formulario TP6D firmado",est_antes:"EN_DECISION",est_des:"PROPUESTA_ACEPTADA",ts:"2026-01-28 15:00",tipo:"estado"},
  {id:12,caso:"NOD-2026-001",actor:"Advisory",accion:"Checklist T7A completado al 100% — contratación autorizada",est_antes:"PENDIENTE_CONTRATACION",est_des:"AUTORIZADO_EJECUCION",ts:"2026-02-01 12:00",tipo:"estado"},
  {id:13,caso:"NOD-2026-001",actor:"Sistema",accion:"Agenda operativa T8A activada — ejecución iniciada",est_antes:"AUTORIZADO_EJECUCION",est_des:"EN_EJECUCION",ts:"2026-02-03 08:00",tipo:"estado"},
  {id:14,caso:"NOD-2026-001",actor:"María López",accion:"Hito 1 completado: Diagnóstico AS-IS entregado",est_antes:null,est_des:null,ts:"2026-02-10 17:00",tipo:"hito"},
  {id:15,caso:"NOD-2026-001",actor:"María López",accion:"Hito 2 completado: Diseño TO-BE aprobado por cliente",est_antes:null,est_des:null,ts:"2026-02-28 16:30",tipo:"hito"},
];

const SEED_EMPRESAS = [
  {id:"EMP-001",nombre:"TechCol SAS",nit:"900.123.456-7",ciudad:"Bogotá",sector:"Tecnología",contacto:"Jorge Ramírez",email:"jorge@techcol.co",casos:3},
  {id:"EMP-002",nombre:"Cafés del Norte Ltda",nit:"800.987.654-2",ciudad:"Medellín",sector:"Agroindustria",contacto:"Sandra Mejía",email:"smejia@cafesnorte.co",casos:1},
  {id:"EMP-003",nombre:"Distribuidora Andina SA",nit:"900.456.789-1",ciudad:"Cali",sector:"Logística",contacto:"Hernán Ossa",email:"hossa@distribandina.co",casos:2},
  {id:"EMP-004",nombre:"Clínica Salud Total",nit:"800.321.654-9",ciudad:"Barranquilla",sector:"Salud",contacto:"Dra. Lucía Peña",email:"lp@saludtotal.co",casos:1},
  {id:"EMP-005",nombre:"Constructora Bolívar",nit:"901.234.567-3",ciudad:"Bogotá",sector:"Construcción",contacto:"Ramiro Cuéllar",email:"rcuellar@cbolivar.co",casos:1},
  {id:"EMP-006",nombre:"Supermercados Éxito Local",nit:"900.777.888-1",ciudad:"Manizales",sector:"Retail",contacto:"Felipe Ruiz",email:"fruiz@exitolocal.co",casos:1},
];

// ─── MICRO-COMPONENTS ──────────────────────────────────────────────────────
const Sb = ({s}) => <span className={`badge st-${s}`}>{STATE_LABELS[s]||s}</span>;
const SlaBar = ({u,t,compact}) => {
  const p=Math.min((u/t)*100,100), cls=getSlaClass(u,t);
  return compact ? (
    <div style={{width:80}}><div className="progress-track"><div className={`pf ${cls}`} style={{width:`${p}%`}}/></div></div>
  ) : (
    <div className="sla-row">
      <div className="progress-track" style={{flex:1}}><div className={`pf ${cls}`} style={{width:`${p}%`}}/></div>
      <span className="sla-t">{u}h/{t}h</span>
    </div>
  );
};
const WfStepper = ({status}) => {
  const cur=WF_STEPS.indexOf(status);
  return (
    <div className="wf-wrap">
      {WF_STEPS.map((s,i)=>(
        <div key={s} style={{display:"flex",alignItems:"flex-start"}}>
          <div className="wf-step">
            <div className="wf-body">
              <div className={`wf-circle ${i<cur?"done":i===cur?"active":""}`}>{i<cur?"✓":i+1}</div>
              <div className={`wf-lbl ${i===cur?"active":""}`}>{WF_SHORT[s]}</div>
            </div>
          </div>
          {i<WF_STEPS.length-1&&<div className={`wf-conn ${i<cur?"done":""}`}/>}
        </div>
      ))}
    </div>
  );
};

// ─── DASHBOARD ─────────────────────────────────────────────────────────────
function Dashboard({cases,consultores,setPage,setSelCase}){
  const activos=cases.filter(c=>!["CERRADO","CERRADO_SIN_CONTRATACION"].includes(c.status)).length;
  const criticos=cases.filter(c=>getSlaStatus(c.slaUsado,c.sla)==="danger").length;
  const cerrados=cases.filter(c=>c.status==="CERRADO").length;
  const enviadas=cases.filter(c=>["PROPUESTA_ENVIADA","EN_DECISION","PROPUESTA_ACEPTADA","PENDIENTE_CONTRATACION","AUTORIZADO_EJECUCION","EN_EJECUCION","CERRADO"].includes(c.status)).length;
  const aceptadas=cases.filter(c=>["PROPUESTA_ACEPTADA","PENDIENTE_CONTRATACION","AUTORIZADO_EJECUCION","EN_EJECUCION","CERRADO"].includes(c.status)).length;
  const conv=enviadas>0?Math.round((aceptadas/enviadas)*100):0;
  const byStatus=cases.reduce((a,c)=>{a[c.status]=(a[c.status]||0)+1;return a},{});
  return (
    <div>
      <div className="section-title">Dashboard PMO</div>
      <div className="section-sub">Resumen operativo del ecosistema NODUS · 911MiPyme</div>
      <div className="grid-4">
        {[
          {num:activos,lbl:"Casos activos",delta:"↑ 2 este mes",cls:"up"},
          {num:criticos,lbl:"SLA críticos",delta:criticos>0?"⚠ Requieren atención":"✓ Todo en orden",cls:criticos>0?"dn":"up",col:criticos>0?"var(--danger)":undefined},
          {num:`${conv}%`,lbl:"Conversión propuesta",delta:"↑ 8pp vs anterior",cls:"up"},
          {num:cerrados,lbl:"Casos cerrados",delta:`${consultores.filter(c=>c.disponibilidad==="Disponible").length} consultores disponibles`,cls:"up"},
        ].map((s,i)=>(
          <div key={i} className="card card-sm">
            <div className="stat-num" style={s.col?{color:s.col}:{}}>{s.num}</div>
            <div className="stat-lbl">{s.lbl}</div>
            <div className={`stat-delta ${s.cls}`}>{s.delta}</div>
          </div>
        ))}
      </div>
      <div className="grid-2" style={{marginBottom:14}}>
        <div className="card">
          <div className="card-title" style={{marginBottom:12}}>Pipeline por estado</div>
          {Object.entries(byStatus).map(([st,n])=>(
            <div key={st} style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
              <Sb s={st}/>
              <div className="progress-track" style={{flex:1}}>
                <div className="pf pf-blue" style={{width:`${(n/cases.length)*100}%`}}/>
              </div>
              <span style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--text2)",minWidth:12}}>{n}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title" style={{marginBottom:12}}>SLA en riesgo</div>
          {cases.filter(c=>getSlaStatus(c.slaUsado,c.sla)!=="ok").length===0
            ? <div className="alert alert-success">✓ Todos los SLA en cumplimiento</div>
            : cases.filter(c=>getSlaStatus(c.slaUsado,c.sla)!=="ok").map(c=>(
              <div key={c.id} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:11,fontWeight:600}}>{c.id}</span>
                  <Sb s={c.status}/>
                </div>
                <SlaBar u={c.slaUsado} t={c.sla}/>
              </div>
            ))}
        </div>
      </div>
      <div className="card" style={{padding:0}}>
        <div style={{padding:"14px 16px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div className="card-title">Casos recientes</div>
          <span className="badge b-gray">{cases.length} total</span>
        </div>
        <div style={{overflowX:"auto"}}>
          <table>
            <thead><tr><th>ID</th><th>Empresa</th><th>Área</th><th>Estado</th><th>SLA</th><th>Consultor</th><th>Urgencia</th></tr></thead>
            <tbody>
              {cases.slice(0,6).map(c=>(
                <tr key={c.id} onClick={()=>{setSelCase(c);setPage("case-detail")}}>
                  <td><span style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--accent)"}}>{c.id}</span></td>
                  <td className="td-bold">{c.empresa}</td>
                  <td><span className="tag">{c.area}</span></td>
                  <td><Sb s={c.status}/></td>
                  <td><SlaBar u={c.slaUsado} t={c.sla} compact/></td>
                  <td>{c.consultor||<span style={{color:"var(--text3)"}}>—</span>}</td>
                  <td><span className={`badge ${c.urgencia==="Alta"?"b-red":c.urgencia==="Media"?"b-warn":"b-gray"}`}>{c.urgencia}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── CASES PAGE ─────────────────────────────────────────────────────────────
function CasesPage({cases,setCases,role,setPage,setSelCase,setBitacora}){
  const [filter,setFilter]=useState("all");
  const [search,setSearch]=useState("");
  const [showNew,setShowNew]=useState(false);
  const [form,setForm]=useState({empresa:"",area:"Tecnología",urgencia:"Alta",impacto:"Crítico",complejidad:"Medio",descripcion:""});

  const filtered=cases.filter(c=>(filter==="all"||c.status===filter)&&(c.empresa.toLowerCase().includes(search.toLowerCase())||c.id.includes(search)));

  const doTransition=(caseId,e)=>{
    e.stopPropagation();
    setCases(p=>p.map(c=>{
      if(c.id!==caseId)return c;
      const tr=TRANSITIONS[c.status];
      if(!tr)return c;
      return{...c,status:tr.next};
    }));
    const c=cases.find(x=>x.id===caseId);
    const tr=TRANSITIONS[c.status];
    if(tr) setBitacora(p=>[...p,{id:p.length+1,caso:caseId,actor:tr.actor,accion:tr.label,est_antes:c.status,est_des:tr.next,ts:new Date().toISOString().slice(0,16).replace("T"," "),tipo:"estado"}]);
  };

  const doCreate=()=>{
    if(!form.empresa||!form.descripcion)return;
    const nc={id:`NOD-2026-00${cases.length+1}`,empresa:form.empresa,area:form.area,urgencia:form.urgencia,impacto:form.impacto,complejidad:form.complejidad,status:"CREADO",consultor:null,consultorId:null,creado:new Date().toISOString().slice(0,10),sla:24,slaUsado:0,descripcion:form.descripcion,clasificacion:null,postulaciones:0,version:0,hitos:[]};
    setCases(p=>[...p,nc]);
    setBitacora(p=>[...p,{id:p.length+1,caso:nc.id,actor:"Sistema",accion:"Caso creado — Plantilla T1 registrada",est_antes:null,est_des:"CREADO",ts:new Date().toISOString().slice(0,16).replace("T"," "),tipo:"estado"}]);
    setShowNew(false);setForm({empresa:"",area:"Tecnología",urgencia:"Alta",impacto:"Crítico",complejidad:"Medio",descripcion:""});
  };

  const statuses=[...new Set(cases.map(c=>c.status))];

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
        <div><div className="section-title">Gestión de casos</div><div className="section-sub">Motor de workflow end-to-end</div></div>
        <button className="btn btn-primary" onClick={()=>setShowNew(true)}>＋ Nuevo caso (T1)</button>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <input className="form-input" style={{flex:1}} placeholder="🔍 Buscar empresa o ID..." value={search} onChange={e=>setSearch(e.target.value)}/>
        <select className="form-select" style={{width:180}} value={filter} onChange={e=>setFilter(e.target.value)}>
          <option value="all">Todos los estados</option>
          {statuses.map(s=><option key={s} value={s}>{STATE_LABELS[s]}</option>)}
        </select>
      </div>
      <div className="card" style={{padding:0}}>
        <div style={{overflowX:"auto"}}>
          <table>
            <thead><tr><th>ID</th><th>Empresa</th><th>Área</th><th>Estado</th><th>SLA</th><th>Consultor</th><th>Urgencia</th><th>Acción</th></tr></thead>
            <tbody>
              {filtered.map(c=>(
                <tr key={c.id} onClick={()=>{setSelCase(c);setPage("case-detail")}}>
                  <td><span style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--accent)"}}>{c.id}</span></td>
                  <td className="td-bold">{c.empresa}</td>
                  <td><span className="tag">{c.area}</span></td>
                  <td><Sb s={c.status}/></td>
                  <td><SlaBar u={c.slaUsado} t={c.sla} compact/></td>
                  <td style={{fontSize:11}}>{c.consultor||<span style={{color:"var(--text3)"}}>Sin asignar</span>}</td>
                  <td><span className={`badge ${c.urgencia==="Alta"?"b-red":c.urgencia==="Media"?"b-warn":"b-gray"}`}>{c.urgencia}</span></td>
                  <td onClick={e=>e.stopPropagation()}>
                    {TRANSITIONS[c.status]&&(
                      <button className="btn btn-ghost btn-sm" onClick={e=>doTransition(c.id,e)}>
                        {TRANSITIONS[c.status].label} →
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length===0&&<div className="empty"><div className="empty-ic">📋</div><div className="empty-txt">Sin casos</div></div>}
      </div>

      {showNew&&(
        <div className="modal-ov">
          <div className="modal">
            <div className="modal-hd">
              <div className="modal-title">Plantilla T1 — Registro de necesidad empresarial</div>
              <button className="modal-close" onClick={()=>setShowNew(false)}>✕</button>
            </div>
            <div className="alert alert-info">El sistema generará automáticamente el ID único del caso y la estructura documental al registrar.</div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-lbl">Nombre de la empresa *</label>
                <input className="form-input" value={form.empresa} onChange={e=>setForm({...form,empresa:e.target.value})} placeholder="Ej: Mi Empresa SAS"/>
              </div>
              <div className="form-group">
                <label className="form-lbl">Área de necesidad</label>
                <select className="form-select" value={form.area} onChange={e=>setForm({...form,area:e.target.value})}>
                  {["Tecnología","Finanzas","Operaciones","Estrategia","Legal","RRHH","Analítica","Transformación digital"].map(a=><option key={a}>{a}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row3">
              <div className="form-group">
                <label className="form-lbl">Urgencia</label>
                <select className="form-select" value={form.urgencia} onChange={e=>setForm({...form,urgencia:e.target.value})}>
                  {["Alta","Media","Baja"].map(u=><option key={u}>{u}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-lbl">Impacto</label>
                <select className="form-select" value={form.impacto} onChange={e=>setForm({...form,impacto:e.target.value})}>
                  {["Crítico","Alto","Medio","Bajo"].map(i=><option key={i}>{i}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-lbl">Complejidad</label>
                <select className="form-select" value={form.complejidad} onChange={e=>setForm({...form,complejidad:e.target.value})}>
                  {["Estratégico","Alto","Medio","Bajo"].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-lbl">Descripción de la necesidad empresarial *</label>
              <textarea className="form-textarea" value={form.descripcion} onChange={e=>setForm({...form,descripcion:e.target.value})} placeholder="Describe el problema o necesidad de forma detallada para facilitar la clasificación..." rows={4}/>
            </div>
            <div className="form-group">
              <label className="form-lbl">Adjuntar documentos soporte</label>
              <div style={{border:"1px dashed var(--border2)",borderRadius:"var(--r)",padding:"18px",textAlign:"center",color:"var(--text3)",fontSize:12}}>
                📎 Arrastra archivos aquí o haz clic (PDF, DOCX, XLSX)
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:14}}>
              <input type="checkbox" id="terms"/>
              <label htmlFor="terms" style={{fontSize:11,color:"var(--text2)"}}>Acepto los términos y condiciones y la política de tratamiento de datos personales</label>
            </div>
            <div className="modal-ft">
              <button className="btn btn-ghost" onClick={()=>setShowNew(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={doCreate}>Registrar caso</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CASE DETAIL ─────────────────────────────────────────────────────────────
function CaseDetail({caso,cases,setCases,setPage,bitacora,setBitacora,consultores}){
  const [tab,setTab]=useState("resumen");
  const [showTr,setShowTr]=useState(false);
  const [obs,setObs]=useState("");
  const [checklist,setChecklist]=useState([
    {id:1,texto:"Contrato de prestación de servicios firmado",hecho:false,resp:"Consultor"},
    {id:2,texto:"Carta de intención / aceptación formal (TP6D)",hecho:true,resp:"Mipyme"},
    {id:3,texto:"Marco operativo T7B cargado",hecho:false,resp:"Consultor"},
    {id:4,texto:"Evidencia de póliza de responsabilidad",hecho:false,resp:"Consultor"},
    {id:5,texto:"Confirmación de acuerdo de confidencialidad",hecho:false,resp:"Advisory"},
  ]);

  if(!caso)return null;
  const live=cases.find(c=>c.id===caso.id)||caso;
  const tr=TRANSITIONS[live.status];
  const logs=bitacora.filter(b=>b.caso===live.id);
  const checkPct=Math.round((checklist.filter(c=>c.hecho).length/checklist.length)*100);

  const doTr=()=>{
    if(!tr)return;
    setCases(p=>p.map(c=>c.id===live.id?{...c,status:tr.next}:c));
    setBitacora(p=>[...p,{id:p.length+1,caso:live.id,actor:tr.actor,accion:tr.label+(obs?` — "${obs}"`:""),est_antes:live.status,est_des:tr.next,ts:new Date().toISOString().slice(0,16).replace("T"," "),tipo:"estado"}]);
    setObs("");setShowTr(false);
  };

  const docs=[
    {nombre:"Plantilla T1 — Registro de necesidad",tipo:"T1",version:"v1",etapa:"Onboarding",fecha:live.creado,autor:live.empresa},
    live.clasificacion&&{nombre:"Clasificación T2 — Debida diligencia",tipo:"T2",version:"v1",etapa:"Clasificación",fecha:live.creado,autor:"Advisory"},
    live.consultor&&{nombre:`Postulación T3C — ${live.consultor}`,tipo:"T3C",version:"v1",etapa:"Bolsa",fecha:live.creado,autor:live.consultor},
    live.version>0&&{nombre:`Propuesta TP4C — v${live.version}`,tipo:"TP4C",version:`v${live.version}`,etapa:"Propuesta",fecha:live.creado,autor:live.consultor},
  ].filter(Boolean);

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        <button className="btn btn-ghost btn-sm" onClick={()=>setPage("cases")}>← Casos</button>
        <span style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--accent)",fontWeight:700}}>{live.id}</span>
        <Sb s={live.status}/>
        {getSlaStatus(live.slaUsado,live.sla)==="danger"&&<span className="badge b-red">⚠ SLA crítico</span>}
        {tr&&<button className="btn btn-primary btn-sm" style={{marginLeft:"auto"}} onClick={()=>setShowTr(true)}>{tr.label} →</button>}
      </div>

      <div className="grid-2" style={{marginBottom:12}}>
        <div className="card">
          <div style={{fontWeight:600,marginBottom:6}}>{live.empresa}</div>
          <div style={{fontSize:12,color:"var(--text2)",marginBottom:10,lineHeight:1.5}}>{live.descripcion}</div>
          <div className="pill-group">
            <span className="tag">{live.area}</span>
            <span className={`badge ${live.urgencia==="Alta"?"b-red":"b-warn"}`}>Urgencia: {live.urgencia}</span>
            <span className="badge b-purple">Impacto: {live.impacto}</span>
            <span className="badge b-gray">Complejidad: {live.complejidad}</span>
            {live.clasificacion&&<span className="badge b-teal">{live.clasificacion}</span>}
          </div>
        </div>
        <div className="card card-sm">
          <div className="info-row"><span className="info-k">SLA del caso</span><span style={{fontSize:10,fontFamily:"var(--mono)",color:getSlaStatus(live.slaUsado,live.sla)==="danger"?"var(--danger)":getSlaStatus(live.slaUsado,live.sla)==="warn"?"var(--warn)":"var(--success)"}}>{live.slaUsado}h / {live.sla}h</span></div>
          <SlaBar u={live.slaUsado} t={live.sla}/>
          <div className="divider"/>
          {[["Consultor",live.consultor||"Sin asignar"],["Postulaciones",live.postulaciones],["Creado",live.creado],["Versión propuesta",live.version>0?`v${live.version}`:"—"]].map(([k,v])=>(
            <div key={k} className="info-row"><span className="info-k">{k}</span><span className="info-v" style={{fontSize:11}}>{v}</span></div>
          ))}
        </div>
      </div>

      <div className="card" style={{marginBottom:12,overflowX:"auto"}}>
        <div className="card-sub" style={{marginBottom:8}}>Posición en el workflow</div>
        <WfStepper status={live.status}/>
      </div>

      <div className="tabs">
        {[["resumen","Resumen"],["hitos",`Hitos (${live.hitos?.length||0})`],["docs","Documentos"],["bitacora","Bitácora"],["checklist","Checklist T7A"]].map(([v,l])=>(
          <button key={v} className={`tab ${tab===v?"active":""}`} onClick={()=>setTab(v)}>{l}</button>
        ))}
      </div>

      {tab==="resumen"&&(
        <div className="grid-2">
          <div className="card">
            <div className="card-title" style={{marginBottom:10}}>Ficha del caso</div>
            {[["ID caso",live.id],["Empresa",live.empresa],["Ciudad",live.ciudad||"—"],["Contacto",live.contacto||"—"],["Área",live.area],["Urgencia",live.urgencia],["Impacto",live.impacto],["Complejidad",live.complejidad],["Clasificación",live.clasificacion||"Pendiente"],["Consultor asignado",live.consultor||"Sin asignar"]].map(([k,v])=>(
              <div key={k} className="info-row"><span className="info-k">{k}</span><span className="info-v">{v}</span></div>
            ))}
          </div>
          <div className="card">
            <div className="card-title" style={{marginBottom:10}}>Próxima acción</div>
            {tr?(
              <>
                <div className="alert alert-info">Siguiente: <strong>{tr.label}</strong><br/>Actor: {tr.actor}</div>
                <button className="btn btn-primary w-full" style={{width:"100%"}} onClick={()=>setShowTr(true)}>Ejecutar → {tr.label}</button>
              </>
            ):<div className="alert alert-success">✓ Caso en estado final</div>}
            {live.status==="PENDIENTE_CONTRATACION"&&(
              <div style={{marginTop:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:11,color:"var(--text2)"}}>Checklist T7A</span>
                  <span style={{fontSize:10,fontFamily:"var(--mono)",color:checkPct===100?"var(--success)":"var(--warn)"}}>{checkPct}%</span>
                </div>
                <div className="progress-track"><div className={`pf ${checkPct===100?"pf-ok":"pf-warn"}`} style={{width:`${checkPct}%`}}/></div>
                {checkPct<100&&<div className="alert alert-warn" style={{marginTop:8,fontSize:11}}>⚠ Completa el checklist antes de autorizar ejecución</div>}
              </div>
            )}
          </div>
        </div>
      )}

      {tab==="hitos"&&(
        <div className="card">
          <div className="card-title" style={{marginBottom:12}}>Plan de hitos y entregables (T8C)</div>
          {live.hitos&&live.hitos.length>0?(
            live.hitos.map((h,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
                <div style={{width:24,height:24,borderRadius:"50%",background:h.estado==="completado"?"var(--success)":h.estado==="en_curso"?"var(--accent)":"var(--bg4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",flexShrink:0}}>
                  {h.estado==="completado"?"✓":h.estado==="en_curso"?"●":(i+1)}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:12}}>{h.nombre}</div>
                  <div style={{fontSize:10,color:"var(--text3)"}}>Fecha objetivo: {h.fecha}</div>
                </div>
                <span className={`badge ${h.estado==="completado"?"b-green":h.estado==="en_curso"?"b-blue":"b-gray"}`}>
                  {h.estado==="completado"?"Completado":h.estado==="en_curso"?"En curso":"Pendiente"}
                </span>
              </div>
            ))
          ):<div className="empty"><div className="empty-ic">⏱</div><div className="empty-txt">Sin hitos definidos</div></div>}
        </div>
      )}

      {tab==="docs"&&(
        <div className="card">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div className="card-title">Repositorio documental</div>
            <button className="btn btn-ghost btn-sm">📎 Subir</button>
          </div>
          {docs.map((d,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:"1px solid var(--border)"}}>
              <span style={{fontSize:18}}>📄</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:500,fontSize:12}}>{d.nombre}</div>
                <div style={{fontSize:10,color:"var(--text3)"}}>{d.etapa} · {d.fecha} · {d.autor}</div>
              </div>
              <span className="badge b-blue">{d.tipo}</span>
              <span className="tag">{d.version}</span>
              <button className="btn-ic">↓</button>
            </div>
          ))}
          {docs.length===0&&<div className="empty"><div className="empty-ic">📄</div><div className="empty-txt">Sin documentos aún</div></div>}
        </div>
      )}

      {tab==="bitacora"&&(
        <div className="card">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div className="card-title">Bitácora inmutable</div>
            <span className="badge b-gray">🔒 Solo lectura · {logs.length} registros</span>
          </div>
          <div className="timeline">
            {logs.map(b=>(
              <div key={b.id} className="tl-item">
                <div className={`tl-dot ${b.tipo==="hito"?"s":b.tipo==="documento"?"g":"active"}`}/>
                <div className="tl-ts">{b.ts}</div>
                <div className="tl-txt">{b.accion}</div>
                <div className="tl-actor">{b.actor}</div>
                {b.est_antes&&(
                  <div style={{marginTop:3,display:"flex",gap:4,alignItems:"center",flexWrap:"wrap"}}>
                    <Sb s={b.est_antes}/><span style={{color:"var(--text3)",fontSize:10}}>→</span><Sb s={b.est_des}/>
                  </div>
                )}
              </div>
            ))}
            {logs.length===0&&<div className="empty-txt" style={{color:"var(--text3)"}}>Sin registros aún</div>}
          </div>
        </div>
      )}

      {tab==="checklist"&&(
        <div className="card">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
            <div className="card-title">Checklist T7A — Formalización y contratación</div>
            <span style={{fontFamily:"var(--mono)",fontSize:11,color:checkPct===100?"var(--success)":"var(--warn)",fontWeight:700}}>{checkPct}%</span>
          </div>
          <div className="progress-track" style={{marginBottom:14}}>
            <div className={`pf ${checkPct===100?"pf-ok":"pf-warn"}`} style={{width:`${checkPct}%`}}/>
          </div>
          {checkPct<100&&<div className="alert alert-warn">⚠ El caso no puede avanzar a AUTORIZADO PARA EJECUCIÓN hasta completar este checklist (RF-070)</div>}
          {checklist.map(item=>(
            <div key={item.id} className="check-row" onClick={()=>setChecklist(p=>p.map(c=>c.id===item.id?{...c,hecho:!c.hecho}:c))}>
              <div className={`check-ic ${item.hecho?"done":""}`}>{item.hecho?"✓":""}</div>
              <div>
                <div style={{fontSize:12,fontWeight:item.hecho?400:500,color:item.hecho?"var(--text3)":"var(--text)",textDecoration:item.hecho?"line-through":"none"}}>{item.texto}</div>
                <div style={{fontSize:10,color:"var(--text3)"}}>Responsable: {item.resp}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showTr&&tr&&(
        <div className="modal-ov">
          <div className="modal">
            <div className="modal-hd">
              <div className="modal-title">Confirmar transición de estado</div>
              <button className="modal-close" onClick={()=>setShowTr(false)}>✕</button>
            </div>
            <div className="alert alert-info">Esta acción quedará registrada de forma inmutable en la bitácora del caso.</div>
            <div style={{background:"var(--bg3)",borderRadius:"var(--r)",padding:"12px",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}><Sb s={live.status}/><span style={{color:"var(--text3)"}}>→</span><Sb s={tr.next}/></div>
              <div style={{fontSize:10,color:"var(--text3)",marginTop:6}}>Actor: <strong style={{color:"var(--text2)"}}>{tr.actor}</strong></div>
            </div>
            <div className="form-group">
              <label className="form-lbl">Observaciones (opcional)</label>
              <textarea className="form-textarea" value={obs} onChange={e=>setObs(e.target.value)} placeholder="Agrega notas sobre esta transición..." rows={3}/>
            </div>
            <div className="modal-ft">
              <button className="btn btn-ghost" onClick={()=>setShowTr(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={doTr}>✓ Confirmar y avanzar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── BOLSA PAGE ─────────────────────────────────────────────────────────────
function BolsaPage({cases,setCases,consultores,role,setBitacora}){
  const [showPostular,setShowPostular]=useState(null);
  const bolsa=cases.filter(c=>c.status==="EN_POSTULACION");
  const doPostular=(caseId)=>{
    setCases(p=>p.map(c=>c.id===caseId?{...c,postulaciones:c.postulaciones+1}:c));
    setShowPostular(null);
  };
  return (
    <div>
      <div className="section-title">Bolsa interna de casos</div>
      <div className="section-sub">Casos clasificados disponibles para postulación estructurada</div>
      {bolsa.length===0?(
        <div className="empty"><div className="empty-ic">⚡</div><div className="empty-txt">No hay casos disponibles en la bolsa</div></div>
      ):bolsa.map(c=>(
        <div key={c.id} className="card" style={{marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,flexWrap:"wrap",gap:6}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--accent)",fontWeight:700}}>{c.id}</span>
              <span className="badge b-blue">Nueva oportunidad</span>
            </div>
            <Sb s={c.status}/>
          </div>
          <div style={{fontWeight:600,marginBottom:4}}>{c.empresa} · {c.ciudad}</div>
          <div style={{fontSize:12,color:"var(--text2)",marginBottom:10,lineHeight:1.5}}>{c.descripcion}</div>
          <div className="pill-group" style={{marginBottom:12}}>
            <span className="tag">{c.area}</span>
            <span className={`badge ${c.urgencia==="Alta"?"b-red":"b-warn"}`}>{c.urgencia}</span>
            <span className="badge b-purple">{c.complejidad}</span>
            <span className="badge b-teal">{c.clasificacion}</span>
            <span className="badge b-gray">👤 {c.postulaciones} postulaciones</span>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button className="btn btn-primary btn-sm" onClick={()=>setShowPostular(c.id)}>Postularme (T3C)</button>
            <button className="btn btn-ghost btn-sm">Solicitar aclaración (T3A)</button>
          </div>
        </div>
      ))}
      {showPostular&&(
        <div className="modal-ov">
          <div className="modal">
            <div className="modal-hd">
              <div className="modal-title">Postulación T3C — {showPostular}</div>
              <button className="modal-close" onClick={()=>setShowPostular(null)}>✕</button>
            </div>
            <div className="form-group">
              <label className="form-lbl">Manifiesto de interés</label>
              <textarea className="form-textarea" placeholder="Describe por qué eres la persona indicada para este caso..." rows={3}/>
            </div>
            <div className="form-group">
              <label className="form-lbl">Experiencia relevante</label>
              <textarea className="form-textarea" placeholder="Proyectos similares, resultados obtenidos..." rows={3}/>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-lbl">Disponibilidad</label>
                <select className="form-select"><option>Inmediata</option><option>En 2 semanas</option><option>En 1 mes</option></select>
              </div>
              <div className="form-group">
                <label className="form-lbl">Dedicación estimada</label>
                <select className="form-select"><option>100% exclusivo</option><option>50% parcial</option><option>Por demanda</option></select>
              </div>
            </div>
            <div className="modal-ft">
              <button className="btn btn-ghost" onClick={()=>setShowPostular(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={()=>doPostular(showPostular)}>Enviar postulación</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CONSULTORES PAGE ────────────────────────────────────────────────────────
function ConsultoresPage({consultores}){
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:20}}>
        <div><div className="section-title">Red de consultores</div><div className="section-sub">Ecosistema de talento NODUS</div></div>
        <button className="btn btn-primary">＋ Registrar consultor</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
        {consultores.map(c=>(
          <div key={c.id} className="card" style={{cursor:"pointer",transition:"border-color .15s"}} onMouseEnter={e=>e.currentTarget.style.borderColor="var(--accent)"} onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <div style={{width:38,height:38,borderRadius:"50%",background:"var(--accent3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>👤</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:600,fontSize:13}}>{c.nombre}</div>
                <div style={{fontSize:10,color:"var(--text3)"}}>{c.id} · {c.ciudad}</div>
              </div>
              <span className={`badge ${c.disponibilidad==="Disponible"?"b-green":"b-warn"}`}>{c.disponibilidad}</span>
            </div>
            <div className="pill-group" style={{marginBottom:10}}>
              {c.especialidades.map(e=><span key={e} className="tag">{e}</span>)}
              <span className="badge b-purple">{c.nivel}</span>
            </div>
            <div className="divider"/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,textAlign:"center"}}>
              {[["📁",c.casosActivos,"Activos"],["⭐",c.rating,"Rating"],["🏆",`${c.reputacion}%`,"Reput."]].map(([ic,v,l])=>(
                <div key={l}>
                  <div style={{fontWeight:700,fontSize:13}}>{ic} {v}</div>
                  <div style={{fontSize:10,color:"var(--text3)"}}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{marginTop:8}}>
              <div className="progress-track"><div className="pf pf-ok" style={{width:`${c.reputacion}%`}}/></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── EMPRESAS PAGE ───────────────────────────────────────────────────────────
function EmpresasPage({empresas}){
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:20}}>
        <div><div className="section-title">Empresas registradas</div><div className="section-sub">Directorio de mipymes en la plataforma</div></div>
        <button className="btn btn-primary">＋ Nueva empresa</button>
      </div>
      <div className="card" style={{padding:0}}>
        <div style={{overflowX:"auto"}}>
          <table>
            <thead><tr><th>ID</th><th>Empresa</th><th>NIT</th><th>Ciudad</th><th>Sector</th><th>Contacto</th><th>Casos</th></tr></thead>
            <tbody>
              {empresas.map(e=>(
                <tr key={e.id}>
                  <td><span style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)"}}>{e.id}</span></td>
                  <td className="td-bold">{e.nombre}</td>
                  <td><span style={{fontFamily:"var(--mono)",fontSize:10}}>{e.nit}</span></td>
                  <td style={{fontSize:12}}>{e.ciudad}</td>
                  <td><span className="tag">{e.sector}</span></td>
                  <td>
                    <div style={{fontSize:12}}>{e.contacto}</div>
                    <div style={{fontSize:10,color:"var(--text3)"}}>{e.email}</div>
                  </td>
                  <td><span className="badge b-blue">{e.casos}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── BITACORA PAGE ────────────────────────────────────────────────────────────
function BitacoraPage({bitacora}){
  return (
    <div>
      <div className="section-title">Bitácora de auditoría</div>
      <div className="section-sub">Registro inmutable de todas las acciones — append-only</div>
      <div className="card" style={{padding:0}}>
        <div style={{overflowX:"auto"}}>
          <table>
            <thead><tr><th>#</th><th>Timestamp</th><th>Caso</th><th>Actor</th><th>Acción</th><th>Transición</th><th>Tipo</th></tr></thead>
            <tbody>
              {[...bitacora].reverse().map(b=>(
                <tr key={b.id}>
                  <td><span style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)"}}>{b.id}</span></td>
                  <td><span style={{fontFamily:"var(--mono)",fontSize:10}}>{b.ts}</span></td>
                  <td><span style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--accent)"}}>{b.caso}</span></td>
                  <td style={{fontSize:12}}>{b.actor}</td>
                  <td className="td-bold" style={{maxWidth:220,fontSize:11}}>{b.accion}</td>
                  <td>
                    {b.est_antes?(
                      <div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap"}}>
                        <Sb s={b.est_antes}/><span style={{color:"var(--text3)",fontSize:10}}>→</span><Sb s={b.est_des}/>
                      </div>
                    ):"—"}
                  </td>
                  <td>
                    <span className={`badge ${b.tipo==="estado"?"b-blue":b.tipo==="hito"?"b-green":"b-gray"}`}>{b.tipo}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── SLA PAGE ─────────────────────────────────────────────────────────────────
function SlaPage(){
  const slaConfig=[
    {etapa:"Revisión (CREADO → EN_REVISION)",horas:24,usado:2,resp:"Advisory"},
    {etapa:"Clasificación (→ CLASIFICADO)",horas:48,usado:38,resp:"Advisory"},
    {etapa:"Asignación (→ ASIGNADO)",horas:72,usado:48,resp:"Advisory"},
    {etapa:"Diseño propuesta",horas:168,usado:96,resp:"Consultor"},
    {etapa:"QA y envío",horas:48,usado:12,resp:"Advisory"},
    {etapa:"Decisión cliente",horas:120,usado:88,resp:"Mipyme"},
    {etapa:"Contratación T7A",horas:72,usado:70,resp:"Advisory"},
    {etapa:"Ejecución total",horas:720,usado:480,resp:"Consultor"},
  ];
  return (
    <div>
      <div className="section-title">SLA y alertas</div>
      <div className="section-sub">Configuración y monitor de tiempos por etapa del workflow</div>
      <div className="grid-3">
        {[
          {num:slaConfig.filter(s=>getSlaStatus(s.usado,s.horas)==="danger").length,lbl:"SLA críticos",cls:"dn",col:"var(--danger)"},
          {num:slaConfig.filter(s=>getSlaStatus(s.usado,s.horas)==="warn").length,lbl:"En riesgo",cls:"wr",col:"var(--warn)"},
          {num:slaConfig.filter(s=>getSlaStatus(s.usado,s.horas)==="ok").length,lbl:"En cumplimiento",cls:"up",col:"var(--success)"},
        ].map((s,i)=>(
          <div key={i} className="card card-sm">
            <div className="stat-num" style={{color:s.col}}>{s.num}</div>
            <div className="stat-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-title" style={{marginBottom:14}}>Monitor de SLA activos</div>
        {slaConfig.map((s,i)=>(
          <div key={i} style={{padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <span style={{fontSize:12,fontWeight:500}}>{s.etapa}</span>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <span className={`badge ${getSlaStatus(s.usado,s.horas)==="danger"?"b-red":getSlaStatus(s.usado,s.horas)==="warn"?"b-warn":"b-green"}`}>
                  {getSlaStatus(s.usado,s.horas)==="danger"?"⚠ Crítico":getSlaStatus(s.usado,s.horas)==="warn"?"Riesgo":"✓ OK"}
                </span>
                <span style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--text3)"}}>{s.usado}h/{s.horas}h</span>
              </div>
            </div>
            <SlaBar u={s.usado} t={s.horas}/>
            <div style={{fontSize:10,color:"var(--text3)",marginTop:3}}>Responsable: {s.resp}</div>
          </div>
        ))}
      </div>
      <div className="card" style={{marginTop:12}}>
        <div className="card-title" style={{marginBottom:10}}>Configuración de alertas automáticas</div>
        <div className="alert alert-info">Las alertas se disparan automáticamente: preventiva (75%), crítica (90%), escalamiento (100%).</div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-lbl">Alerta preventiva (%)</label>
            <input className="form-input" type="number" defaultValue={75}/>
          </div>
          <div className="form-group">
            <label className="form-lbl">Alerta crítica (%)</label>
            <input className="form-input" type="number" defaultValue={90}/>
          </div>
        </div>
        <button className="btn btn-primary btn-sm">Guardar configuración</button>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App(){
  const [role,setRole]=useState("Advisory");
  const [page,setPage]=useState("dashboard");
  const [cases,setCases]=useState(SEED_CASES);
  const [selCase,setSelCase]=useState(null);
  const [bitacora,setBitacora]=useState(SEED_BITACORA);
  const [consultores]=useState(SEED_CONSULTORES);
  const [empresas]=useState(SEED_EMPRESAS);

  const roles=["Advisory","Consultor","Mipyme","Admin"];
  const critCount=cases.filter(c=>getSlaStatus(c.slaUsado,c.sla)==="danger").length;
  const bolsaCount=cases.filter(c=>c.status==="EN_POSTULACION").length;
  const activeCount=cases.filter(c=>!["CERRADO","CERRADO_SIN_CONTRATACION"].includes(c.status)).length;

  const navSections=[
    {label:"Principal",items:[
      {id:"dashboard",ic:"📊",label:"Dashboard PMO"},
      {id:"cases",ic:"📋",label:"Casos",badge:activeCount},
      {id:"bolsa",ic:"⚡",label:"Bolsa interna",badge:bolsaCount,bw:true},
    ]},
    {label:"Actores",items:[
      {id:"empresas",ic:"🏢",label:"Empresas"},
      {id:"consultores",ic:"👤",label:"Consultores"},
    ]},
    {label:"Control",items:[
      {id:"bitacora",ic:"📖",label:"Bitácora",lock:role==="Mipyme"},
      {id:"sla",ic:"⏱",label:"SLA y alertas"},
    ]},
  ];

  const titles={dashboard:"Dashboard PMO",cases:"Casos",bolsa:"Bolsa interna",
    empresas:"Empresas",consultores:"Consultores",bitacora:"Bitácora de auditoría",
    sla:"SLA y alertas","case-detail":selCase?selCase.id:"Caso"};

  return (
    <>
      <style>{CSS}</style>
      <div className="shell">
        <aside className="sidebar">
          <div className="logo">
            <div className="logo-name">N<span>O</span>DUS</div>
            <div className="logo-sub">911MiPyme · SaaS MVP</div>
          </div>
          {navSections.map(s=>(
            <div key={s.label} className="nav-sect">
              <div className="nav-lbl">{s.label}</div>
              {s.items.map(item=>(
                <button key={item.id} className={`nav-item ${page===item.id?"active":""}`}
                  style={{opacity:item.lock?0.4:1,cursor:item.lock?"not-allowed":"pointer"}}
                  onClick={()=>{if(!item.lock)setPage(item.id)}}>
                  <span className="nav-ic">{item.ic}</span>
                  {item.label}
                  {item.badge>0&&<span className={`nav-badge ${item.bw?"w":""}`}>{item.badge}</span>}
                  {critCount>0&&item.id==="sla"&&<span className="nav-badge d">{critCount}</span>}
                  {item.lock&&<span style={{marginLeft:"auto",fontSize:10}}>🔒</span>}
                </button>
              ))}
            </div>
          ))}
          <div className="sidebar-footer">
            <div style={{fontSize:10,color:"var(--text3)",marginBottom:6}}>Vista según rol</div>
            <div className="role-switcher" style={{flexWrap:"wrap"}}>
              {roles.map(r=><button key={r} className={`role-btn ${role===r?"active":""}`} onClick={()=>setRole(r)}>{r}</button>)}
            </div>
          </div>
        </aside>
        <main className="main">
          <div className="topbar">
            <span className="topbar-title">{titles[page]}</span>
            {critCount>0&&<span className="badge b-red">⚠ {critCount} SLA crítico{critCount>1?"s":""}</span>}
            <div className="topbar-right">
              <span className="badge b-gray" style={{fontSize:10}}>NODUS MVP v1.0</span>
              <button className="btn-ic">🔔</button>
              <div style={{width:28,height:28,borderRadius:"50%",background:"var(--accent3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700}}>{role[0]}</div>
            </div>
          </div>
          <div className="page">
            {page==="dashboard"&&<Dashboard cases={cases} consultores={consultores} setPage={setPage} setSelCase={setSelCase}/>}
            {page==="cases"&&<CasesPage cases={cases} setCases={setCases} role={role} setPage={setPage} setSelCase={setSelCase} setBitacora={setBitacora}/>}
            {page==="case-detail"&&<CaseDetail caso={selCase} cases={cases} setCases={setCases} setPage={setPage} bitacora={bitacora} setBitacora={setBitacora} consultores={consultores}/>}
            {page==="bolsa"&&<BolsaPage cases={cases} setCases={setCases} consultores={consultores} role={role} setBitacora={setBitacora}/>}
            {page==="consultores"&&<ConsultoresPage consultores={consultores}/>}
            {page==="empresas"&&<EmpresasPage empresas={empresas}/>}
            {page==="bitacora"&&<BitacoraPage bitacora={bitacora}/>}
            {page==="sla"&&<SlaPage/>}
          </div>
        </main>
      </div>
    </>
  );
}
