export interface AdminKPIs {
  totalEgresados: number;
  totalEmpresas: number;
  totalOfertasActivas: number;
  tasaEmpleabilidad: number;
}

export interface CarreraCount {
  carrera: string;
  egresados: number;
}

export interface AnoCount {
  ano: number;
  cantidad: number;
}

export interface HabilidadDemanda {
  habilidad: string;
  tipo: string;
  demanda: number;
}

export interface CiudadComparativa {
  ciudad: string;
  ofertas: number;
  egresados: number;
}

export interface AdminDashboard {
  kpis: AdminKPIs;
  egresadosPorCarrera: CarreraCount[];
  egresadosPorAno: AnoCount[];
  demandaHabilidades: HabilidadDemanda[];
  ofertasVsEgresadosPorCiudad: CiudadComparativa[];
}

export interface GraduateKPIs {
  totalPostulaciones: number;
  tasaRespuesta: number;
}

export interface OfertaRecomendada {
  id: number;
  titulo: string;
  empresa: string;
  modalidad: string;
  ubicacion: string | null;
  salario_min: number | null;
  salario_max: number | null;
  score: number;
}

export interface GraduateDashboard {
  kpis: GraduateKPIs;
  matchingOfertas: OfertaRecomendada[];
}

export interface CompanyKPIs {
  ofertasPublicadas: number;
  postulacionesRecibidas: number;
  contrataciones: number;
  rendimiento: number;
}

export interface RendimientoOferta {
  ofertaId: number;
  titulo: string;
  postulaciones: number;
  contrataciones: number;
}

export interface CompanyDashboard {
  kpis: CompanyKPIs;
  rendimientoPorOferta: RendimientoOferta[];
}