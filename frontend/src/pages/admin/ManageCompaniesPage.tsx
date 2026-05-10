import { useState } from 'react';
import CompanyList from '@/components/companies/CompanyList';
import CompanyForm from '@/components/companies/CompanyForm';
import { Button } from '@/components/ui/button';
import { CompanyFormData } from '@/validations/companyValidations';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function ManageCompaniesPage() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data: CompanyFormData) => {
    setLoading(true);
    try {
      await api.post('/companies', data);
      toast.success('Empresa creada');
      setShowForm(false);
      // Refrescar lista: CompanyList se vuelve a montar al cambiar estado, pero podemos usar key
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al crear empresa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Empresas</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : 'Nueva empresa'}
        </Button>
      </div>
      {showForm && (
        <div className="mb-6 p-4 bg-white rounded-md shadow">
          <h2 className="text-lg font-semibold mb-4">Registrar nueva empresa</h2>
          <CompanyForm onSubmit={handleCreate} loading={loading} />
        </div>
      )}
      <CompanyList key={showForm ? 'form-open' : 'form-closed'} />
    </div>
  );
}