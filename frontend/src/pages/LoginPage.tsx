import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { loginSchema } from '@/validations/authValidations';
import { LoginRequest } from '@/types';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner'; // 👈 si no instalaste sonner, usa console.log o elimina esta línea

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

export default function LoginPage() {
  const { login, error: serverError, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginRequest) => {
    setLoading(true);
    try {
      const loggedUser = await login(data);
      toast.success(`Bienvenido ${loggedUser.email}`);
      // Redirigir según rol
      const redirectMap: Record<string, string> = {
        ADMIN: '/admin',
        EGRESADO: '/graduate',
        EMPRESA: '/company',
      };
      navigate(redirectMap[loggedUser.rol] || '/', { replace: true });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h2>
        {serverError && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">{serverError}</div>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Correo electrónico</label>
          <InputField register={register} name="email" error={errors.email?.message} type="email" placeholder="correo@ejemplo.com" />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Contraseña</label>
          <InputField register={register} name="password" error={errors.password?.message} type="password" placeholder="••••••••" />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </Button>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          ¿No tienes cuenta? <Link to="/register" className="text-primary hover:underline">Regístrate</Link>
        </p>
      </form>
    </div>
  );
}