export interface HistorialEstado {
  id: number;
  postulacion_id: number;
  estado: 'POSTULADO' | 'REVISION' | 'ENTREVISTA' | 'CONTRATADO' | 'RECHAZADO';
  fecha: string;
  comentario?: string | null;
}

export interface Postulacion {
  id: number;
  oferta_id: number;
  egresado_id: number;
  estado: 'POSTULADO' | 'REVISION' | 'ENTREVISTA' | 'CONTRATADO' | 'RECHAZADO';
  fecha_postulacion: string;
  fecha_actualizacion: string;
  egresado?: {
    id: number;
    nombres: string;
    apellidos: string;
    titulo?: string | null;
    universidad?: string | null;
    cv_url?: string | null;
    usuario?: { email: string };
  };
  oferta?: {
    id: number;
    titulo: string;
    empresa?: { id: number; nombre: string };
  };
  historial_estados?: HistorialEstado[];
}

export interface ChangeStatusRequest {
  estado: 'POSTULADO' | 'REVISION' | 'ENTREVISTA' | 'CONTRATADO' | 'RECHAZADO';
  comentario?: string | null;
}