import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Postulacion } from '@/types';
import StatusBadge from './StatusBadge';
import StatusHistory from './StatusHistory';
import { Button } from '@/components/ui/button';
import Pagination from '@/components/pagination/Pagination';
import { toast } from 'sonner';
import { VALID_TRANSITIONS } from '@/lib/constants';

interface Props {
  type: 'graduate' | 'company'; // determina qué acciones mostrar y qué endpoint usar
}

export default function ApplicationList({ type }: Props) {
  const [applications, setApplications] = useState<Postulacion[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [showHistoryId, setShowHistoryId] = useState<number | null>(null);
  const [changingStatusId, setChangingStatusId] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const [comment, setComment] = useState('');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10' });
      if (selectedStatus) params.append('estado', selectedStatus);
      const endpoint = type === 'graduate' ? '/applications' : '/applications'; // mismo endpoint, el backend filtra por rol automáticamente
      const res = await api.get(`${endpoint}?${params}`);
      setApplications(res.data.data);
      setTotalPages(res.data.pagination.lastPage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page, selectedStatus]);

  const handleChangeStatus = (applicationId: number) => {
    const app = applications.find((a) => a.id === applicationId);
    if (!app) return;
    const validNext = VALID_TRANSITIONS[app.estado] || [];
    if (validNext.length === 0) {
      toast.info('No hay transiciones disponibles para este estado');
      return;
    }
    // Abrir modal inline para seleccionar estado y comentario opcional
    setChangingStatusId(applicationId);
    setNewStatus(validNext[0]);
    setComment('');
  };

  const confirmChangeStatus = async () => {
    if (!changingStatusId || !newStatus) return;
    try {
      await api.put(`/applications/${changingStatusId}/status`, {
        estado: newStatus,
        comentario: comment || null,
      });
      toast.success('Estado actualizado');
      setChangingStatusId(null);
      fetchApplications();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al cambiar estado');
    }
  };

  return (
    <div>
      {/* Filtro por estado */}
      <div className="mb-4 flex gap-2 items-center">
        <select
          value={selectedStatus}
          onChange={(e) => { setSelectedStatus(e.target.value); setPage(1); }}
          className="border rounded-md px-3 py-2"
        >
          <option value="">Todos los estados</option>
          <option value="POSTULADO">Postulado</option>
          <option value="REVISION">Revisión</option>
          <option value="ENTREVISTA">Entrevista</option>
          <option value="CONTRATADO">Contratado</option>
          <option value="RECHAZADO">Rechazado</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto bg-white rounded-md shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {type === 'company' && <th className="px-4 py-3 text-left">Egresado</th>}
              <th className="px-4 py-3 text-left">Oferta</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Fecha postulación</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={type === 'company' ? 5 : 4} className="text-center py-4">Cargando...</td></tr>
            ) : applications.length === 0 ? (
              <tr><td colSpan={type === 'company' ? 5 : 4} className="text-center py-4">No se encontraron postulaciones</td></tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id} className="border-t">
                  {type === 'company' && (
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{app.egresado?.nombres} {app.egresado?.apellidos}</p>
                        <p className="text-xs text-muted-foreground">{app.egresado?.usuario?.email}</p>
                        {app.egresado?.cv_url && (
                          <a href={app.egresado.cv_url} target="_blank" rel="noreferrer" className="text-primary text-xs hover:underline">Ver CV</a>
                        )}
                      </div>
                    </td>
                  )}
                  <td className="px-4 py-3">{app.oferta?.titulo}</td>
                  <td className="px-4 py-3"><StatusBadge estado={app.estado} /></td>
                  <td className="px-4 py-3">{new Date(app.fecha_postulacion).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setShowHistoryId(app.id)}>Historial</Button>
                    {type === 'company' && VALID_TRANSITIONS[app.estado]?.length > 0 && (
                      <Button size="sm" onClick={() => handleChangeStatus(app.id)}>Cambiar estado</Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Modal de historial */}
      {showHistoryId && (
        <StatusHistory
          historial={applications.find((a) => a.id === showHistoryId)?.historial_estados || []}
          onClose={() => setShowHistoryId(null)}
        />
      )}

      {/* Modal rápido de cambio de estado */}
      {changingStatusId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Cambiar estado</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Nuevo estado</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              >
                {VALID_TRANSITIONS[applications.find((a) => a.id === changingStatusId)?.estado || '']?.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Comentario (opcional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                className="w-full border rounded-md px-3 py-2"
                placeholder="Motivo del cambio..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setChangingStatusId(null)}>Cancelar</Button>
              <Button onClick={confirmChangeStatus}>Confirmar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}