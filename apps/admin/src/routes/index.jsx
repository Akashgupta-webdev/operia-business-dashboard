import { lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "../app/Layout";

const DashboardPage = lazy(() => import("@/features/dashboard/pages/DashboardPage"));
const ClientsPage = lazy(() => import("@/features/clients/pages/ClientsPage"));
const ClientDetailPage = lazy(() => import("@/features/clients/pages/ClientDetailPage"));
const AddNewClientPage = lazy(() => import("@/features/clients/pages/AddNewClientPage"));
const CompaniesPage = lazy(() => import("@/features/companies/pages/CompaniesPage"));
const FinancePage = lazy(() => import("@/features/finance/pages/FinancePage"));
const DocumentsPage = lazy(() => import("@/features/documents/pages/DocumentsPage"));
const TaxCompliancePage = lazy(() => import("@/features/tax-compliance/pages/TaxCompliancePage"));
const VisaEmployeesPage = lazy(() => import("@/features/visa-employees/pages/VisaEmployeesPage"));
const RenewalsPage = lazy(() => import("@/features/renewals/pages/RenewalsPage"));
const CalendarPage = lazy(() => import("@/features/calendar/pages/CalendarPage"));
const RemindersPage = lazy(() => import("@/features/reminders/pages/RemindersPage"));
const ReportsPage = lazy(() => import("@/features/reports/pages/ReportsPage"));
const SettingsPage = lazy(() => import("@/features/settings/pages/SettingsPage"));
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const NotFoundPage = lazy(() => import("@/app/NotFoundPage"));

export default function AppRoutes() {

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route
                    path="/"
                    element={<ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>}
                >
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/clients" element={<ClientsPage />} />
                    <Route path="/clients/new" element={<AddNewClientPage />} />
                    <Route path="/clients/:id" element={<ClientDetailPage />} />
                    <Route path="/companies" element={<CompaniesPage />} />
                    <Route path="/finance" element={<FinancePage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/documents" element={<DocumentsPage />} />
                    <Route path="/support-&-tasks" element={<RemindersPage />} />
                    <Route path="/renewals" element={<RenewalsPage />} />
                    <Route path="/calendars" element={<CalendarPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/tax-and-compliance" element={<TaxCompliancePage />} />
                    <Route path="/visa-and-employees" element={<VisaEmployeesPage />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    )
}
