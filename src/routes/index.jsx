import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "../pages/Layout";

const DashboardPage = lazy(() => import("@/pages/dashboard/DashboardPage"));
const ClientsPage = lazy(() => import("@/pages/clients/ClientsPage"));
const ClientDetailPage = lazy(() => import("@/pages/clients/ClientDetailPage"));
const CompaniesPage = lazy(() => import("@/pages/companies/CompaniesPage"));
const ServicesPage = lazy(() => import("@/pages/services/ServicesPage"));
const DocumentsPage = lazy(() => import("@/pages/documents/DocumentsPage"));
const TaxCompliancePage = lazy(() => import("@/pages/tax-and-compliance/TaxCompliancePage"));
const VisaEmployeesPage = lazy(() => import("@/pages/visa-and-employees/VisaEmployeesPage"));
const RenewalsPage = lazy(() => import("@/pages/renewals/RenewalsPage"));
const CalendarPage = lazy(() => import("@/pages/calendar/CalendarPage"));
const RemindersPage = lazy(() => import("@/pages/reminders/RemindersPage"));
const ReportsPage = lazy(() => import("@/pages/reports/ReportsPage"));
const SettingsPage = lazy(() => import("@/pages/settings/SettingsPage"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

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
                    <Route path="/clients/:id" element={<ClientDetailPage />} />
                    <Route path="/companies" element={<CompaniesPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/documents" element={<DocumentsPage />} />
                    <Route path="/reminders" element={<RemindersPage />} />
                    <Route path="/renewals" element={<RenewalsPage />} />
                    <Route path="/calendars" element={<CalendarPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/tax-and-compliance" element={<TaxCompliancePage />} />
                    <Route path="/visa-and-employees" element={<VisaEmployeesPage />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    )
}