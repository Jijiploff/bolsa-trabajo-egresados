import { cn } from '@/lib/utils';

const statusStyles: Record<string, string> = {
  POSTULADO: 'bg-blue-100 text-blue-800',
  REVISION: 'bg-yellow-100 text-yellow-800',
  ENTREVISTA: 'bg-purple-100 text-purple-800',
  CONTRATADO: 'bg-green-100 text-green-800',
  RECHAZADO: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
  POSTULADO: 'Postulado',
  REVISION: 'Revisión',
  ENTREVISTA: 'Entrevista',
  CONTRATADO: 'Contratado',
  RECHAZADO: 'Rechazado',
};

interface Props {
  estado: string;
}

export default function StatusBadge({ estado }: Props) {
  return (
    <span className={cn('px-2 py-1 rounded-full text-xs font-medium', statusStyles[estado] || 'bg-gray-100 text-gray-800')}>
      {statusLabels[estado] || estado}
    </span>
  );
}