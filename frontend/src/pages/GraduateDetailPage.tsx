import { useParams } from 'react-router-dom';
import GraduateProfile from '@/components/graduates/GraduateProfile';

export default function GraduateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const graduateId = parseInt(id || '0');

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Detalle del Egresado</h1>
      {graduateId ? <GraduateProfile graduateId={graduateId} /> : <p>ID inválido</p>}
    </div>
  );
}