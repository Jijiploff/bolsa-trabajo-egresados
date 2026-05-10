import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Egresado } from '@/types';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Pagination from '@/components/pagination/Pagination';

export default function GraduateList() {
  const [graduates, setGraduates] = useState<Egresado[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ nombre: '', carrera_id: '', anio_egreso: '' });
  const [carreras, setCarreras] = useState<{ id: number; nombre: string }[]>([]);

  const fetchCarreras = async () => {
    try {
      const res = await api.get('/carreras');
      setCarreras(res.data);
    } catch (err) {
      console.error('Error fetching carreras', err);
    }
  };

  useEffect(() => {
    fetchCarreras();
  }, []);

  const fetchGraduates = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10' });
      if (filters.nombre) params.append('nombre', filters.nombre);
      if (filters.carrera_id) params.append('carrera_id', filters.carrera_id);
      if (filters.anio_egreso) params.append('anio_egreso', filters.anio_egreso);
      const res = await api.get(`/graduates?${params}`);
      setGraduates(res.data.data);
      setTotalPages(res.data.pagination.lastPage);
    } catch (err) {
      console.error('Error al cargar egresados', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraduates();
  }, [page, filters]);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchGraduates();
  };

  const deleteGraduate = async (id: number) => {
    if (!confirm('¿Eliminar este egresado?')) return;
    try {
      await api.delete(`/graduates/${id}`);
      fetchGraduates();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {/* Filtros */}
      <form onSubmit={handleFilter} className="flex gap-3 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Nombre o apellido"
          value={filters.nombre}
          onChange={(e) => setFilters({ ...filters, nombre: e.target.value })}
          className="border rounded-md px-3 py-2"
        />
        <select
          value={filters.carrera_id}
          onChange={(e) => setFilters({ ...filters, carrera_id: e.target.value })}
          className="border rounded-md px-3 py-2"
        >
          <option value="">Todas las carreras</option>
          {carreras.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Año egreso"
          value={filters.anio_egreso}
          onChange={(e) => setFilters({ ...filters, anio_egreso: e.target.value })}
          className="border rounded-md px-3 py-2 w-32"
        />
        <Button type="submit" size="sm">Buscar</Button>
      </form>

      {/* Tabla */}
      <div className="overflow-x-auto bg-white rounded-md shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Carrera</th>
              <th className="px-4 py-3 text-left">Año egreso</th>
              <th className="px-4 py-3 text-left">Ciudad</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-4">Cargando...</td></tr>
            ) : graduates.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-4">No se encontraron egresados</td></tr>
            ) : (
              graduates.map((g) => (
                <tr key={g.id} className="border-t">
                  <td className="px-4 py-3">{g.nombres} {g.apellidos}</td>
                  <td className="px-4 py-3">{g.carrera?.nombre || '-'}</td>
                  <td className="px-4 py-3">{g.anio_egreso || '-'}</td>
                  <td className="px-4 py-3">{g.ciudad || '-'}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Link to={`/admin/graduates/${g.id}`}><Button variant="outline" size="sm">Ver</Button></Link>
                    <Button variant="destructive" size="sm" onClick={() => deleteGraduate(g.id)}>Eliminar</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}