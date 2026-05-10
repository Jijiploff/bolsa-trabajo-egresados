import { prisma } from '../config/database';
import { Prisma } from '@prisma/client';
import { getPaginationOptions, getPaginationMeta } from '../utils/pagination';

interface CreateCompanyInput {
  usuario_id: number;
  nombre: string;
  descripcion?: string | null;
  sector?: string | null;
  tamanio?: string | null;
  ubicacion?: string | null;
  sitio_web?: string | null;
  logo_url?: string | null;
}

interface UpdateCompanyInput extends Partial<Omit<CreateCompanyInput, 'usuario_id'>> {}

class CompanyService {
  async findAll(query: any) {
    const { page, limit, nombre, sector, ubicacion } = query;
    const pagination = getPaginationOptions({ page, limit });

    const where: Prisma.EmpresaWhereInput = {};
    if (nombre) where.nombre = { contains: nombre, mode: 'insensitive' };
    if (sector) where.sector = { contains: sector, mode: 'insensitive' };
    if (ubicacion) where.ubicacion = { contains: ubicacion, mode: 'insensitive' };

    const [empresas, total] = await Promise.all([
      prisma.empresa.findMany({
        where,
        include: {
          usuario: { select: { id: true, email: true, activo: true } },
          _count: { select: { ofertas: true } },
        },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        orderBy: { nombre: 'asc' },
      }),
      prisma.empresa.count({ where }),
    ]);

    return {
      data: empresas,
      pagination: getPaginationMeta(total, pagination.page, pagination.limit),
    };
  }

  async findById(id: number) {
    const empresa = await prisma.empresa.findUnique({
      where: { id },
      include: {
        usuario: { select: { id: true, email: true, activo: true } },
        _count: { select: { ofertas: true } },
      },
    });
    if (!empresa) {
      const error = new Error('Empresa no encontrada');
      (error as any).statusCode = 404;
      throw error;
    }
    return empresa;
  }

  async create(data: CreateCompanyInput) {
    const user = await prisma.usuario.findUnique({
      where: { id: data.usuario_id },
      include: { rol: true },
    });
    if (!user || !user.activo || user.rol.nombre !== 'EMPRESA') {
      const error = new Error('Usuario no válido o no es empresa');
      (error as any).statusCode = 400;
      throw error;
    }
    const existing = await prisma.empresa.findUnique({ where: { usuario_id: data.usuario_id } });
    if (existing) {
      const error = new Error('El usuario ya tiene una empresa asociada');
      (error as any).statusCode = 409;
      throw error;
    }
    return prisma.empresa.create({
      data: {
        usuario_id: data.usuario_id,
        nombre: data.nombre,
        descripcion: data.descripcion,
        sector: data.sector,
        tamanio: data.tamanio,
        ubicacion: data.ubicacion,
        sitio_web: data.sitio_web,
        logo_url: data.logo_url,
      },
      include: {
        usuario: { select: { id: true, email: true } },
      },
    });
  }

  async update(id: number, data: UpdateCompanyInput) {
    await this.findById(id);
    return prisma.empresa.update({
      where: { id },
      data: { ...data },
      include: {
        usuario: { select: { id: true, email: true } },
      },
    });
  }

  async delete(id: number) {
    await this.findById(id);
    await prisma.empresa.delete({ where: { id } });
    return { message: 'Empresa eliminada correctamente' };
  }
}

export const companyService = new CompanyService();