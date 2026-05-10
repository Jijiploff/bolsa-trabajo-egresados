export default function Footer() {
  return (
    <footer className="mt-auto border-t py-4 text-center text-xs text-muted-foreground">
      Bolsa de Trabajo &copy; {new Date().getFullYear()} - Todos los derechos reservados
    </footer>
  );
}