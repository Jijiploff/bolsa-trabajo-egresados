export interface Notificacion {
  id: number;
  usuario_id: number;
  tipo: 'NUEVA_OFERTA' | 'CAMBIO_ESTADO' | 'NUEVA_POSTULACION';
  mensaje: string;
  leida: boolean;
  url?: string | null;
  creada_en: string;
}