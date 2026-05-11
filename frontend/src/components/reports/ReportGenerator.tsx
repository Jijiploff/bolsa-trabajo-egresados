import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { API_URL } from '@/lib/constants';
import { Download } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

type ReportType = 'egresados-carrera' | 'ofertas-activas' | 'postulaciones-oferta' | 'empleabilidad-carrera' | 'demanda-habilidades' | 'comparacion-cohortes';

const REPORT_OPTIONS: Record<string, { label: string; roles: string[] }> = {
  'egresados-carrera': { label: 'Egresados por carrera', roles: ['ADMIN', 'EGRESADO'] },
  'ofertas-activas': { label: 'Ofertas activas', roles: ['ADMIN', 'EMPRESA'] },
  'postulaciones-oferta': { label: 'Postulaciones por oferta', roles: ['ADMIN', 'EMPRESA'] },
  'empleabilidad-carrera': { label: 'Empleabilidad por carrera', roles: ['ADMIN'] },
  'demanda-habilidades': { label: 'Demanda de habilidades', roles: ['ADMIN'] },
  'comparacion-cohortes': { label: 'Comparación entre cohortes', roles: ['ADMIN'] },
};

export default function ReportGenerator() {
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState<ReportType | ''>('');
  const [ano, setAno] = useState('');
  const [ofertaId, setOfertaId] = useState('');
  const [anosCohorte, setAnosCohorte] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const availableReports = Object.entries(REPORT_OPTIONS).filter(([_, config]) =>
    config.roles.includes(user.rol)
  );

  const buildUrl = (): string | null => {
    if (!selectedReport) return null;
    const base = `${API_URL.replace('/api', '')}/api/reports/`;
    switch (selectedReport) {
      case 'egresados-carrera':
        return `${base}egresados-por-carrera${ano ? `?ano=${ano}` : ''}`;
      case 'ofertas-activas':
        return `${base}ofertas-activas`;
      case 'postulaciones-oferta':
        return `${base}postulaciones-por-oferta/${ofertaId}`;
      case 'empleabilidad-carrera':
        return `${base}empleabilidad-por-carrera`;
      case 'demanda-habilidades':
        return `${base}demanda-habilidades`;
      case 'comparacion-cohortes':
        return `${base}comparacion-cohortes?anos=${anosCohorte}`;
      default:
        return null;
    }
  };

  const handleDownload = async () => {
    const url = buildUrl();
    if (!url) return;

    setLoading(true);
    try {
      // Usar Axios para obtener el PDF como blob (respeta cookies y CORS)
      const response = await api.get(url, { responseType: 'blob' });

      // Crear un enlace temporal y forzar la descarga
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = selectedReport + '.pdf'; // nombre sugerido
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast.success('Reporte descargado');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al generar el reporte';
      toast.error(message);
      console.error('Error descargando reporte:', err);
    } finally {
      setLoading(false);
    }
  };

  const needAno = selectedReport === 'egresados-carrera';
  const needOfertaId = selectedReport === 'postulaciones-oferta';
  const needCohortes = selectedReport === 'comparacion-cohortes';

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Generar reporte PDF</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tipo de reporte</label>
          <select
            value={selectedReport}
            onChange={(e) => {
              setSelectedReport(e.target.value as ReportType);
              setAno('');
              setOfertaId('');
              setAnosCohorte('');
            }}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Seleccione...</option>
            {availableReports.map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
        </div>

        {needAno && (
          <div>
            <label className="block text-sm font-medium mb-1">Año de egreso (opcional)</label>
            <input
              type="number"
              value={ano}
              onChange={(e) => setAno(e.target.value)}
              placeholder="Ej: 2023"
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
        )}

        {needOfertaId && (
          <div>
            <label className="block text-sm font-medium mb-1">ID de la oferta</label>
            <input
              type="number"
              value={ofertaId}
              onChange={(e) => setOfertaId(e.target.value)}
              placeholder="Ej: 5"
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
        )}

        {needCohortes && (
          <div>
            <label className="block text-sm font-medium mb-1">Años de cohorte (separados por coma)</label>
            <input
              type="text"
              value={anosCohorte}
              onChange={(e) => setAnosCohorte(e.target.value)}
              placeholder="Ej: 2020,2021,2022"
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
        )}

        <Button
          onClick={handleDownload}
          disabled={!selectedReport || loading || (needOfertaId && !ofertaId) || (needCohortes && !anosCohorte)}
          className="w-full"
        >
          {loading ? (
            <span className="flex items-center gap-2">Generando...</span>
          ) : (
            <span className="flex items-center gap-2"><Download size={16} /> Descargar PDF</span>
          )}
        </Button>
      </div>
    </div>
  );
}