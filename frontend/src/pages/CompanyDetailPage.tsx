import { useParams } from 'react-router-dom';
import CompanyProfile from '@/components/companies/CompanyProfile';

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const companyId = parseInt(id || '0');

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Perfil de la Empresa</h1>
      {companyId ? <CompanyProfile companyId={companyId} /> : <p>ID inválido</p>}
    </div>
  );
}