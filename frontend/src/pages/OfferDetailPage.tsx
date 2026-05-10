import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/lib/api';
import { OfertaLaboral } from '@/types';
import JobOfferDetail from '@/components/offers/JobOfferDetail';
import { useAuth } from '@/hooks/useAuth';

export default function OfferDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [offer, setOffer] = useState<OfertaLaboral | null>(null);
  const [loading, setLoading] = useState(true);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const { user } = useAuth();

  const fetchOffer = async () => {
    try {
      const res = await api.get(`/job-offers/${id}`);
      setOffer(res.data);
      // Si es egresado, verificar si ya postuló
      if (user?.rol === 'EGRESADO') {
        checkIfApplied();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkIfApplied = async () => {
    try {
      const res = await api.get('/applications');
      const apps = res.data.data;
      setAlreadyApplied(apps.some((app: any) => app.oferta_id === Number(id)));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (id) fetchOffer();
  }, [id]);

  if (loading) return <div className="text-center py-8">Cargando oferta...</div>;
  if (!offer) return <div className="text-center py-8 text-red-500">Oferta no encontrada</div>;

  return (
    <div>
      <JobOfferDetail
        offer={offer}
        onStatusToggle={fetchOffer}
        alreadyApplied={alreadyApplied}
      />
    </div>
  );
}