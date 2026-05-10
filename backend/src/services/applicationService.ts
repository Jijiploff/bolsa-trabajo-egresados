import { prisma } from '../config/database';
import { EstadoPostulacion } from '@prisma/client';
import { getPaginationOptions, getPaginationMeta } from '../utils/pagination';

// Transiciones válidas desde cada estado
const validTransitions: Record<EstadoPostulacion, EstadoPostulacion[]> = {
  POSTULADO: ['REVISION', 'RECHAZADO'],
  REVISION: ['ENTREVISTA', 'RECHAZADO'],
  ENTREVISTA: ['CONTRATADO', 'RECHAZADO'],
  CONTRATADO: [],
  RECHAZADO: [],
};

interface ApplicationQuery {
  page?: number;
  limit?: number;
  estado?: string;
  oferta_id?: number;
  egresado_id?: number;
}

class ApplicationService {
  async findAll(query: any, userContext: { userId: number; rol: string; empresaId?: number; egresadoId?: number }) {
    const { page, limit, estado, oferta_id, egresado_id } = query;
    const pagination = getPaginationOptions({ page, limit });

    const where: any = {};

    if (estado) where.estado = estado;
    if (oferta_id) where.oferta_id = oferta_id;
    if (egresado_id) where.egresado_id = egresado_id;

    // Aplicar restricciones según rol
    if (userContext.rol === 'EGRESADO') {
      // Solo ve sus postulaciones
      where.egresado_id = userContext.egresadoId;
    } else if (userContext.rol === 'EMPRESA') {
      // Solo ve postulaciones a ofertas de su empresa
      if (!userContext.empresaId) {
        throw Object.assign(new Error('Perfil de empresa no encontrado'), { statusCode: 400 });
      }
      where.oferta = { empresa_id: userContext.empresaId };
    }
    // ADMIN ve todo sin restricciones adicionales

    const [postulaciones, total] = await Promise.all([
      prisma.postulacion.findMany({
        where,
        include: {
          egresado: {
            select: {
              id: true,
              nombres: true,
              apellidos: true,
              titulo: true,
              universidad: true,
              cv_url: true,
              usuario: { select: { email: true } },
            },
          },
          oferta: {
            select: {
              id: true,
              titulo: true,
              empresa: { select: { id: true, nombre: true } },
            },
          },
          historial_estados: {
            orderBy: { fecha: 'asc' },
            select: { id: true, estado: true, fecha: true, comentario: true },
          },
        },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        orderBy: { fecha_postulacion: 'desc' },
      }),
      prisma.postulacion.count({ where }),
    ]);

    return {
      data: postulaciones,
      pagination: getPaginationMeta(total, pagination.page, pagination.limit),
    };
  }

  async findById(id: number, userContext: { userId: number; rol: string; empresaId?: number; egresadoId?: number }) {
    const postulacion = await prisma.postulacion.findUnique({
      where: { id },
      include: {
        egresado: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            titulo: true,
            universidad: true,
            cv_url: true,
            usuario: { select: { email: true } },
          },
        },
        oferta: {
          select: {
            id: true,
            titulo: true,
            empresa: { select: { id: true, nombre: true } },
          },
        },
        historial_estados: {
          orderBy: { fecha: 'asc' },
          select: { id: true, estado: true, fecha: true, comentario: true },
        },
      },
    });

    if (!postulacion) {
      throw Object.assign(new Error('Postulación no encontrada'), { statusCode: 404 });
    }

    // Validar acceso
    if (userContext.rol === 'EGRESADO' && postulacion.egresado_id !== userContext.egresadoId) {
      throw Object.assign(new Error('No autorizado'), { statusCode: 403 });
    }
    if (userContext.rol === 'EMPRESA' && postulacion.oferta.empresa.id !== userContext.empresaId) {
      throw Object.assign(new Error('No autorizado'), { statusCode: 403 });
    }

    return postulacion;
  }

  async apply(egresadoId: number, ofertaId: number) {
    // Verificar que el egresado exista
    const egresado = await prisma.egresado.findUnique({ where: { id: egresadoId } });
    if (!egresado) {
      throw Object.assign(new Error('Perfil de egresado no encontrado'), { statusCode: 404 });
    }

    // Verificar que la oferta exista y esté activa
    const oferta = await prisma.ofertaLaboral.findUnique({ where: { id: ofertaId } });
    if (!oferta || !oferta.activa) {
      throw Object.assign(new Error('Oferta no disponible'), { statusCode: 400 });
    }

    // Verificar que no exista una postulación previa del mismo egresado a la misma oferta
    const existente = await prisma.postulacion.findFirst({
      where: { egresado_id: egresadoId, oferta_id: ofertaId },
    });
    if (existente) {
      throw Object.assign(new Error('Ya has postulado a esta oferta'), { statusCode: 409 });
    }

    // Crear la postulación con estado inicial POSTULADO y un registro en el historial
    const nuevaPostulacion = await prisma.postulacion.create({
      data: {
        egresado_id: egresadoId,
        oferta_id: ofertaId,
        estado: 'POSTULADO',
        historial_estados: {
          create: {
            estado: 'POSTULADO',
            fecha: new Date(),
          },
        },
      },
      include: {
        egresado: { select: { id: true, nombres: true, apellidos: true } },
        oferta: { select: { id: true, titulo: true } },
        historial_estados: { orderBy: { fecha: 'asc' }, select: { estado: true, fecha: true } },
      },
    });

    return nuevaPostulacion;
  }

  async changeStatus(applicationId: number, nuevoEstado: EstadoPostulacion, comentario?: string | null, userEmpresaId?: number) {
    const postulacion = await prisma.postulacion.findUnique({
      where: { id: applicationId },
      include: { oferta: { include: { empresa: true } } },
    });

    if (!postulacion) {
      throw Object.assign(new Error('Postulación no encontrada'), { statusCode: 404 });
    }

    // Verificar que la empresa que cambia el estado sea la dueña de la oferta o un admin
    if (userEmpresaId && postulacion.oferta.empresa_id !== userEmpresaId) {
      throw Object.assign(new Error('No autorizado para modificar esta postulación'), { statusCode: 403 });
    }

    const estadoActual = postulacion.estado;

    // Validar transición
    if (!validTransitions[estadoActual]?.includes(nuevoEstado)) {
      throw Object.assign(
        new Error(`No se puede cambiar de estado "${estadoActual}" a "${nuevoEstado}"`),
        { statusCode: 400 }
      );
    }

    // Actualizar estado y agregar historial
    const updated = await prisma.postulacion.update({
      where: { id: applicationId },
      data: {
        estado: nuevoEstado,
        historial_estados: {
          create: {
            estado: nuevoEstado,
            fecha: new Date(),
            comentario: comentario || null,
          },
        },
      },
      include: {
        historial_estados: { orderBy: { fecha: 'asc' }, select: { estado: true, fecha: true, comentario: true } },
        egresado: { select: { id: true, nombres: true, apellidos: true } },
        oferta: { select: { id: true, titulo: true } },
      },
    });

    return updated;
  }
}

export const applicationService = new ApplicationService();