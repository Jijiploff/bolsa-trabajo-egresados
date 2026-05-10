export interface FormacionAcademica {
  id?: number;
  institucion: string;
  titulo: string;
  nivel: 'PREGRADO' | 'POSTGRADO' | 'DIPLOMADO' | 'MAESTRIA' | 'DOCTORADO' | 'CURSO';
  anio_inicio?: number | null;
  anio_fin?: number | null;
  descripcion?: string | null;
}

export interface ExperienciaLaboral {
  id?: number;
  empresa: string;
  cargo: string;
  fecha_inicio: string;
  fecha_fin?: string | null;
  descripcion?: string | null;
  actual_trabajo: boolean;
}

export interface Habilidad {
  id: number;
  nombre: string;
  tipo: 'TECNICA' | 'BLANDA';
}

export interface EgresadoHabilidad {
  id: number;
  habilidad_id: number;
  nivel?: number | null;
  habilidad: Habilidad;
}

export interface Egresado {
  id: number;
  usuario_id: number;
  usuario?: { id: number; email: string; activo: boolean };
  nombres: string;
  apellidos: string;
  fecha_nacimiento?: string | null;
  ciudad?: string | null;
  pais?: string | null;
  telefono?: string | null;
  direccion?: string | null;
  foto_url?: string | null;
  cv_url?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  titulo?: string | null;
  universidad?: string | null;
  carrera_id?: number | null;
  carrera?: { id: number; nombre: string } | null;
  anio_egreso?: number | null;
  descripcion_personal?: string | null;
  formacion_academica?: FormacionAcademica[];
  experiencia_laboral?: ExperienciaLaboral[];
  habilidades?: EgresadoHabilidad[];
}

export interface CreateEgresadoRequest {
  usuario_id?: number;
  nombres: string;
  apellidos: string;
  fecha_nacimiento?: string | null;
  ciudad?: string | null;
  pais?: string | null;
  telefono?: string | null;
  direccion?: string | null;
  foto_url?: string | null;
  cv_url?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  titulo?: string | null;
  universidad?: string | null;
  carrera_id?: number | null;
  anio_egreso?: number | null;
  descripcion_personal?: string | null;
  formacion_academica?: Omit<FormacionAcademica, 'id'>[];
  experiencia_laboral?: Omit<ExperienciaLaboral, 'id'>[];
  habilidades?: { habilidad_id: number; nivel?: number }[];
}