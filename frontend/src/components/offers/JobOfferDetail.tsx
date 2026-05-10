import { OfertaLaboral } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge'; // Asume que existe; si no, reemplazar por span
import { MapPin, DollarSign, Calendar, Building2, Link2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import api from '@/lib/api';

interface Props {
  offer: OfertaLaboral;
  onStatusToggle?: () => void; // para refrescar tras toggle
  alreadyApplied?: boolean;
}

export default function JobOfferDetail({ offer, onStatusToggle, alreadyApplied }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleToggleActive = async () => {
    try {
      await api.patch(`/job-offers/${offer.id}/toggle-active`, { activa: !offer.activa });
      toast.success(`Oferta ${offer.activa ? 'desactivada' : 'activada'}`);
      if (onStatusToggle) onStatusToggle();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al cambiar estado');
    }
  };

  const handleApply = async () => {
    try {
      await api.post(`/applications/apply/${offer.id}`);
      toast.success('Postulación enviada');
      if (onStatusToggle) onStatusToggle(); // para actualizar estado de postulación
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al postular');
    }
  };

  const canEdit = user?.rol === 'ADMIN' || user?.rol === 'EMPRESA';
  const canApply = user?.rol === 'EGRESADO';

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold">{offer.titulo}</h1>
          <div className="flex items-center gap-2 mt-1 text-muted-foreground">
            <Building2 size={16} />
            <span>{offer.empresa?.nombre}</span>
          </div>
        </div>
        <Badge variant={offer.activa ? 'default' : 'secondary'}>
          {offer.activa ? 'Activa' : 'Inactiva'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-muted-foreground" />
          <span>{offer.ubicacion || 'No especificada'}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign size={16} className="text-muted-foreground" />
          <span>
            {offer.salario_min && offer.salario_max
              ? `S/ ${offer.salario_min} - S/ ${offer.salario_max}`
              : offer.salario_min
              ? `Desde S/ ${offer.salario_min}`
              : offer.salario_max
              ? `Hasta S/ ${offer.salario_max}`
              : 'No especificado'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-muted-foreground" />
          <span>Publicado: {new Date(offer.fecha_publicacion).toLocaleDateString()}</span>
        </div>
        {offer.fecha_cierre && (
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-muted-foreground" />
            <span>Cierre: {new Date(offer.fecha_cierre).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Descripción</h2>
        <p className="whitespace-pre-wrap text-muted-foreground">{offer.descripcion}</p>
      </div>

      {offer.requisitos && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Requisitos</h2>
          <p className="whitespace-pre-wrap text-muted-foreground">{offer.requisitos}</p>
        </div>
      )}

      {offer.habilidades && offer.habilidades.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Habilidades requeridas</h2>
          <div className="flex flex-wrap gap-2">
            {offer.habilidades.map((oh) => (
              <span key={oh.id} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                {oh.habilidad.nombre}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Botones de acción según rol */}
      <div className="flex gap-3 mt-8">
        {canEdit && (
          <>
            <Button onClick={() => navigate(`/offers/${offer.id}/edit`)}>Editar</Button>
            <Button variant="outline" onClick={handleToggleActive}>
              {offer.activa ? 'Desactivar' : 'Activar'}
            </Button>
          </>
        )}
        {canApply && (
          <Button onClick={handleApply} disabled={!offer.activa || alreadyApplied}>
            {alreadyApplied ? 'Ya postulado' : 'Postular'}
          </Button>
        )}
      </div>
    </div>
  );
}