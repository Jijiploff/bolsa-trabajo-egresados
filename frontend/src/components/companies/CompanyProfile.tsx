import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Empresa } from '@/types';

export default function CompanyProfile({ companyId }: { companyId: number }) {
  const [company, setCompany] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/companies/${companyId}`);
        setCompany(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [companyId]);

  if (loading) return <p>Cargando perfil...</p>;
  if (!company) return <p>Empresa no encontrada</p>;

  return (
    <div className="bg-white p-6 rounded-md shadow">
      <div className="flex gap-4 mb-4">
        {company.logo_url && <img src={company.logo_url} alt="Logo" className="w-16 h-16 rounded object-contain" />}
        <div>
          <h2 className="text-2xl font-bold">{company.nombre}</h2>
          <p className="text-muted-foreground">{company.sector}{company.tamanio ? ` · ${company.tamanio}` : ''}</p>
          <p>{company.ubicacion}</p>
        </div>
      </div>
      <p>{company.descripcion}</p>
      {company.sitio_web && (
        <a href={company.sitio_web} target="_blank" rel="noreferrer" className="text-primary hover:underline block mt-2">
          {company.sitio_web}
        </a>
      )}
    </div>
  );
}