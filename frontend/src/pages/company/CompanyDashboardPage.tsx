import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { CompanyDashboard } from '@/types';
import KPICard from '@/components/dashboards/KPICard';
import CompanyPerformanceChart from '@/components/dashboards/charts/CompanyPerformanceChart';
import { Briefcase, FileText, UserCheck, TrendingUp } from 'lucide-react';

export default function CompanyDashboardPage() {
  const [data, setData] = useState<CompanyDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/dashboard/company');
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

  const { kpis, rendimientoPorOferta } = data;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard de Empresa</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Ofertas publicadas"
          value={kpis.ofertasPublicadas}
          icon={<Briefcase size={24} />}
        />
        <KPICard
          title="Postulaciones recibidas"
          value={kpis.postulacionesRecibidas}
          icon={<FileText size={24} />}
        />
        <KPICard
          title="Contrataciones"
          value={kpis.contrataciones}
          icon={<UserCheck size={24} />}
        />
        <KPICard
          title="Tasa de contratación"
          value={`${kpis.rendimiento}%`}
          icon={<TrendingUp size={24} />}
          description="Contrataciones / Postulaciones"
        />
      </div>

      {/* Gráfico de rendimiento */}
      {rendimientoPorOferta.length > 0 && (
        <CompanyPerformanceChart data={rendimientoPorOferta} />
      )}
    </div>
  );
}