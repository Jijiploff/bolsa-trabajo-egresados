import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { companySchema, CompanyFormData } from '@/validations/companyValidations';
import { Button } from '@/components/ui/button';

interface Props {
  defaultValues?: Partial<CompanyFormData>;
  onSubmit: (data: CompanyFormData) => Promise<void>;
  loading: boolean;
}

export default function CompanyForm({ defaultValues, onSubmit, loading }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      sector: '',
      tamanio: '',
      ubicacion: '',
      sitio_web: '',
      logo_url: '',
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
      <div>
        <label className="block text-sm font-medium mb-1">Nombre *</label>
        <input {...register('nombre')} className="w-full border rounded-md px-3 py-2" />
        {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <textarea {...register('descripcion')} rows={3} className="w-full border rounded-md px-3 py-2" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Sector</label>
          <input {...register('sector')} className="w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tamaño</label>
          <input {...register('tamanio')} placeholder="Ej: 50-200 empleados" className="w-full border rounded-md px-3 py-2" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Ubicación</label>
        <input {...register('ubicacion')} className="w-full border rounded-md px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Sitio web</label>
        <input {...register('sitio_web')} placeholder="https://..." className="w-full border rounded-md px-3 py-2" />
        {errors.sitio_web && <p className="text-red-500 text-sm">{errors.sitio_web.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">URL del logo</label>
        <input {...register('logo_url')} placeholder="https://..." className="w-full border rounded-md px-3 py-2" />
        {errors.logo_url && <p className="text-red-500 text-sm">{errors.logo_url.message}</p>}
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar empresa'}
      </Button>
    </form>
  );
}