import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import JobOfferForm from '@/components/offers/JobOfferForm';
import { JobOfferFormData } from '@/validations/jobOfferValidations';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function CreateOfferPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [habilidades, setHabilidades] = useState<any[]>([]);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [fetchingCompany, setFetchingCompany] = useState(true);

  useEffect(() => {
    fetchHabilidades();
    fetchMyCompany();
  }, []);

  const fetchHabilidades = async () => {
    try {
      const res = await api.get('/habilidades');
      setHabilidades(res.data);
    } catch {}
  };

  const fetchMyCompany = async () => {
    try {
      const res = await api.get('/companies/me');   // ✅ Usar endpoint propio
      setCompanyId(res.data.id);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setCompanyId(null);
      } else {
        toast.error('Error al obtener perfil de empresa');
      }
    } finally {
      setFetchingCompany(false);
    }
  };

  const toISODate = (value?: string | null) =>
    value ? new Date(value).toISOString() : null;

  const handleSubmit = async (data: JobOfferFormData) => {
    if (!companyId) {
      toast.error('No se encontró el perfil de empresa. Complete su perfil primero.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...data,
        empresa_id: companyId,
        fecha_cierre: toISODate(data.fecha_cierre),
      };

      await api.post('/job-offers', payload);

      toast.success('Oferta creada exitosamente');
      navigate('/company/offers');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al crear oferta');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingCompany) {
    return <div className="text-center py-8">Cargando perfil de empresa...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nueva Oferta Laboral</h1>
      {!companyId ? (
        <p className="text-muted-foreground">Debe completar el perfil de empresa antes de crear ofertas.</p>
      ) : (
        <JobOfferForm onSubmit={handleSubmit} loading={loading} habilidadesDisponibles={habilidades} />
      )}
    </div>
  );
}