import { prisma } from '../config/database';
import { Prisma } from '@prisma/client';

class DashboardService {
  // ===================== ADMIN =====================
  async getAdminKPIs() {
    const [totalEgresados, totalEmpresas, totalOfertasActivas, tasaEmpleabilidad] = await Promise.all([
      prisma.egresado.count(),
      prisma.empresa.count(),
      prisma.ofertaLaboral.count({ where: { activa: true } }),
      this.getTasaEmpleabilidad(),
    ]);

    return {
      totalEgresados,
      totalEmpresas,
      totalOfertasActivas,
      tasaEmpleabilidad,
    };
  }

  async getEgresadosPorCarrera() {
    return prisma.carrera.findMany({
      select: {
        nombre: true,
        _count: { select: { egresados: true } },
      },
      orderBy: { egresados: { _count: 'desc' } },
    });
  }

  async getEgresadosPorAno() {
    const result = await prisma.egresado.groupBy({
      by: ['anio_egreso'],
      _count: { id: true },
      orderBy: { anio_egreso: 'asc' },
      where: { anio_egreso: { not: null } },
    });
    return result.map((r) => ({ ano: r.anio_egreso, cantidad: r._count.id }));
  }

  async getDemandaHabilidades() {
    const habilidades = await prisma.habilidad.findMany({
      select: {
        nombre: true,
        tipo: true,
        _count: { select: { ofertaHabilidades: true } },
      },
      orderBy: { ofertaHabilidades: { _count: 'desc' } },
      take: 15,
    });
    return habilidades.map((h) => ({
      habilidad: h.nombre,
      tipo: h.tipo,
      demanda: h._count.ofertaHabilidades,
    }));
  }

  async getOfertasVsEgresadosPorCiudad() {
    const ciudades = await prisma.$queryRaw<{ ciudad: string; ofertas: number; egresados: number }[]>`
      SELECT
        COALESCE(o.ubicacion, e.ciudad) as ciudad,
        COUNT(DISTINCT o.id)::int as ofertas,
        COUNT(DISTINCT e.id)::int as egresados
      FROM (
        SELECT ubicacion, id FROM ofertas_laborales WHERE activa = true
      ) o
      FULL OUTER JOIN (
        SELECT ciudad, id FROM egresados
      ) e ON LOWER(o.ubicacion) = LOWER(e.ciudad)
      GROUP BY 1
      ORDER BY ofertas DESC, egresados DESC
      LIMIT 10
    `;
    return ciudades;
  }

  // ===================== EGRESADO =====================
  async getGraduateKPIs(egresadoId: number) {
    const [totalPostulaciones, tasaRespuesta] = await Promise.all([
      prisma.postulacion.count({ where: { egresado_id: egresadoId } }),
      this.getTasaRespuestaEgresado(egresadoId),
    ]);

    return {
      totalPostulaciones,
      tasaRespuesta,
    };
  }

  async getMatchingOfertas(egresadoId: number, limit = 5) {
    // Obtener habilidades del egresado
    const habilidadesEgresado = await prisma.egresadoHabilidad.findMany({
      where: { egresado_id: egresadoId },
      select: { habilidad_id: true },
    });
    const idsHabilidades = habilidadesEgresado.map((h) => h.habilidad_id);

    if (idsHabilidades.length === 0) {
      return [];
    }

    // Obtener todas las ofertas activas con sus habilidades
    const ofertas = await prisma.ofertaLaboral.findMany({
      where: { activa: true },
      include: {
        empresa: { select: { nombre: true } },
        habilidades: { select: { habilidad_id: true } },
      },
    });

    // Calcular score de matching (% de habilidades del egresado cubiertas por la oferta)
    const matched = ofertas.map((oferta) => {
      const habilidadesOferta = oferta.habilidades.map((h) => h.habilidad_id);
      const interseccion = idsHabilidades.filter((id) => habilidadesOferta.includes(id));
      const score = idsHabilidades.length > 0 ? (interseccion.length / idsHabilidades.length) * 100 : 0;
      return {
        id: oferta.id,
        titulo: oferta.titulo,
        empresa: oferta.empresa.nombre,
        modalidad: oferta.modalidad,
        ubicacion: oferta.ubicacion,
        salario_min: oferta.salario_min,
        salario_max: oferta.salario_max,
        score: Math.round(score * 100) / 100,
      };
    });

    return matched
      .filter((o) => o.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  // ===================== EMPRESA =====================
  async getCompanyKPIs(empresaId: number) {
    const ofertas = await prisma.ofertaLaboral.findMany({
      where: { empresa_id: empresaId },
      select: { id: true },
    });
    const ofertasIds = ofertas.map((o) => o.id);

    const [ofertasPublicadas, postulacionesRecibidas, contrataciones] = await Promise.all([
      prisma.ofertaLaboral.count({ where: { empresa_id: empresaId } }),
      prisma.postulacion.count({ where: { oferta_id: { in: ofertasIds } } }),
      prisma.postulacion.count({ where: { oferta_id: { in: ofertasIds }, estado: 'CONTRATADO' } }),
    ]);

    const rendimiento = postulacionesRecibidas > 0 ? (contrataciones / postulacionesRecibidas) * 100 : 0;

    return {
      ofertasPublicadas,
      postulacionesRecibidas,
      contrataciones,
      rendimiento: Math.round(rendimiento * 100) / 100,
    };
  }

  async getRendimientoPorOferta(empresaId: number) {
    const ofertas = await prisma.ofertaLaboral.findMany({
      where: { empresa_id: empresaId },
      select: {
        id: true,
        titulo: true,
        _count: { select: { postulaciones: true } },
        postulaciones: { where: { estado: 'CONTRATADO' }, select: { id: true } },
      },
      orderBy: { fecha_publicacion: 'desc' },
      take: 10,
    });

    return ofertas.map((o) => ({
      ofertaId: o.id,
      titulo: o.titulo,
      postulaciones: o._count.postulaciones,
      contrataciones: o.postulaciones.length,
    }));
  }

  // ===================== UTILIDADES =====================
  private async getTasaEmpleabilidad(): Promise<number> {
    const totalEgresados = await prisma.egresado.count();
    if (totalEgresados === 0) return 0;

    const contratados = await prisma.postulacion.count({
      where: { estado: 'CONTRATADO' },
    });

    // Se considera tasa de empleabilidad como contrataciones / total de egresados (puede ser >100 si hay múltiples contrataciones)
    return Math.round((contratados / totalEgresados) * 100 * 100) / 100;
  }

  private async getTasaRespuestaEgresado(egresadoId: number): Promise<number> {
    const total = await prisma.postulacion.count({ where: { egresado_id: egresadoId } });
    if (total === 0) return 0;

    const conRespuesta = await prisma.postulacion.count({
      where: {
        egresado_id: egresadoId,
        estado: { in: ['ENTREVISTA', 'CONTRATADO'] },
      },
    });

    return Math.round((conRespuesta / total) * 100 * 100) / 100;
  }
}

export const dashboardService = new DashboardService();