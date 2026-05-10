import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RendimientoOferta } from '@/types';

interface Props {
  data: RendimientoOferta[];
}

export default function CompanyPerformanceChart({ data }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Rendimiento por oferta</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="titulo" tick={{ fontSize: 12 }} angle={-20} textAnchor="end" height={60} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="postulaciones" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="contrataciones" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}