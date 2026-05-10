import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import JobOfferList from '@/components/offers/JobOfferList';

export default function MyOffersPage() {
  const { user } = useAuth();
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/companies/me');   // ✅ Usar endpoint propio
        setCompanyId(res.data.id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (loading) return <div className="text-center py-8">Cargando...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mis Ofertas Laborales</h1>
      {companyId ? (
        <JobOfferList showAdminActions companyId={companyId} />
      ) : (
        <p className="text-muted-foreground">Primero complete el perfil de su empresa para ver sus ofertas.</p>
      )}
    </div>
  );
}