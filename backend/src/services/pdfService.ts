import ReactPDF from '@react-pdf/renderer';
import { prisma } from '../config/database';

import { EgresadosPorCarreraPDF } from '../templates/EgresadosPorCarrera';
import { OfertasActivasPDF } from '../templates/OfertasActivas';
import { PostulacionesPorOfertaPDF } from '../templates/PostulacionesPorOferta';
import { EmpleabilidadPorCarreraPDF } from '../templates/EmpleabilidadPorCarrera';
import { DemandaHabilidadesPDF } from '../templates/DemandaHabilidades';
import { ComparacionCohortesPDF } from '../templates/ComparacionCohortes';

export const pdfService = {
  async egresadosPorCarrera(ano?: number) {
    const egresados = await prisma.carrera.findMany({
      select: {
        nombre: true,
        egresados: {
          where: ano ? { anio_egreso: ano } : {},
          select: { id: true },
        },
      },
      orderBy: { nombre: 'asc' },
    });

    const datos = egresados.map((c) => ({
      carrera: c.nombre,
      cantidad: c.egresados.length,
    }));

    const doc = EgresadosPorCarreraPDF({ datos, ano });
    return ReactPDF.renderToStream(doc);
  },

  async ofertasActivas(empresaId?: number) {
    const where: any = { activa: true };
    if (empresaId) where.empresa_id = empresaId;

    const ofertas = await prisma.ofertaLaboral.findMany({
      where,
      include: { empresa: { select: { nombre: true } } },
      orderBy: { fecha_publicacion: 'desc' },
    });

    const datos = ofertas.map((o) => ({
      titulo: o.titulo,
      empresa: o.empresa.nombre,
      modalidad: o.modalidad,
      ubicacion: o.ubicacion || '',
      salario_min: o.salario_min,
      salario_max: o.salario_max,
    }));

    const doc = OfertasActivasPDF({ ofertas: datos });
    return ReactPDF.renderToStream(doc);
  },

  async postulacionesPorOferta(ofertaId: number, empresaId?: number) {
    const oferta = await prisma.ofertaLaboral.findUnique({
      where: { id: ofertaId },
      include: { empresa: true },
    });
    if (!oferta || (empresaId && oferta.empresa_id !== empresaId)) {
      throw Object.assign(new Error('Oferta no encontrada o no autorizada'), { statusCode: 404 });
    }

    const postulaciones = await prisma.postulacion.findMany({
      where: { oferta_id: ofertaId },
      include: {
        egresado: { select: { nombres: true, apellidos: true } },
      },
      orderBy: { fecha_postulacion: 'asc' },
    });

    const datos = postulaciones.map((p) => ({
      egresado: `${p.egresado.nombres} ${p.egresado.apellidos}`,
      estado: p.estado,
      fecha: p.fecha_postulacion.toISOString().split('T')[0],
    }));

    const doc = PostulacionesPorOfertaPDF({
      tituloOferta: oferta.titulo,
      empresa: oferta.empresa.nombre,
      postulaciones: datos,
    });
    return ReactPDF.renderToStream(doc);
  },

  async empleabilidadPorCarrera() {
    const carreras = await prisma.carrera.findMany({
      include: {
        egresados: {
          select: {
            id: true,
            postulaciones: { where: { estado: 'CONTRATADO' }, select: { id: true } },
          },
        },
      },
    });

    const datos = carreras.map((c) => {
      const totalEgresados = c.egresados.length;
      const contratados = c.egresados.filter((e) => e.postulaciones.length > 0).length;
      const porcentaje = totalEgresados > 0 ? (contratados / totalEgresados) * 100 : 0;
      return { carrera: c.nombre, totalEgresados, contratados, porcentaje };
    }).sort((a, b) => b.porcentaje - a.porcentaje);

    const doc = EmpleabilidadPorCarreraPDF({ datos });
    return ReactPDF.renderToStream(doc);
  },

  async demandaHabilidades() {
    const habilidades = await prisma.habilidad.findMany({
      select: {
        nombre: true,
        tipo: true,
        _count: { select: { ofertaHabilidades: true } },
      },
      orderBy: { ofertaHabilidades: { _count: 'desc' } },
      take: 20,
    });

    const datos = habilidades.map((h) => ({
      habilidad: h.nombre,
      tipo: h.tipo,
      demanda: h._count.ofertaHabilidades,
    }));

    const doc = DemandaHabilidadesPDF({ datos });
    return ReactPDF.renderToStream(doc);
  },

  async comparacionCohortes(anos: number[]) {
    const cohortes = [];
    for (const ano of anos) {
      const total = await prisma.egresado.count({ where: { anio_egreso: ano } });
      const contratados = await prisma.egresado.count({
        where: {
          anio_egreso: ano,
          postulaciones: { some: { estado: 'CONTRATADO' } },
        },
      });
      const porcentaje = total > 0 ? (contratados / total) * 100 : 0;
      cohortes.push({ ano, totalEgresados: total, contratados, porcentaje });
    }

    const doc = ComparacionCohortesPDF({ cohortes });
    return ReactPDF.renderToStream(doc);
  },
};