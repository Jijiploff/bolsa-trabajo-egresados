import { HistorialEstado } from '@/types';
import { X } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface Props {
  historial: HistorialEstado[];
  onClose: () => void;
}

export default function StatusHistory({ historial, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Historial de estados</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
        </div>
        {historial.length === 0 ? (
          <p className="text-muted-foreground">Sin historial</p>
        ) : (
          <ul className="space-y-3">
            {historial.map((h) => (
              <li key={h.id} className="flex items-start gap-3 border-b pb-2">
                <StatusBadge estado={h.estado} />
                <div className="flex-1">
                  <p className="text-sm">{new Date(h.fecha).toLocaleString()}</p>
                  {h.comentario && <p className="text-xs text-muted-foreground">{h.comentario}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}