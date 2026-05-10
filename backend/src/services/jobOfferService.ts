import { prisma } from '../config/database';
import { Prisma } from '@prisma/client';
import { getPaginationOptions, getPaginationMeta } from '../utils/pagination';

interface CreateJobOfferInput {
  empresa_id: number;
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

interface UpdateJobOfferInput extends Partial<CreateJobOfferInput> {
  activa?: boolean;
}

class JobOfferService {
  async findAll(query: any, userEmpresaId?: number) {
    const { page, limit, titulo, modalidad, ubicacion, salario_min, salario_max, activa } = query;
    const pagination = getPaginationOptions({ page, limit });

    const where: Prisma.OfertaLaboralWhereInput = {};

    // Si el usuario es empresa, solo ve sus propias ofertas
    if (userEmpresaId) {
      where.empresa_id = userEmpresaId;
    }

    if (titulo) where.titulo = { contains: titulo, mode: 'insensitive' };
    if (modalidad) where.modalidad = modalidad;
    if (ubicacion) where.ubicacion = { contains: ubicacion, mode: 'insensitive' };
    if (activa !== undefined) where.activa = activa;
    if (salario_min !== undefined) where.salario_min = { gte: salario_min };
    if (salario_max !== undefined) where.salario_max = { lte: salario_max };

    // Rango combinado: si ambos vienen, filtra ofertas que se solapen
    if (salario_min !== undefined && salario_max !== undefined) {
      where.OR = [
        { salario_min: { gte: salario_min, lte: salario_max } },
        { salario_max: { gte: salario_min, lte: salario_max } },
        { salario_min: { lte: salario_min }, salario_max: { gte: salario_max } },
      ];
    }

    const [ofertas, total] = await Promise.all([
      prisma.ofertaLaboral.findMany({
        where,
        include: {
          empresa: { select: { id: true, nombre: true, logo_url: true, ubicacion: true, sector: true } },
          habilidades: {
            include: { habilidad: { select: { id: true, nombre: true, tipo: true } } },
          },
          _count: { select: { postulaciones: true } },
        },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        orderBy: { fecha_publicacion: 'desc' },
      }),
      prisma.ofertaLaboral.count({ where }),
    ]);

    return {
      data: ofertas,
      pagination: getPaginationMeta(total, pagination.page, pagination.limit),
    };
  }

  async findById(id: number) {
    const oferta = await prisma.ofertaLaboral.findUnique({
      where: { id },
      include: {
        empresa: { select: { id: true, nombre: true, logo_url: true, ubicacion: true, sector: true, descripcion: true, sitio_web: true } },
        habilidades: {
          include: { habilidad: { select: { id: true, nombre: true, tipo: true } } },
        },
        _count: { select: { postulaciones: true } },
      },
    });
    if (!oferta) {
      const error = new Error('Oferta laboral no encontrada');
      (error as any).statusCode = 404;
      throw error;
    }
    return oferta;
  }

  async create(data: CreateJobOfferInput) {
    // Verificar que la empresa exista
    const empresa = await prisma.empresa.findUnique({ where: { id: data.empresa_id } });
    if (!empresa) {
      const error = new Error('Empresa no encontrada');
      (error as any).statusCode = 404;
      throw error;
    }

    return prisma.ofertaLaboral.create({
      data: {
        empresa_id: data.empresa_id,
        titulo: data.titulo,
        descripcion: data.descripcion,
        salario_min: data.salario_min ?? null,
        salario_max: data.salario_max ?? null,
        modalidad: data.modalidad,
        ubicacion: data.ubicacion ?? null,
        requisitos: data.requisitos ?? null,
        fecha_cierre: data.fecha_cierre ? new Date(data.fecha_cierre) : null,
        habilidades: {
          create: data.habilidades?.map((h) => ({
            habilidad_id: h.habilidad_id,
          })) || [],
        },
      },
      include: {
        empresa: { select: { id: true, nombre: true } },
        habilidades: {
          include: { habilidad: true },
        },
      },
    });
  }

  async update(id: number, data: UpdateJobOfferInput) {
    await this.findById(id);

    const updateData: any = { ...data };
    if (data.fecha_cierre !== undefined) {
      updateData.fecha_cierre = data.fecha_cierre ? new Date(data.fecha_cierre) : null;
    }

    // Si se envía el array de habilidades, reemplazar
    if (data.habilidades !== undefined) {
      await prisma.ofertaHabilidad.deleteMany({ where: { oferta_id: id } });
      if (data.habilidades.length > 0) {
        await prisma.ofertaHabilidad.createMany({
          data: data.habilidades.map((h) => ({
            oferta_id: id,
            habilidad_id: h.habilidad_id,
          })),
        });
      }
      delete updateData.habilidades;
    }

    return prisma.ofertaLaboral.update({
      where: { id },
      data: updateData,
      include: {
        empresa: { select: { id: true, nombre: true } },
        habilidades: {
          include: { habilidad: true },
        },
      },
    });
  }

  async delete(id: number) {
    await this.findById(id);
    await prisma.ofertaLaboral.delete({ where: { id } });
    return { message: 'Oferta laboral eliminada correctamente' };
  }

  async toggleActive(id: number, activa: boolean) {
    await this.findById(id);
    return prisma.ofertaLaboral.update({
      where: { id },
      data: { activa },
    });
  }
}

export const jobOfferService = new JobOfferService();