import { useState, useEffect } from 'react';
import api from '@/lib/api';
import CompanyForm from '@/components/companies/CompanyForm';
import CompanyProfile from '@/components/companies/CompanyProfile';
import { Button } from '@/components/ui/button';
import { CompanyFormData } from '@/validations/companyValidations';
import { toast } from 'sonner';

export default function CompanyProfilePage() {
  const [editing, setEditing] = useState(false);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [defaultData, setDefaultData] = useState<Partial<CompanyFormData> | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [profileExists, setProfileExists] = useState<boolean | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/companies/me');
      const comp = res.data;
      setCompanyId(comp.id);
      setDefaultData(comp);
      setProfileExists(true);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setProfileExists(false);
      } else {
        toast.error('Error al cargar el perfil de empresa');
      }
    }
  };

  const handleSubmit = async (data: CompanyFormData) => {
    setLoading(true);
    try {
      if (companyId) {
        await api.put(`/companies/${companyId}`, data);
        toast.success('Perfil actualizado');
      } else {
        const res = await api.post('/companies', data);
        setCompanyId(res.data.id);
        toast.success('Perfil de empresa creado');
      }
      setEditing(false);
      fetchProfile();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  if (profileExists === null) {
    return <div className="text-center py-8">Cargando perfil...</div>;
  }

  if (!profileExists || editing) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">{!profileExists ? 'Completar perfil de empresa' : 'Editar perfil de empresa'}</h1>
        <CompanyForm defaultValues={defaultData} onSubmit={handleSubmit} loading={loading} />
        {profileExists && (
          <Button variant="outline" className="mt-4" onClick={() => setEditing(false)}>
            Cancelar
          </Button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Mi Empresa</h1>
        <Button onClick={() => setEditing(true)}>Editar perfil</Button>
      </div>
      {companyId && <CompanyProfile companyId={companyId} />}
    </div>
  );
}