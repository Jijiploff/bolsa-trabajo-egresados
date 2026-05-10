import { Empresa } from './company';
import { Habilidad } from './graduate';

export interface OfertaHabilidad {
  id: number;
  oferta_id: number;
  habilidad_id: number;
  habilidad: Habilidad;
}

export interface OfertaLaboral {
  id: number;
  empresa_id: number;
  empresa?: Partial<Empresa>;
  titulo: string;
  descripcion: string;
  salario_min?: number | null;
  salario_max?: number | null;
  modalidad: 'PRESENCIAL' | 'REMOTO' | 'HIBRIDO';
  ubicacion?: string | null;
  requisitos?: string | null;
  fecha_publicacion: string;
  fecha_cierre?: string | null;
  activa: boolean;
  habilidades?: OfertaHabilidad[];
  _count?: { postulaciones: number };
}

export interface CreateOfertaRequest {
  empresa_id?: number;
  titulo: string;
  descripcion: string;
  salario_min?: number | null;
  salario_max?: number | null;
  modalidad: 'PRESENCIAL' | 'REMOTO' | 'HIBRIDO';
  ubicacion?: string | null;
  requisitos?: string | null;
  fecha_cierre?: string | null;
  habilidades?: { habilidad_id: number }[];
}