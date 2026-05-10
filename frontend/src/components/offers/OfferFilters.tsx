import { Button } from '@/components/ui/button';
import { MODALIDADES_OFERTA } from '@/lib/constants';

export interface Filters {
  titulo: string;
  modalidad: string;
  ubicacion: string;
  salario_min: string;
  salario_max: string;
  activa?: string;
}

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onSearch: () => void;
  showActiva?: boolean;
}

export default function OfferFilters({ filters, onChange, onSearch, showActiva }: Props) {
  const handleChange = (key: keyof Filters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 mb-4 items-end">
      <input
        type="text"
        placeholder="Título"
        value={filters.titulo}
        onChange={(e) => handleChange('titulo', e.target.value)}
        className="border rounded-md px-3 py-2 w-40"
      />
      <select
        value={filters.modalidad}
        onChange={(e) => handleChange('modalidad', e.target.value)}
        className="border rounded-md px-3 py-2"
      >
        <option value="">Todas las modalidades</option>
        <option value="PRESENCIAL">Presencial</option>
        <option value="REMOTO">Remoto</option>
        <option value="HIBRIDO">Híbrido</option>
      </select>
      <input
        type="text"
        placeholder="Ubicación"
        value={filters.ubicacion}
        onChange={(e) => handleChange('ubicacion', e.target.value)}
        className="border rounded-md px-3 py-2 w-40"
      />
      <input
        type="number"
        placeholder="Salario mín."
        value={filters.salario_min}
        onChange={(e) => handleChange('salario_min', e.target.value)}
        className="border rounded-md px-3 py-2 w-32"
      />
      <input
        type="number"
        placeholder="Salario máx."
        value={filters.salario_max}
        onChange={(e) => handleChange('salario_max', e.target.value)}
        className="border rounded-md px-3 py-2 w-32"
      />
      {showActiva && (
        <select
          value={filters.activa || ''}
          onChange={(e) => handleChange('activa', e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          <option value="">Todas</option>
          <option value="true">Activas</option>
          <option value="false">Inactivas</option>
        </select>
      )}
      <Button type="submit" size="sm">Buscar</Button>
    </form>
  );
}