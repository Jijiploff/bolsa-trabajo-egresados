import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CarreraCount } from '@/types';

interface Props {
  data: CarreraCount[];
}

export default function GraduatesByCareerChart({ data }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Egresados por carrera</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="carrera" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="egresados" fill="var(--primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}