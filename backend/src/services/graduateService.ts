import { prisma } from '../config/database';
import { Prisma } from '@prisma/client';
import { getPaginationOptions, getPaginationMeta } from '../utils/pagination';

interface CreateGraduateInput {
  usuario_id: number;
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
  formacion_academica?: any[];
  experiencia_laboral?: any[];
  habilidades?: any[];
}

interface UpdateGraduateInput extends Partial<Omit<CreateGraduateInput, 'usuario_id'>> {}

class GraduateService {
  async findAll(query: any) {
    const { page, limit, nombre, carrera_id, habilidad_id, anio_egreso, ciudad } = query;
    const pagination = getPaginationOptions({ page, limit });

    const where: Prisma.EgresadoWhereInput = {};

    if (nombre) {
      where.OR = [
        { nombres: { contains: nombre, mode: 'insensitive' } },
        { apellidos: { contains: nombre, mode: 'insensitive' } },
      ];
    }
    if (carrera_id) where.carrera_id = carrera_id;
    if (anio_egreso) where.anio_egreso = anio_egreso;
    if (ciudad) where.ciudad = { contains: ciudad, mode: 'insensitive' };

    if (habilidad_id) {
      where.habilidades = {
        some: { habilidad_id },
      };
    }

    const [egresados, total] = await Promise.all([
      prisma.egresado.findMany({
        where,
        include: {
          usuario: { select: { id: true, email: true, activo: true } },
          carrera: { select: { id: true, nombre: true } },
          formacion_academica: true,
          experiencia_laboral: true,
          habilidades: {
            include: {
              habilidad: { select: { id: true, nombre: true, tipo: true } },
            },
          },
        },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        orderBy: { apellidos: 'asc' },
      }),
      prisma.egresado.count({ where }),
    ]);

    return {
      data: egresados,
      pagination: getPaginationMeta(total, pagination.page, pagination.limit),
    };
  }

  async findById(id: number) {
    const egresado = await prisma.egresado.findUnique({
      where: { id },
      include: {
        usuario: { select: { id: true, email: true, activo: true } },
        carrera: { select: { id: true, nombre: true } },
        formacion_academica: true,
        experiencia_laboral: true,
        habilidades: {
          include: {
            habilidad: { select: { id: true, nombre: true, tipo: true } },
          },
        },
      },
    });

    if (!egresado) {
      const error = new Error('Egresado no encontrado');
      (error as any).statusCode = 404;
      throw error;
    }
    return egresado;
  }

  async create(data: CreateGraduateInput) {
    const user = await prisma.usuario.findUnique({
      where: { id: data.usuario_id },
      include: { rol: true },
    });

    if (!user || !user.activo || user.rol.nombre !== 'EGRESADO') {
      const error = new Error('Usuario no válido o no es egresado');
      (error as any).statusCode = 400;
      throw error;
    }

    const existing = await prisma.egresado.findUnique({ where: { usuario_id: data.usuario_id } });
    if (existing) {
      const error = new Error('El usuario ya tiene un perfil de egresado');
      (error as any).statusCode = 409;
      throw error;
    }

    return prisma.egresado.create({
      data: {
        usuario_id: data.usuario_id,
        nombres: data.nombres,
        apellidos: data.apellidos,
        fecha_nacimiento: data.fecha_nacimiento ? new Date(data.fecha_nacimiento) : null,
        ciudad: data.ciudad,
        pais: data.pais,
        telefono: data.telefono,
        direccion: data.direccion,
        foto_url: data.foto_url,
        cv_url: data.cv_url,
        linkedin_url: data.linkedin_url,
        github_url: data.github_url,
        titulo: data.titulo,
        universidad: data.universidad,
        carrera_id: data.carrera_id,
        anio_egreso: data.anio_egreso,
        descripcion_personal: data.descripcion_personal,
        formacion_academica: {
          create: data.formacion_academica?.map((f) => ({
            institucion: f.institucion,
            titulo: f.titulo,
            nivel: f.nivel,
            anio_inicio: f.anio_inicio,
            anio_fin: f.anio_fin,
            descripcion: f.descripcion,
          })) || [],
        },
        experiencia_laboral: {
          create: data.experiencia_laboral?.map((e) => ({
            empresa: e.empresa,
            cargo: e.cargo,
            fecha_inicio: new Date(e.fecha_inicio),
            fecha_fin: e.fecha_fin ? new Date(e.fecha_fin) : null,
            descripcion: e.descripcion,
            actual_trabajo: e.actual_trabajo || false,
          })) || [],
        },
        habilidades: {
          create: data.habilidades?.map((h) => ({
            habilidad_id: h.habilidad_id,
            nivel: h.nivel || null,
          })) || [],
        },
      },
      include: {
        usuario: { select: { id: true, email: true } },
        carrera: true,
        formacion_academica: true,
        experiencia_laboral: true,
        habilidades: { include: { habilidad: true } },
      },
    });
  }

  async update(id: number, data: UpdateGraduateInput) {
    await this.findById(id);

    const updateData: any = {};
    if (data.nombres !== undefined) updateData.nombres = data.nombres;
    if (data.apellidos !== undefined) updateData.apellidos = data.apellidos;
    if (data.fecha_nacimiento !== undefined) updateData.fecha_nacimiento = data.fecha_nacimiento ? new Date(data.fecha_nacimiento) : null;
    if (data.ciudad !== undefined) updateData.ciudad = data.ciudad;
    if (data.pais !== undefined) updateData.pais = data.pais;
    if (data.telefono !== undefined) updateData.telefono = data.telefono;
    if (data.direccion !== undefined) updateData.direccion = data.direccion;
    if (data.foto_url !== undefined) updateData.foto_url = data.foto_url;
    if (data.cv_url !== undefined) updateData.cv_url = data.cv_url;
    if (data.linkedin_url !== undefined) updateData.linkedin_url = data.linkedin_url;
    if (data.github_url !== undefined) updateData.github_url = data.github_url;
    if (data.titulo !== undefined) updateData.titulo = data.titulo;
    if (data.universidad !== undefined) updateData.universidad = data.universidad;
    if (data.carrera_id !== undefined) updateData.carrera_id = data.carrera_id;
    if (data.anio_egreso !== undefined) updateData.anio_egreso = data.anio_egreso;
    if (data.descripcion_personal !== undefined) updateData.descripcion_personal = data.descripcion_personal;

    await prisma.egresado.update({ where: { id }, data: updateData });

    if (data.formacion_academica !== undefined) {
      await prisma.formacionAcademica.deleteMany({ where: { egresado_id: id } });
      if (data.formacion_academica.length > 0) {
        await prisma.formacionAcademica.createMany({
          data: data.formacion_academica.map((f) => ({
            egresado_id: id,
            institucion: f.institucion,
            titulo: f.titulo,
            nivel: f.nivel,
            anio_inicio: f.anio_inicio,
            anio_fin: f.anio_fin,
            descripcion: f.descripcion,
          })),
        });
      }
    }

    if (data.experiencia_laboral !== undefined) {
      await prisma.experienciaLaboral.deleteMany({ where: { egresado_id: id } });
      if (data.experiencia_laboral.length > 0) {
        await prisma.experienciaLaboral.createMany({
          data: data.experiencia_laboral.map((e) => ({
            egresado_id: id,
            empresa: e.empresa,
            cargo: e.cargo,
            fecha_inicio: new Date(e.fecha_inicio),
            fecha_fin: e.fecha_fin ? new Date(e.fecha_fin) : null,
            descripcion: e.descripcion,
            actual_trabajo: e.actual_trabajo || false,
          })),
        });
      }
    }

    if (data.habilidades !== undefined) {
      await prisma.egresadoHabilidad.deleteMany({ where: { egresado_id: id } });
      if (data.habilidades.length > 0) {
        await prisma.egresadoHabilidad.createMany({
          data: data.habilidades.map((h) => ({
            egresado_id: id,
            habilidad_id: h.habilidad_id,
            nivel: h.nivel || null,
          })),
        });
      }
    }

    return this.findById(id);
  }

  async delete(id: number) {
    await this.findById(id);
    await prisma.egresado.delete({ where: { id } });
    return { message: 'Egresado eliminado correctamente' };
  }
}

export const graduateService = new GraduateService();