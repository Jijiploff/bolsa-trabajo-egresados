import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { jobOfferSchema, JobOfferFormData } from '@/validations/jobOfferValidations';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

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

  // Para creación de nueva habilidad
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillType, setNewSkillType] = useState<'TECNICA' | 'BLANDA'>('TECNICA');
  const [habilidadesList, setHabilidadesList] = useState(habilidadesDisponibles);

  const handleCreateSkill = async () => {
    if (!newSkillName.trim()) return;
    try {
      const res = await api.post('/habilidades', { nombre: newSkillName.trim(), tipo: newSkillType });
      const nuevaHabilidad = res.data;
      // Agregar a la lista local
      setHabilidadesList(prev => [...prev, { id: nuevaHabilidad.id, nombre: nuevaHabilidad.nombre }]);
      // Agregar al campo del formulario
      append({ habilidad_id: nuevaHabilidad.id });
      setNewSkillName('');
      toast.success('Habilidad creada y agregada');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al crear habilidad');
    }
  };


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

      {/* Sección de habilidades dinámicas */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Habilidades requeridas</h3>
        
        {/* Habilidades ya seleccionadas */}
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 mb-2 items-center">
            <select
              {...register(`habilidades.${index}.habilidad_id`, { valueAsNumber: true })}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">Seleccione habilidad</option>
              {habilidadesList.map((h) => (
                <option key={h.id} value={h.id}>{h.nombre}</option>
              ))}
            </select>
            <button type="button" onClick={() => remove(index)} className="text-red-500"><Trash2 size={16} /></button>
          </div>
        ))}

        {/* Crear nueva habilidad */}
        <div className="flex gap-2 items-end mt-3 p-3 border rounded-md bg-gray-50">
          <div className="flex-1">
            <label className="block text-xs font-medium mb-1">Nueva habilidad</label>
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="Nombre de la habilidad"
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Tipo</label>
            <select
              value={newSkillType}
              onChange={(e) => setNewSkillType(e.target.value as any)}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="TECNICA">Técnica</option>
              <option value="BLANDA">Blanda</option>
            </select>
          </div>
          <Button type="button" variant="outline" onClick={handleCreateSkill} title="Crear y agregar">
            <Plus size={16} className="mr-1" /> Crear
          </Button>
        </div>

        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({ habilidad_id: 0 })}>
          <Plus size={16} className="mr-1" /> Agregar habilidad existente
        </Button>
      </div>

      <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar oferta'}</Button>
    </form>
  );
}