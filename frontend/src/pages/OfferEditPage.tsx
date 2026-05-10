import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { OfertaLaboral } from '@/types';
import JobOfferForm from '@/components/offers/JobOfferForm';
import { JobOfferFormData } from '@/validations/jobOfferValidations';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function OfferEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [offer, setOffer] = useState<OfertaLaboral | null>(null);
  const [loading, setLoading] = useState(false);
  const [habilidades, setHabilidades] = useState<any[]>([]);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const res = await api.get(`/job-offers/${id}`);
        setOffer(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Error al cargar la oferta');
        navigate('/');
      }
    };
    const fetchHabilidades = async () => {
      try {
        const res = await api.get('/habilidades');
        setHabilidades(res.data);
      } catch {}
    };
    fetchOffer();
    fetchHabilidades();
  }, [id]);

  const toISODate = (value?: string | null) =>
    value ? new Date(value).toISOString() : null;

  const handleSubmit = async (data: JobOfferFormData) => {
    setLoading(true);

    try {
      const payload = {
        ...data,
        fecha_cierre: toISODate(data.fecha_cierre),
      };

      await api.put(`/job-offers/${id}`, payload);

      toast.success('Oferta actualizada');
      navigate(`/offers/${id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al actualizar');
    } finally {
      setLoading(false);
    }
  };

  if (!offer) return <div className="text-center py-8">Cargando formulario...</div>;

  // Adaptar los datos existentes al formato del formulario
  const defaultValues = {
    titulo: offer.titulo,
    descripcion: offer.descripcion,
    salario_min: offer.salario_min,
    salario_max: offer.salario_max,
    modalidad: offer.modalidad,
    ubicacion: offer.ubicacion || '',
    requisitos: offer.requisitos || '',
    fecha_cierre: offer.fecha_cierre?.split('T')[0] || '',
    habilidades: offer.habilidades?.map((oh) => ({ habilidad_id: oh.habilidad_id })) || [],
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => navigate(`/offers/${id}`)}>← Volver al detalle</Button>
        <h1 className="text-2xl font-bold">Editar oferta</h1>
      </div>
      <JobOfferForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        loading={loading}
        habilidadesDisponibles={habilidades}
      />
    </div>
  );
}