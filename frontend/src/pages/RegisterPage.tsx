import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { registerSchema } from '@/validations/authValidations';
import { RegisterRequest } from '@/types';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner'; // 👈 opcional

function InputField({ register, name, error, ...props }: any) {
  return (
    <div>
      <input
        {...register(name)}
        {...props}
        className={`w-full border rounded-md px-3 py-2 ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default function RegisterPage() {
  const { register: signup, error: serverError } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterRequest>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterRequest) => {
    setLoading(true);
    try {
      const newUser = await signup(data);
      toast.success('Cuenta creada exitosamente');
      const redirectMap: Record<string, string> = {
        ADMIN: '/admin',
        EGRESADO: '/graduate',
        EMPRESA: '/company',
      };
      navigate(redirectMap[newUser.rol] || '/', { replace: true });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Crear cuenta</h2>
        {serverError && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">{serverError}</div>
        )}
        {/* campos igual que antes */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Correo electrónico</label>
          <InputField register={register} name="email" error={errors.email?.message} type="email" placeholder="correo@ejemplo.com" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Contraseña</label>
          <InputField register={register} name="password" error={errors.password?.message} type="password" placeholder="••••••••" />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Rol</label>
          <select
            {...register('rol')}
            className={`w-full border rounded-md px-3 py-2 ${errors.rol ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Selecciona un rol</option>
            <option value="EGRESADO">Egresado</option>
            <option value="EMPRESA">Empresa</option>
          </select>
          {errors.rol && <p className="text-red-500 text-sm mt-1">{errors.rol.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </Button>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta? <Link to="/login" className="text-primary hover:underline">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}