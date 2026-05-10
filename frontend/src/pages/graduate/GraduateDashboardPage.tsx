import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { GraduateDashboard } from '@/types';
import KPICard from '@/components/dashboards/KPICard';
import { FileText, ThumbsUp, Briefcase, MapPin, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function GraduateDashboardPage() {
  const [data, setData] = useState<GraduateDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/dashboard/graduate');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="text-center py-8">Cargando dashboard...</div>;
  if (!data) return <div className="text-center py-8 text-red-500">Error al cargar el dashboard</div>;

  const { kpis, matchingOfertas } = data;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mi Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <KPICard
          title="Total Postulaciones"
          value={kpis.totalPostulaciones}
          icon={<FileText size={24} />}
        />
        <KPICard
          title="Tasa de Respuesta"
          value={`${kpis.tasaRespuesta}%`}
          icon={<ThumbsUp size={24} />}
          description="Entrevistas o contratado / total"
        />
      </div>

      {/* Matching de ofertas */}
      <h2 className="text-xl font-semibold mb-4">Ofertas recomendadas para ti</h2>
      {matchingOfertas.length === 0 ? (
        <p className="text-muted-foreground">No hay ofertas que coincidan con tus habilidades. Completa tu perfil para obtener recomendaciones.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matchingOfertas.map((oferta) => (
            <div key={oferta.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{oferta.titulo}</h3>
                <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
                  {oferta.score}% match
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{oferta.empresa}</p>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><MapPin size={12} /> {oferta.ubicacion || 'No especificada'}</span>
                <span className="flex items-center gap-1"><DollarSign size={12} />
                  {oferta.salario_min && oferta.salario_max
                    ? `$${oferta.salario_min} - $${oferta.salario_max}`
                    : oferta.salario_min ? `Desde $${oferta.salario_min}`
                    : oferta.salario_max ? `Hasta $${oferta.salario_max}`
                    : 'No especificado'}
                </span>
                <span>{oferta.modalidad}</span>
              </div>
              <Button size="sm" onClick={() => navigate(`/offers/${oferta.id}`)}>Ver oferta</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}