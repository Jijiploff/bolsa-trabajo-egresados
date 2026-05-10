import { useState, useEffect } from 'react';
import api from '@/lib/api';
import GraduateForm from '@/components/graduates/GraduateForm';
import GraduateProfile from '@/components/graduates/GraduateProfile';
import { Button } from '@/components/ui/button';
import { GraduateFormData } from '@/validations/graduateValidations';
import { toast } from 'sonner';

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [egresadoId, setEgresadoId] = useState<number | null>(null);
  const [defaultData, setDefaultData] = useState<Partial<GraduateFormData> | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [carreras, setCarreras] = useState<any[]>([]);
  const [habilidades, setHabilidades] = useState<any[]>([]);
  const [profileExists, setProfileExists] = useState<boolean | null>(null); // null = cargando

  useEffect(() => {
    fetchProfile();
    fetchCarreras();
    fetchHabilidades();
  }, []);

  const formatDate = (isoString: string | null) => {
    if (!isoString) return null;
    return new Date(isoString).toISOString().split('T')[0];
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get('/graduates/me');
      const grad = res.data;

      const transformed = {
        ...grad,
        fecha_nacimiento: formatDate(grad.fecha_nacimiento),
        experiencia_laboral: grad.experiencia_laboral?.map((exp: any) => ({
          ...exp,
          fecha_inicio: exp.fecha_inicio ? new Date(exp.fecha_inicio).toISOString().split('T')[0] : '',
          fecha_fin: exp.fecha_fin ? new Date(exp.fecha_fin).toISOString().split('T')[0] : null,
        })),
        habilidades: grad.habilidades?.map((h: any) => ({
          habilidad_id: h.habilidad_id,
          nivel: h.nivel,
        })),
      };

      setEgresadoId(grad.id);
      setDefaultData(transformed);
      setProfileExists(true);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setProfileExists(false);
      } else {
        toast.error('Error al cargar el perfil');
      }
    }
  };

  const fetchCarreras = async () => {
    try {
      const res = await api.get('/carreras');
      setCarreras(res.data);
    } catch (err) {
      console.error('Error fetching carreras', err);
    }
  };

  const fetchHabilidades = async () => {
    try {
      const res = await api.get('/habilidades');
      setHabilidades(res.data);
    } catch (err) {
      console.error('Error fetching habilidades', err);
    }
  };

  const handleSubmit = async (data: GraduateFormData) => {
    setLoading(true);
    try {
      // Sanitizar: convertir strings vacíos a null y asegurar tipos correctos
      const payload = {
        ...data,
        anio_egreso: isNaN(data.anio_egreso as number)
          ? null
          : data.anio_egreso,
        fecha_nacimiento: data.fecha_nacimiento
          ? new Date(data.fecha_nacimiento).toISOString()
          : null,
        formacion_academica: data.formacion_academica?.map(f => ({
          institucion: f.institucion,
          titulo: f.titulo,
          nivel: f.nivel,
          anio_inicio: isNaN(f.anio_inicio as number)
            ? null
            : f.anio_inicio,
          anio_fin: isNaN(f.anio_fin as number)
            ? null
            : f.anio_fin,
          descripcion: f.descripcion || null,
        })),
        experiencia_laboral: data.experiencia_laboral?.map(e => ({
          empresa: e.empresa,
          cargo: e.cargo,
          fecha_inicio: e.fecha_inicio
            ? new Date(e.fecha_inicio).toISOString()
            : null,

          fecha_fin: e.fecha_fin
            ? new Date(e.fecha_fin).toISOString()
            : null,
          descripcion: e.descripcion || null,
          actual_trabajo: e.actual_trabajo || false,
        })),
        habilidades: data.habilidades?.map(h => ({
          habilidad_id: Number(h.habilidad_id),
          nivel: h.nivel ? Number(h.nivel) : null,
        })),
      };

      if (egresadoId) {
        await api.put(`/graduates/${egresadoId}`, payload);
        toast.success('Perfil actualizado');
      } else {
        const res = await api.post('/graduates', payload);
        setEgresadoId(res.data.id);
        toast.success('Perfil creado');
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
        <h1 className="text-2xl font-bold mb-6">{!profileExists ? 'Completar perfil' : 'Editar perfil'}</h1>
        <GraduateForm
          defaultValues={defaultData}
          onSubmit={handleSubmit}
          loading={loading}
          carreras={carreras}
          habilidadesDisponibles={habilidades}
        />
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
        <h1 className="text-2xl font-bold">Mi Perfil</h1>
        <Button onClick={() => setEditing(true)}>Editar perfil</Button>
      </div>
      {egresadoId && <GraduateProfile graduateId={egresadoId} />}
    </div>
  );
}