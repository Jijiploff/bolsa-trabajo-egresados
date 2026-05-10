import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  FileText,
  UserCircle,
  FilePlus,
} from 'lucide-react';

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { to: '/admin/graduates', label: 'Egresados', icon: <Users size={18} /> },
  { to: '/admin/companies', label: 'Empresas', icon: <Building2 size={18} /> },
  { to: '/admin/offers', label: 'Ofertas', icon: <Briefcase size={18} /> },
  { to: '/admin/reports', label: 'Reportes', icon: <FileText size={18} /> },
];

const graduateLinks = [
  { to: '/graduate', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { to: '/graduate/profile', label: 'Mi Perfil', icon: <UserCircle size={18} /> },
  { to: '/graduate/offers', label: 'Ofertas', icon: <Briefcase size={18} /> },
  { to: '/graduate/applications', label: 'Postulaciones', icon: <FileText size={18} /> },
];

const companyLinks = [
  { to: '/company', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { to: '/company/offers', label: 'Mis Ofertas', icon: <Briefcase size={18} /> },
  { to: '/company/offers/new', label: 'Nueva Oferta', icon: <FilePlus size={18} /> },
  { to: '/company/applications', label: 'Postulaciones', icon: <FileText size={18} /> },
  { to: '/company/profile', label: 'Mi Perfil', icon: <UserCircle size={18} /> },
];

export default function Sidebar() {
  const { user } = useAuth();

  let links;
  if (user?.rol === 'ADMIN') links = adminLinks;
  else if (user?.rol === 'EMPRESA') links = companyLinks;
  else links = graduateLinks;

  return (
    <aside className="w-64 h-screen border-r bg-gray-50 flex-shrink-0 hidden md:flex flex-col py-6 px-4">
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}