import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { OfertaLaboral, Postulacion } from '@/types';
import JobOfferCard from './JobOfferCard';
import OfferFilters, { Filters } from './OfferFilters'; // Asegurar que OfferFilters exporte Filters
import Pagination from '@/components/pagination/Pagination';
import { toast } from 'sonner';

interface Props {
  showAdminActions?: boolean;
  showApply?: boolean;
  companyId?: number;
}

export default function JobOfferList({ showAdminActions, showApply, companyId }: Props) {
  const [offers, setOffers] = useState<OfertaLaboral[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    titulo: '',
    modalidad: '',
    ubicacion: '',
    salario_min: '',
    salario_max: '',
    activa: showAdminActions ? '' : 'true',
  });

  const [appliedOfferIds, setAppliedOfferIds] = useState<number[]>([]);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', '10');

      // Solo agregar filtros si tienen valor
      if (filters.titulo) params.append('titulo', filters.titulo);
      if (filters.modalidad) params.append('modalidad', filters.modalidad);
      if (filters.ubicacion) params.append('ubicacion', filters.ubicacion);
      if (filters.salario_min) params.append('salario_min', filters.salario_min);
      if (filters.salario_max) params.append('salario_max', filters.salario_max);
      if (filters.activa) params.append('activa', filters.activa);

      if (companyId) params.append('empresa_id', String(companyId));

      const res = await api.get(`/job-offers?${params}`);
      setOffers(res.data.data);
      setTotalPages(res.data.pagination.lastPage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showApply) fetchMyApplications();
  }, [showApply]);

  const fetchMyApplications = async () => {
    try {
      const res = await api.get('/applications');
      const apps: Postulacion[] = res.data.data;
      setAppliedOfferIds(apps.map((app) => app.oferta_id));
    } catch (err) {
      console.error('Error fetching applications', err);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [page, filters, companyId]);

  // ✅ Adaptador de tipos: combina nuevos filtros parciales con el estado anterior
  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      activa: newFilters.activa !== undefined ? newFilters.activa : prev.activa,
    }));
  };

  const handleApply = async (ofertaId: number) => {
    try {
      await api.post(`/applications/apply/${ofertaId}`);
      toast.success('Postulación enviada');
      setAppliedOfferIds(prev => [...prev, ofertaId]);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al postular');
    }
  };

  const handleToggleActive = async (ofertaId: number, activa: boolean) => {
    try {
      await api.patch(`/job-offers/${ofertaId}/toggle-active`, { activa: !activa });
      toast.success(`Oferta ${activa ? 'desactivada' : 'activada'}`);
      fetchOffers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al cambiar estado');
    }
  };

  return (
    <div>
      <OfferFilters
        filters={filters}
        onChange={handleFiltersChange}
        onSearch={() => setPage(1)}
        showActiva={showAdminActions}
      />
      {loading ? (
        <div className="text-center py-8">Cargando ofertas...</div>
      ) : offers.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No se encontraron ofertas</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.map((offer) => (
            <JobOfferCard
              key={offer.id}
              offer={offer}
              showApply={showApply}
              alreadyApplied={appliedOfferIds.includes(offer.id)}
              showActions={showAdminActions}
              onApply={() => handleApply(offer.id)}
              onToggleActive={() => handleToggleActive(offer.id, offer.activa)}
              onEdit={() => {/* navegar a edición */}}
            />
          ))}
        </div>
      )}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}