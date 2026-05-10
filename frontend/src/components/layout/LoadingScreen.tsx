export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    </div>
  );
}