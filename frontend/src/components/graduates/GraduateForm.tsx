import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { graduateSchema, GraduateFormData } from '@/validations/graduateValidations';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  defaultValues?: Partial<GraduateFormData>;
  onSubmit: (data: GraduateFormData) => Promise<void>;
  loading: boolean;
  carreras?: { id: number; nombre: string }[]; // Se cargarán desde API
  habilidadesDisponibles?: { id: number; nombre: string; tipo: string }[];
}

export default function GraduateForm({ defaultValues, onSubmit, loading, carreras = [], habilidadesDisponibles = [] }: Props) {
  const { register, control, handleSubmit, formState: { errors } } = useForm<GraduateFormData>({
    resolver: zodResolver(graduateSchema),
    defaultValues: {
      nombres: '',
      apellidos: '',
      fecha_nacimiento: '',
      ciudad: '',
      pais: '',
      telefono: '',
      direccion: '',
      foto_url: '',
      cv_url: '',
      linkedin_url: '',
      github_url: '',
      titulo: '',
      universidad: '',
      carrera_id: null,
      anio_egreso: null,
      descripcion_personal: '',
      formacion_academica: [],
      experiencia_laboral: [],
      habilidades: [],
      ...defaultValues,
    },
  });

  const { fields: formaciones, append: addFormacion, remove: removeFormacion } = useFieldArray({ control, name: 'formacion_academica' });
  const { fields: experiencias, append: addExperiencia, remove: removeExperiencia } = useFieldArray({ control, name: 'experiencia_laboral' });
  const { fields: habilidades, append: addHabilidad, remove: removeHabilidad } = useFieldArray({ control, name: 'habilidades' });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Datos personales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombres *</label>
          <input {...register('nombres')} className="w-full border rounded-md px-3 py-2" />
          {errors.nombres && <p className="text-red-500 text-sm">{errors.nombres.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Apellidos *</label>
          <input {...register('apellidos')} className="w-full border rounded-md px-3 py-2" />
          {errors.apellidos && <p className="text-red-500 text-sm">{errors.apellidos.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Fecha nacimiento</label>
          <input type="date" {...register('fecha_nacimiento')} className="w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ciudad</label>
          <input {...register('ciudad')} className="w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">País</label>
          <input {...register('pais')} className="w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Teléfono</label>
          <input {...register('telefono')} className="w-full border rounded-md px-3 py-2" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Dirección</label>
          <input {...register('direccion')} className="w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">URL Foto</label>
          <input {...register('foto_url')} className="w-full border rounded-md px-3 py-2" />
          {errors.foto_url && <p className="text-red-500 text-sm">{errors.foto_url.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">URL CV</label>
          <input {...register('cv_url')} placeholder="https://..." className="w-full border rounded-md px-3 py-2" />
          {errors.cv_url && <p className="text-red-500 text-sm">{errors.cv_url.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">LinkedIn</label>
          <input {...register('linkedin_url')} placeholder="https://linkedin.com/..." className="w-full border rounded-md px-3 py-2" />
          {errors.linkedin_url && <p className="text-red-500 text-sm">{errors.linkedin_url.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">GitHub</label>
          <input {...register('github_url')} placeholder="https://github.com/..." className="w-full border rounded-md px-3 py-2" />
          {errors.github_url && <p className="text-red-500 text-sm">{errors.github_url.message}</p>}
        </div>
      </div>

      {/* Información académica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Título profesional</label>
          <input {...register('titulo')} className="w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Universidad</label>
          <input {...register('universidad')} className="w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Carrera</label>
          <select {...register('carrera_id', { valueAsNumber: true })} className="w-full border rounded-md px-3 py-2">
            <option value="">Seleccione carrera</option>
            {carreras.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
          {errors.carrera_id && <p className="text-red-500 text-sm">{errors.carrera_id.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Año de egreso</label>
          <input type="number" {...register('anio_egreso', { valueAsNumber: true })} className="w-full border rounded-md px-3 py-2" />
          {errors.anio_egreso && <p className="text-red-500 text-sm">{errors.anio_egreso.message}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Descripción personal</label>
          <textarea {...register('descripcion_personal')} rows={3} className="w-full border rounded-md px-3 py-2" />
        </div>
      </div>

      {/* Formación académica dinámica */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Formación Académica</h3>
        {formaciones.map((field, index) => (
          <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3 border p-3 rounded-md relative">
            <input {...register(`formacion_academica.${index}.institucion`)} placeholder="Institución" className="w-full border rounded-md px-3 py-2" />
            <input {...register(`formacion_academica.${index}.titulo`)} placeholder="Título" className="w-full border rounded-md px-3 py-2" />
            <select {...register(`formacion_academica.${index}.nivel`)} className="w-full border rounded-md px-3 py-2">
              <option value="PREGRADO">Pregrado</option>
              <option value="POSTGRADO">Postgrado</option>
              <option value="DIPLOMADO">Diplomado</option>
              <option value="MAESTRIA">Maestría</option>
              <option value="DOCTORADO">Doctorado</option>
              <option value="CURSO">Curso</option>
            </select>
            <input type="number" {...register(`formacion_academica.${index}.anio_inicio`, { valueAsNumber: true })} placeholder="Año inicio" className="w-full border rounded-md px-3 py-2" />
            <input type="number" {...register(`formacion_academica.${index}.anio_fin`, { valueAsNumber: true })} placeholder="Año fin" className="w-full border rounded-md px-3 py-2" />
            <button type="button" onClick={() => removeFormacion(index)} className="absolute top-2 right-2 text-red-500"><Trash2 size={16} /></button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => addFormacion({ institucion: '', titulo: '', nivel: 'PREGRADO', anio_inicio: null, anio_fin: null })}>
          <Plus size={16} className="mr-1" /> Agregar formación
        </Button>
      </div>

      {/* Experiencia laboral dinámica */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Experiencia Laboral</h3>
        {experiencias.map((field, index) => (
          <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3 border p-3 rounded-md relative">
            <input {...register(`experiencia_laboral.${index}.empresa`)} placeholder="Empresa" className="w-full border rounded-md px-3 py-2" />
            <input {...register(`experiencia_laboral.${index}.cargo`)} placeholder="Cargo" className="w-full border rounded-md px-3 py-2" />
            <input type="date" {...register(`experiencia_laboral.${index}.fecha_inicio`)} className="w-full border rounded-md px-3 py-2" />
            <input type="date" {...register(`experiencia_laboral.${index}.fecha_fin`)} className="w-full border rounded-md px-3 py-2" />
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register(`experiencia_laboral.${index}.actual_trabajo`)} /> Trabajo actual
            </label>
            <button type="button" onClick={() => removeExperiencia(index)} className="absolute top-2 right-2 text-red-500"><Trash2 size={16} /></button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => addExperiencia({ empresa: '', cargo: '', fecha_inicio: '', fecha_fin: '', actual_trabajo: false })}>
          <Plus size={16} className="mr-1" /> Agregar experiencia
        </Button>
      </div>

      {/* Habilidades dinámicas */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Habilidades</h3>
        {habilidades.map((field, index) => (
          <div key={field.id} className="flex gap-2 mb-2 items-center">
            <select {...register(`habilidades.${index}.habilidad_id`, { valueAsNumber: true })} className="w-full border rounded-md px-3 py-2">
              <option value="">Seleccione habilidad</option>
              {habilidadesDisponibles.map((h) => (
                <option key={h.id} value={h.id}>{h.nombre} ({h.tipo})</option>
              ))}
            </select>
            <input type="number" {...register(`habilidades.${index}.nivel`, { valueAsNumber: true })} min={1} max={5} placeholder="Nivel (1-5)" className="w-24 border rounded-md px-3 py-2" />
            <button type="button" onClick={() => removeHabilidad(index)} className="text-red-500"><Trash2 size={16} /></button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => addHabilidad({ habilidad_id: 0, nivel: null })}>
          <Plus size={16} className="mr-1" /> Agregar habilidad
        </Button>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar perfil'}
      </Button>
    </form>
  );
}