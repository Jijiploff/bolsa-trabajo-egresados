import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AnoCount } from '@/types';

interface Props {
  data: AnoCount[];
}

export default function GraduatesByYearChart({ data }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Egresados por año</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ano" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="cantidad" stroke="var(--primary)" strokeWidth={2} dot={{
            r: 5,
            fill: "#2563eb",
            stroke: "#ffffff",
            strokeWidth: 2,
          }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}