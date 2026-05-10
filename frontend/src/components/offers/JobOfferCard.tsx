import { OfertaLaboral } from '@/types';
import { MapPin, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Props {
  offer: OfertaLaboral;
  showApply?: boolean;
  alreadyApplied?: boolean;
  onApply?: () => void;
  onToggleActive?: () => void;
  showActions?: boolean;
  onEdit?: () => void;
}

export default function JobOfferCard({ offer, showApply, alreadyApplied, onApply, onToggleActive, showActions, onEdit }: Props) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{offer.titulo}</h3>
          <p className="text-sm text-muted-foreground">{offer.empresa?.nombre}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          offer.activa ? 'bg-primary/10 text-primary' : 'bg-gray-200 text-gray-700'
        }`}>
          {offer.activa ? 'Activa' : 'Inactiva'}
        </span>
      </div>
      <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-1"><MapPin size={14} /> {offer.ubicacion || 'No especificada'}</span>
        <span className="flex items-center gap-1"><DollarSign size={14} />
          {offer.salario_min && offer.salario_max
            ? `$${offer.salario_min} - $${offer.salario_max}`
            : offer.salario_min ? `Desde $${offer.salario_min}`
            : offer.salario_max ? `Hasta $${offer.salario_max}`
            : 'No especificado'}
        </span>
        <span>{offer.modalidad}</span>
      </div>
      <p className="mt-2 line-clamp-2">{offer.descripcion}</p>
      <div className="mt-3 flex gap-2">
        {showApply && (
          <Button size="sm" onClick={onApply} disabled={!offer.activa || alreadyApplied}>
            {alreadyApplied ? 'Ya postulado' : 'Postular'}
          </Button>
        )}
        {showActions && (
          <>
            <Button size="sm" variant="outline" onClick={() => navigate(`/offers/${offer.id}/edit`)}>
              Editar
            </Button>
            <Button size="sm" variant={onToggleActive ? 'secondary' : 'outline'} onClick={onToggleActive}>
              {offer.activa ? 'Desactivar' : 'Activar'}
            </Button>
          </>
        )}
        <Button size="sm" variant="outline" onClick={() => navigate(`/offers/${offer.id}`)}>
          Ver detalle
        </Button>
      </div>
    </div>
  );
}