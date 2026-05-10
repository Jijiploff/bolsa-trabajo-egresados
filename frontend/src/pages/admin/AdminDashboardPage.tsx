import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { AdminDashboard } from '@/types';
import KPICard from '@/components/dashboards/KPICard';
import GraduatesByCareerChart from '@/components/dashboards/charts/GraduatesByCareerChart';
import GraduatesByYearChart from '@/components/dashboards/charts/GraduatesByYearChart';
import SkillsDemandChart from '@/components/dashboards/charts/SkillsDemandChart';
import OffersVsGraduatesChart from '@/components/dashboards/charts/OffersVsGraduatesChart';
import { Users, Building2, Briefcase, TrendingUp } from 'lucide-react';

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/dashboard/admin');
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

  const { kpis, egresadosPorCarrera, egresadosPorAno, demandaHabilidades, ofertasVsEgresadosPorCiudad } = data;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Administrador</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Total Egresados"
          value={kpis.totalEgresados}
          icon={<Users size={24} />}
        />
        <KPICard
          title="Total Empresas"
          value={kpis.totalEmpresas}
          icon={<Building2 size={24} />}
        />
        <KPICard
          title="Ofertas Activas"
          value={kpis.totalOfertasActivas}
          icon={<Briefcase size={24} />}
        />
        <KPICard
          title="Tasa de Empleabilidad"
          value={`${kpis.tasaEmpleabilidad}%`}
          icon={<TrendingUp size={24} />}
          description="Contrataciones / Egresados"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <GraduatesByCareerChart data={egresadosPorCarrera} />
        <GraduatesByYearChart data={egresadosPorAno} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkillsDemandChart data={demandaHabilidades} />
        <OffersVsGraduatesChart data={ofertasVsEgresadosPorCiudad} />
      </div>
    </div>
  );
}