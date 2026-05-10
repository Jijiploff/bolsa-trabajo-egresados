import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Egresado } from '@/types';

interface Props {
  graduateId: number;
}

export default function GraduateProfile({ graduateId }: Props) {
  const [graduate, setGraduate] = useState<Egresado | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/graduates/${graduateId}`);
        setGraduate(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [graduateId]);

  if (loading) return <p>Cargando perfil...</p>;
  if (!graduate) return <p>Egresado no encontrado</p>;

  return (
    <div className="bg-white p-6 rounded-md shadow">
      <div className="flex gap-6 mb-6">
        <img src={graduate.foto_url || '/default-avatar.png'} alt="Foto" className="w-24 h-24 rounded-full object-cover" />
        <div>
          <h2 className="text-2xl font-bold">{graduate.nombres} {graduate.apellidos}</h2>
          <p className="text-muted-foreground">{graduate.titulo} - {graduate.universidad}</p>
          <p>{graduate.carrera?.nombre} | Año egreso: {graduate.anio_egreso || 'No especificado'}</p>
          <p>{graduate.ciudad}, {graduate.pais}</p>
        </div>
      </div>

      {graduate.cv_url && (
        <div className="mb-4">
          <a href={graduate.cv_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">Ver CV</a>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Formación Académica</h3>
          {graduate.formacion_academica?.length ? (
            graduate.formacion_academica.map((f, i) => (
              <div key={i} className="mb-2">
                <p><strong>{f.titulo}</strong> - {f.institucion}</p>
                <p className="text-sm text-muted-foreground">{f.nivel} ({f.anio_inicio} - {f.anio_fin || 'Presente'})</p>
              </div>
            ))
          ) : <p className="text-muted-foreground">Sin registros</p>}
        </div>
        <div>
          <h3 className="font-semibold mb-2">Experiencia Laboral</h3>
          {graduate.experiencia_laboral?.length ? (
            graduate.experiencia_laboral.map((e, i) => (
              <div key={i} className="mb-2">
                <p><strong>{e.cargo}</strong> en {e.empresa}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(e.fecha_inicio).toLocaleDateString()} - {e.actual_trabajo ? 'Presente' : e.fecha_fin ? new Date(e.fecha_fin).toLocaleDateString() : 'Sin fecha'}
                </p>
              </div>
            ))
          ) : <p className="text-muted-foreground">Sin registros</p>}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Habilidades</h3>
        <div className="flex flex-wrap gap-2">
          {graduate.habilidades?.length ? (
            graduate.habilidades.map((h) => (
              <span key={h.id} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                {h.habilidad.nombre} {h.nivel && `(${h.nivel}/5)`}
              </span>
            ))
          ) : <p className="text-muted-foreground">Sin habilidades registradas</p>}
        </div>
      </div>
    </div>
  );
}