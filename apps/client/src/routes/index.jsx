import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from '@/app/Layout';
import NotFoundPage from '@/app/NotFoundPage';
import SuspenseLoader from '@/components/suspense-loader';
import ProtectedRoute from './ProtectedRoute';

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const CompanyPage = lazy(() => import('@/features/company/pages/CompanyPage'));
const ApplicationsPage = lazy(() => import('@/features/applications/pages/ApplicationsPage'));
const DocumentsPage = lazy(() => import('@/features/documents/pages/DocumentsPage'));
const RenewalsPage = lazy(() => import('@/features/renewals/pages/RenewalsPage'));
const SupportPage = lazy(() => import('@/features/support/pages/SupportPage'));
const NotificationsPage = lazy(() => import('@/features/notifications/pages/NotificationsPage'));
const ProfilePage = lazy(() => import('@/features/profile/pages/ProfilePage'));

export default function AppRoutes() {
  return <Suspense fallback={<SuspenseLoader />}><Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<ProtectedRoute />}><Route element={<Layout />}>
      <Route index element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/my-company" element={<CompanyPage />} />
      <Route path="/my-applications" element={<ApplicationsPage />} />
      <Route path="/my-documents" element={<DocumentsPage />} />
      <Route path="/renewals" element={<RenewalsPage />} />
      <Route path="/requests-support" element={<SupportPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route></Route>
  </Routes></Suspense>;
}
