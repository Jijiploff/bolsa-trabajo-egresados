import { prisma } from '../config/database';
import { TipoNotificacion } from '@prisma/client';
import { emailService } from './emailService';

interface CreateNotificationInput {
  usuario_id: number;
  tipo: TipoNotificacion;
  mensaje: string;
  url?: string;
}

class NotificationService {
  // Crea una notificación y opcionalmente envía un email al usuario
  async create(data: CreateNotificationInput, sendEmail = false) {
    const notificacion = await prisma.notificacion.create({
      data: {
        usuario_id: data.usuario_id,
        tipo: data.tipo,
        mensaje: data.mensaje,
        url: data.url || null,
      },
    });

    if (sendEmail) {
      const user = await prisma.usuario.findUnique({
        where: { id: data.usuario_id },
        select: { email: true },
      });
      if (user) {
        await emailService.sendEmail(
          user.email,
          this.getEmailSubject(data.tipo),
          data.mensaje
        );
      }
    }

    return notificacion;
  }

  // Notificar a todos los egresados (para nueva oferta)
  async notifyAllGraduates(mensaje: string, url?: string) {
    const egresados = await prisma.egresado.findMany({
      select: {
        usuario_id: true,
        usuario: { select: { email: true } },
      },
    });

    const notifications = [];
    for (const egresado of egresados) {
      const notif = await this.create(
        {
          usuario_id: egresado.usuario_id,
          tipo: 'NUEVA_OFERTA',
          mensaje,
          url,
        },
        false // no enviamos email masivo para no saturar; se podría cambiar a true
      );
      notifications.push(notif);
    }
    return notifications;
  }

  // Listar notificaciones de un usuario con paginación
  async findByUser(usuarioId: number, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [notificaciones, total] = await Promise.all([
      prisma.notificacion.findMany({
        where: { usuario_id: usuarioId },
        orderBy: { creada_en: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notificacion.count({ where: { usuario_id: usuarioId } }),
    ]);

    return {
      data: notificaciones,
      pagination: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    };
  }

  // Marcar una notificación como leída (solo si pertenece al usuario)
  async markAsRead(notifId: number, userId: number) {
    const notif = await prisma.notificacion.findUnique({ where: { id: notifId } });
    if (!notif) throw Object.assign(new Error('Notificación no encontrada'), { statusCode: 404 });
    if (notif.usuario_id !== userId) throw Object.assign(new Error('No autorizado'), { statusCode: 403 });

    return prisma.notificacion.update({
      where: { id: notifId },
      data: { leida: true },
    });
  }

  // Marcar todas como leídas para el usuario
  async markAllAsRead(userId: number) {
    await prisma.notificacion.updateMany({
      where: { usuario_id: userId, leida: false },
      data: { leida: true },
    });
    return { message: 'Todas las notificaciones marcadas como leídas' };
  }

  // Contador de notificaciones no leídas
  async countUnread(userId: number) {
    return prisma.notificacion.count({
      where: { usuario_id: userId, leida: false },
    });
  }

  private getEmailSubject(tipo: TipoNotificacion): string {
    switch (tipo) {
      case 'NUEVA_OFERTA': return 'Nueva oferta laboral disponible';
      case 'CAMBIO_ESTADO': return 'Actualización en tu postulación';
      case 'NUEVA_POSTULACION': return 'Nueva postulación recibida';
      default: return 'Notificación de Bolsa de Trabajo';
    }
  }
}

export const notificationService = new NotificationService();