import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/store/AuthContext';
import { NotificationProvider } from '@/store/NotificationContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Páginas públicas
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import NotFoundPage from '@/pages/NotFoundPage';

// Admin
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import ManageGraduatesPage from '@/pages/admin/ManageGraduatesPage';
import ManageCompaniesPage from '@/pages/admin/ManageCompaniesPage';
import ManageOffersPage from '@/pages/admin/ManageOffersPage';
import ReportsPage from '@/pages/ReportsPage'; // unificada

// Graduate
import GraduateDashboardPage from '@/pages/graduate/GraduateDashboardPage';
import GraduateProfilePage from '@/pages/graduate/GraduateProfilePage';
import JobOffersPage from '@/pages/graduate/JobOffersPage';
import MyApplicationsPage from '@/pages/graduate/MyApplicationsPage';

// Company
import CompanyDashboardPage from '@/pages/company/CompanyDashboardPage';
import CompanyProfilePage from '@/pages/company/CompanyProfilePage';
import MyOffersPage from '@/pages/company/MyOffersPage';
import CreateOfferPage from '@/pages/company/CreateOfferPage';
import CompanyApplicationsPage from '@/pages/company/CompanyApplicationsPage';

import GraduateDetailPage from '@/pages/GraduateDetailPage';
import CompanyDetailPage from '@/pages/CompanyDetailPage';

import OfferDetailPage from '@/pages/OfferDetailPage';
import OfferEditPage from '@/pages/OfferEditPage';

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Admin */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboardPage /></ProtectedRoute>} />
            <Route path="/admin/graduates" element={<ProtectedRoute allowedRoles={['ADMIN']}><ManageGraduatesPage /></ProtectedRoute>} />
            <Route path="/admin/companies" element={<ProtectedRoute allowedRoles={['ADMIN']}><ManageCompaniesPage /></ProtectedRoute>} />
            <Route path="/admin/offers" element={<ProtectedRoute allowedRoles={['ADMIN']}><ManageOffersPage /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['ADMIN']}><ReportsPage /></ProtectedRoute>} />
            <Route path="/admin/graduates/:id" element={<ProtectedRoute allowedRoles={['ADMIN']}><GraduateDetailPage /></ProtectedRoute>} />
            <Route path="/admin/companies/:id" element={<ProtectedRoute allowedRoles={['ADMIN']}><CompanyDetailPage /></ProtectedRoute>} />
            
            {/* Graduate */}
            <Route path="/graduate" element={<ProtectedRoute allowedRoles={['EGRESADO']}><GraduateDashboardPage /></ProtectedRoute>} />
            <Route path="/graduate/profile" element={<ProtectedRoute allowedRoles={['EGRESADO']}><GraduateProfilePage /></ProtectedRoute>} />
            <Route path="/graduate/offers" element={<ProtectedRoute allowedRoles={['EGRESADO']}><JobOffersPage /></ProtectedRoute>} />
            <Route path="/graduate/applications" element={<ProtectedRoute allowedRoles={['EGRESADO']}><MyApplicationsPage /></ProtectedRoute>} />
            <Route path="/graduate/reports" element={<ProtectedRoute allowedRoles={['EGRESADO']}><ReportsPage /></ProtectedRoute>} />
            <Route path="/graduate/companies/:id" element={<ProtectedRoute allowedRoles={['EGRESADO']}><CompanyDetailPage /></ProtectedRoute>} />

            {/* Company */}
            <Route path="/company" element={<ProtectedRoute allowedRoles={['EMPRESA']}><CompanyDashboardPage /></ProtectedRoute>} />
            <Route path="/company/profile" element={<ProtectedRoute allowedRoles={['EMPRESA']}><CompanyProfilePage /></ProtectedRoute>} />
            <Route path="/company/offers" element={<ProtectedRoute allowedRoles={['EMPRESA']}><MyOffersPage /></ProtectedRoute>} />
            <Route path="/company/offers/new" element={<ProtectedRoute allowedRoles={['EMPRESA']}><CreateOfferPage /></ProtectedRoute>} />
            <Route path="/company/applications" element={<ProtectedRoute allowedRoles={['EMPRESA']}><CompanyApplicationsPage /></ProtectedRoute>} />
            <Route path="/company/reports" element={<ProtectedRoute allowedRoles={['EMPRESA']}><ReportsPage /></ProtectedRoute>} />
            <Route path="/company/graduates/:id" element={<ProtectedRoute allowedRoles={['EMPRESA']}><GraduateDetailPage /></ProtectedRoute>} />
            <Route path="/offers/:id" element={<ProtectedRoute><OfferDetailPage /></ProtectedRoute>} />
            <Route path="/offers/:id/edit" element={<ProtectedRoute allowedRoles={['ADMIN', 'EMPRESA']}><OfferEditPage /></ProtectedRoute>} />
            
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </NotificationProvider>
    </AuthProvider>
  );
}