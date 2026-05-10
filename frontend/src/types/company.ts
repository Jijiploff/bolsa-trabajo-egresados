export interface Empresa {
  id: number;
  usuario_id: number;
  usuario?: { id: number; email: string; activo: boolean };
  nombre: string;
  descripcion?: string | null;
  sector?: string | null;
  tamanio?: string | null;
  ubicacion?: string | null;
  sitio_web?: string | null;
  logo_url?: string | null;
  _count?: { ofertas: number };
}

export interface CreateEmpresaRequest {
  usuario_id?: number;
  nombre: string;
  descripcion?: string | null;
  sector?: string | null;
  tamanio?: string | null;
  ubicacion?: string | null;
  sitio_web?: string | null;
  logo_url?: string | null;
}