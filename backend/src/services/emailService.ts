import nodemailer from 'nodemailer';

// Configuración simulada: en producción se usarían variables de entorno reales
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: parseInt(process.env.SMTP_PORT || '1025'),
  secure: false,
  ignoreTLS: true,
  // En desarrollo, solo loguea en consola
  ...(process.env.NODE_ENV !== 'production' && {
    send: (mail: any, callback: any) => {
      console.log('📧 Email simulado:');
      console.log('  Para:', mail.to);
      console.log('  Asunto:', mail.subject);
      console.log('  Texto:', mail.text);
      callback(null, { messageId: 'mock-id' });
    },
  }),
});

export const emailService = {
  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@bolsatrabajo.com',
        to,
        subject,
        text,
      });
      console.log(`Email enviado a ${to} con asunto "${subject}"`);
    } catch (error) {
      console.error('Error al enviar email:', error);
      // No propagar el error para no interrumpir la operación principal
    }
  },
};