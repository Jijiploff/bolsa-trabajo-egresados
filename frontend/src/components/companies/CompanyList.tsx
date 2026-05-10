import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Empresa } from '@/types';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Pagination from '@/components/pagination/Pagination';

export default function CompanyList() {
  const [companies, setCompanies] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10', nombre: search });
      const res = await api.get(`/companies?${params}`);
      setCompanies(res.data.data);
      setTotalPages(res.data.pagination.lastPage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [page, search]);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta empresa?')) return;
    try {
      await api.delete(`/companies/${id}`);
      fetchCompanies();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="border rounded-md px-3 py-2"
        />
      </div>
      <div className="overflow-x-auto bg-white rounded-md shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Sector</th>
              <th className="px-4 py-3 text-left">Ubicación</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center py-4">Cargando...</td></tr>
            ) : companies.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-4">No se encontraron empresas</td></tr>
            ) : (
              companies.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="px-4 py-3">{c.nombre}</td>
                  <td className="px-4 py-3">{c.sector || '-'}</td>
                  <td className="px-4 py-3">{c.ubicacion || '-'}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Link to={`/admin/companies/${c.id}`}><Button variant="outline" size="sm">Ver</Button></Link>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(c.id)}>Eliminar</Button>
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