import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-muted-foreground mb-6">Página no encontrada</p>
      <Link to="/" className="text-primary hover:underline">
        Volver al inicio
      </Link>
    </div>
  );
}