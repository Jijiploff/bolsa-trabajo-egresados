import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { jobOfferSchema, JobOfferFormData } from '@/validations/jobOfferValidations';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  defaultValues?: Partial<JobOfferFormData>;
  onSubmit: (data: JobOfferFormData) => Promise<void>;
  loading: boolean;
  habilidadesDisponibles?: { id: number; nombre: string }[];
}

export default function JobOfferForm({ defaultValues, onSubmit, loading, habilidadesDisponibles = [] }: Props) {
  const { register, control, handleSubmit, formState: { errors } } = useForm<JobOfferFormData>({
    resolver: zodResolver(jobOfferSchema),
    defaultValues: {
      titulo: '',
      descripcion: '',
      salario_min: null,
      salario_max: null,
      modalidad: 'PRESENCIAL',
      ubicacion: '',
      requisitos: '',
      fecha_cierre: '',
      habilidades: [],
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'habilidades' });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
      <div>
        <label className="block text-sm font-medium mb-1">Título *</label>
        <input {...register('titulo')} className="w-full border rounded-md px-3 py-2" />
        {errors.titulo && <p className="text-red-500 text-sm">{errors.titulo.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Descripción *</label>
        <textarea {...register('descripcion')} rows={4} className="w-full border rounded-md px-3 py-2" />
        {errors.descripcion && <p className="text-red-500 text-sm">{errors.descripcion.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Salario mínimo</label>
          <input type="number" step="0.01" {...register('salario_min', { valueAsNumber: true })} className="w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Salario máximo</label>
          <input type="number" step="0.01" {...register('salario_max', { valueAsNumber: true })} className="w-full border rounded-md px-3 py-2" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Modalidad *</label>
          <select {...register('modalidad')} className="w-full border rounded-md px-3 py-2">
            <option value="PRESENCIAL">Presencial</option>
            <option value="REMOTO">Remoto</option>
            <option value="HIBRIDO">Híbrido</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ubicación</label>
          <input {...register('ubicacion')} className="w-full border rounded-md px-3 py-2" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Requisitos</label>
        <textarea {...register('requisitos')} rows={3} className="w-full border rounded-md px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Fecha de cierre</label>
        <input type="date" {...register('fecha_cierre')} className="w-full border rounded-md px-3 py-2" />
      </div>

      {/* Habilidades dinámicas */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Habilidades requeridas</h3>
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 mb-2 items-center">
            <select {...register(`habilidades.${index}.habilidad_id`, { valueAsNumber: true })} className="w-full border rounded-md px-3 py-2">
              <option value="">Seleccione habilidad</option>
              {habilidadesDisponibles.map((h) => (
                <option key={h.id} value={h.id}>{h.nombre}</option>
              ))}
            </select>
            <button type="button" onClick={() => remove(index)} className="text-red-500"><Trash2 size={16} /></button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => append({ habilidad_id: 0 })}>
          <Plus size={16} className="mr-1" /> Agregar habilidad
        </Button>
      </div>

      <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar oferta'}</Button>
    </form>
  );
}