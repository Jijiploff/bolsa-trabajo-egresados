import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HabilidadDemanda } from '@/types';

interface Props {
  data: HabilidadDemanda[];
}

export default function SkillsDemandChart({ data }: Props) {
  // Ordenar descendente y limitar a top 10
  const sorted = [...data].sort((a, b) => b.demanda - a.demanda).slice(0, 10);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Demanda de habilidades</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={sorted} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false} />
          <YAxis type="category" dataKey="habilidad" tick={{ fontSize: 12 }} width={120} />
          <Tooltip />
          <Bar dataKey="demanda" fill="var(--chart-2)" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}