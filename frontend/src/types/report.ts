// Tipos para solicitudes de reportes (simples, solo parámetros)
export interface ReporteQuery {
  tipo: 'egresados-carrera' | 'ofertas-activas' | 'postulaciones-oferta' | 'empleabilidad-carrera' | 'demanda-habilidades' | 'comparacion-cohortes';
  ano?: number;
  ofertaId?: number;
  anos?: string; // cohortes separadas por coma
}