# Admin feature migration

The Admin application now owns business code under features. This migration moves 101 existing files and replaces the global client service with resource APIs. Existing working-tree changes to shared UI, Client, and AGENTS.md were preserved.

## Structure

```text
apps/admin/src/
  app/                 Layout, NotFoundPage, configured HTTP client
  components/          Application navigation and reusable presentation
  features/
    auth/              api, hooks, constants, schemas, pages
    clients/           api, hooks, components, constants, schemas, utils, pages
    companies/         api, hooks, components, constants, pages
    dashboard/         api, hooks, components, constants, schemas, pages
    finance/           api, hooks, components, constants, schemas, pages
    renewals/          api, hooks, components, constants, utils, pages
    services/          api, hooks, constants, existing schema placeholder
    calendar/          pages
    documents/         pages
    reminders/         pages
    reports/           pages
    settings/          pages
    tax-compliance/    pages
    visa-employees/    pages
  hooks/               useDebouncedValue (cross-feature)
  routes/              Existing routes and authentication guard
  store/               Existing Redux store
  assets/
  main.jsx
packages/api/
  src/client.js        createApiClient
  src/interceptors.js  installAuthRefreshInterceptor
  src/index.js         Public package exports
  tests/               Refresh transport regression tests
packages/ui/           Existing shared UI primitives and styles
packages/utils/        Unchanged; no speculative shared helpers added
```

## HTTP ownership

Axios is now a dependency of @operio/api. The package exports a client factory and a configurable refresh interceptor so each app can supply its own environment and authentication policy. It does not import an application or define business endpoints.

Admin configures its singleton in src/app/apiClient.js. This preserves the base URL trailing slash, 10-second timeout, Accept header, cookies, original request retry, concurrent refresh deduplication, login/refresh exclusions, and auth:unauthorized event. The existing transport refresh URL /auth/refresh is intentionally retained even though the explicit auth API uses /api/v1/auth/refresh. Confirm that discrepancy with the backend in a separate change.

The old service's 37 methods are now named exports in 14 files:

| Feature | API files |
| --- | --- |
| clients | clients, companies, documents, drivers, members, vehicles, services, related-records |
| auth | auth |
| companies | companies |
| dashboard | dashboard |
| finance | finance |
| renewals | renewals |
| services | services |

Each filename ends in .api.js. Endpoints, methods, encoded IDs, parameters, payloads, multipart handling, and returned Axios responses are retained. Existing hooks retain their response extraction, fallback values, retry rules, placeholder data, and success lifecycle behavior.

## Query ownership and compatibility

| Factory | Existing roots retained |
| --- | --- |
| clientKeys | ["clients"], ["client-detail"] |
| authKeys | ["auth", "session"], ["client", "me"] |
| companyKeys | ["client-companies"] |
| dashboardKeys | ["client-dashboard-kpi"] |
| financeKeys | ["profit-loss"], ["profit-loss", "revenue-inflow"] |
| renewalKeys | ["client-renewals"] |
| serviceKeys | ["services"] |

Client lists and details deliberately remain separate cache roots. Finance root invalidation still includes revenue inflows. Auth's two existing session caches remain distinct. The dormant useCreateService hook previously imported a nonexistent constants/ServicesPage module; it now uses serviceKeys.all. There was no functioning previous key definition to preserve for that unused hook.

Directory-wide company queries belong to companies; global renewal queries belong to renewals; dashboard KPI queries belong to dashboard. Client detail renewal transformations and dialogs remain with clients. useCurrentClient belongs to auth because it reads the authentication session endpoint.

## Verification

- Admin production builds passed after HTTP extraction, Clients migration/API split, and remaining domain/query-key migration.
- Client production build passes; Client lint passes.
- 44 regression tests pass: 37 original request contracts, multipart handling, query key values and invalidation scope, and refresh concurrency/failure/retry behavior.
- Compared 109 existing module implementations to the starting working tree after normalizing imports, service references, and query factory expressions: no other implementation changes.
- All 18 route declarations retain their original paths. All local imports resolve across 133 Admin source modules; no runtime import cycles found. Type-only imports are excluded from cycle detection.
- Shared packages do not import application code.
- Admin lint still reports the same 11 pre-existing errors: unused cn/isOnline in Layout; unused React imports in NotFound and six placeholder pages; unused Joi in the service schema placeholder; missing react/prop-types rule in ProtectedRoute.
- Existing build warnings remain: Admin's large main chunk; Client's Tailwind directives are not processed by its current Vite configuration (which only configures React).
- Live authenticated backend workflows, rendered dialogs, and browser console behavior were not exercised. Contract tests use synthetic fixtures and make no network calls.

Run from the repository root (tests use the supplied Node 24 runtime and its module hooks):

```sh
npm run test:admin
npm run test:api
npm run build:admin
npm run build:client
npm run lint:admin
npm run lint:client
```

## Remaining work

No requested domain was left in the old global folders. Generic useDebouncedValue, application components, routes, Redux, and assets intentionally remain outside features. No UI redesign or intentional active-workflow change was made.

Address existing lint failures and Client Tailwind configuration separately. Confirm the refresh URL contract and add authenticated browser smoke coverage. Keep future Client features independent and reuse the HTTP factory when Client actually needs API transport. Empty or minimal existing pages and the service schema placeholder were preserved without inventing functionality.

## File moves

Paths below are relative to apps/admin/src. These are real filesystem renames with imports updated; the old service was split rather than moved.

| Before | After |
| --- | --- |
| config/axios.js | app/apiClient.js |
| constants/auth.js | features/auth/constants/auth.js |
| constants/client.js | features/clients/constants/client.js |
| constants/dashboard.js | features/dashboard/constants/dashboard.js |
| constants/finance.js | features/finance/constants/finance.js |
| constants/renewals.js | features/renewals/constants/renewals.js |
| hooks/useAddClientDocument.js | features/clients/hooks/useAddClientDocument.js |
| hooks/useAuthSession.js | features/auth/hooks/useAuthSession.js |
| hooks/useClient.js | features/clients/hooks/useClient.js |
| hooks/useClientCompanies.js | features/companies/hooks/useClientCompanies.js |
| hooks/useClientDashboardKPI.js | features/dashboard/hooks/useClientDashboardKPI.js |
| hooks/useClientRenewals.js | features/renewals/hooks/useClientRenewals.js |
| hooks/useClients.js | features/clients/hooks/useClients.js |
| hooks/useCreateClient.js | features/clients/hooks/useCreateClient.js |
| hooks/useCreateClientDriver.js | features/clients/hooks/useCreateClientDriver.js |
| hooks/useCreateClientMember.js | features/clients/hooks/useCreateClientMember.js |
| hooks/useCreateClientService.js | features/clients/hooks/useCreateClientService.js |
| hooks/useCreateClientVehicle.js | features/clients/hooks/useCreateClientVehicle.js |
| hooks/useCreateExpense.js | features/finance/hooks/useCreateExpense.js |
| hooks/useCreateService.js | features/services/hooks/useCreateService.js |
| hooks/useCurrentClient.js | features/auth/hooks/useCurrentClient.js |
| hooks/useDeleteClientDocument.js | features/clients/hooks/useDeleteClientDocument.js |
| hooks/useDeleteClientRelatedRecord.js | features/clients/hooks/useDeleteClientRelatedRecord.js |
| hooks/useDeleteClientService.js | features/clients/hooks/useDeleteClientService.js |
| hooks/useProfitLoss.js | features/finance/hooks/useProfitLoss.js |
| hooks/useRevenueInflows.js | features/finance/hooks/useRevenueInflows.js |
| hooks/useUpdateClient.js | features/clients/hooks/useUpdateClient.js |
| hooks/useUpdateClientCompany.js | features/clients/hooks/useUpdateClientCompany.js |
| hooks/useUpdateClientDriver.js | features/clients/hooks/useUpdateClientDriver.js |
| hooks/useUpdateClientMember.js | features/clients/hooks/useUpdateClientMember.js |
| hooks/useUpdateClientService.js | features/clients/hooks/useUpdateClientService.js |
| hooks/useUpdateClientVehicle.js | features/clients/hooks/useUpdateClientVehicle.js |
| lib/clientCompanyUpdate.js | features/clients/utils/clientCompanyUpdate.js |
| lib/clientCreation.js | features/clients/utils/clientCreation.js |
| lib/clientDriverUpdate.js | features/clients/utils/clientDriverUpdate.js |
| lib/clientMemberUpdate.js | features/clients/utils/clientMemberUpdate.js |
| lib/clientRelatedCreate.js | features/clients/utils/clientRelatedCreate.js |
| lib/clientRenewals.js | features/clients/utils/clientRenewals.js |
| lib/clientServiceCreate.js | features/clients/utils/clientServiceCreate.js |
| lib/clientServiceUpdate.js | features/clients/utils/clientServiceUpdate.js |
| lib/clientUpdate.js | features/clients/utils/clientUpdate.js |
| lib/clientVehicleUpdate.js | features/clients/utils/clientVehicleUpdate.js |
| lib/renewals.js | features/renewals/utils/renewals.js |
| pages/auth/LoginPage.jsx | features/auth/pages/LoginPage.jsx |
| pages/calendar/CalendarPage.jsx | features/calendar/pages/CalendarPage.jsx |
| pages/clients/AddNewClientPage.jsx | features/clients/pages/AddNewClientPage.jsx |
| pages/clients/ClientDetailPage.jsx | features/clients/pages/ClientDetailPage.jsx |
| pages/clients/ClientsPage.jsx | features/clients/pages/ClientsPage.jsx |
| pages/clients/components/client-detail/AddDocumentDialog.jsx | features/clients/components/client-detail/AddDocumentDialog.jsx |
| pages/clients/components/client-detail/AddRelatedRecordDialogs.jsx | features/clients/components/client-detail/AddRelatedRecordDialogs.jsx |
| pages/clients/components/client-detail/AddServiceDialog.jsx | features/clients/components/client-detail/AddServiceDialog.jsx |
| pages/clients/components/client-detail/ClientProfileCard.jsx | features/clients/components/client-detail/ClientProfileCard.jsx |
| pages/clients/components/client-detail/CompaniesTab.jsx | features/clients/components/client-detail/CompaniesTab.jsx |
| pages/clients/components/client-detail/CreateRelatedRecordDialog.jsx | features/clients/components/client-detail/CreateRelatedRecordDialog.jsx |
| pages/clients/components/client-detail/DeleteDocumentDialog.jsx | features/clients/components/client-detail/DeleteDocumentDialog.jsx |
| pages/clients/components/client-detail/DeleteRelatedRecordDialog.jsx | features/clients/components/client-detail/DeleteRelatedRecordDialog.jsx |
| pages/clients/components/client-detail/DeleteServiceDialog.jsx | features/clients/components/client-detail/DeleteServiceDialog.jsx |
| pages/clients/components/client-detail/DocumentsTab.jsx | features/clients/components/client-detail/DocumentsTab.jsx |
| pages/clients/components/client-detail/EditClientDialog.jsx | features/clients/components/client-detail/EditClientDialog.jsx |
| pages/clients/components/client-detail/EditClientFields.jsx | features/clients/components/client-detail/EditClientFields.jsx |
| pages/clients/components/client-detail/EditCompanyDialog.jsx | features/clients/components/client-detail/EditCompanyDialog.jsx |
| pages/clients/components/client-detail/EditDriverDialog.jsx | features/clients/components/client-detail/EditDriverDialog.jsx |
| pages/clients/components/client-detail/EditMemberDialog.jsx | features/clients/components/client-detail/EditMemberDialog.jsx |
| pages/clients/components/client-detail/EditServiceDialog.jsx | features/clients/components/client-detail/EditServiceDialog.jsx |
| pages/clients/components/client-detail/EditVehicleDialog.jsx | features/clients/components/client-detail/EditVehicleDialog.jsx |
| pages/clients/components/client-detail/OverviewTab.jsx | features/clients/components/client-detail/OverviewTab.jsx |
| pages/clients/components/client-detail/RelatedRecordFormFields.jsx | features/clients/components/client-detail/RelatedRecordFormFields.jsx |
| pages/clients/components/client-detail/RenewalsTab.jsx | features/clients/components/client-detail/RenewalsTab.jsx |
| pages/clients/components/client-detail/RenewalUpdateDialog.jsx | features/clients/components/client-detail/RenewalUpdateDialog.jsx |
| pages/clients/components/client-detail/ServicesTab.jsx | features/clients/components/client-detail/ServicesTab.jsx |
| pages/clients/components/client-detail/TaskActionsTab.jsx | features/clients/components/client-detail/TaskActionsTab.jsx |
| pages/clients/components/ClientResults.jsx | features/clients/components/ClientResults.jsx |
| pages/clients/components/create-client/ClientSetupSidebar.jsx | features/clients/components/create-client/ClientSetupSidebar.jsx |
| pages/clients/components/create-client/ClientSetupSteps.jsx | features/clients/components/create-client/ClientSetupSteps.jsx |
| pages/clients/components/create-client/WizardFields.jsx | features/clients/components/create-client/WizardFields.jsx |
| pages/companies/CompaniesPage.jsx | features/companies/pages/CompaniesPage.jsx |
| pages/companies/components/CompanyDirectory.jsx | features/companies/components/CompanyDirectory.jsx |
| pages/dashboard/components/DashboardPagination.jsx | features/dashboard/components/DashboardPagination.jsx |
| pages/dashboard/components/KpiDashboardSections.jsx | features/dashboard/components/KpiDashboardSections.jsx |
| pages/dashboard/DashboardPage.jsx | features/dashboard/pages/DashboardPage.jsx |
| pages/documents/DocumentsPage.jsx | features/documents/pages/DocumentsPage.jsx |
| pages/finance/components/ProfitLossStatement.jsx | features/finance/components/ProfitLossStatement.jsx |
| pages/finance/components/RecordExpenseDialog.jsx | features/finance/components/RecordExpenseDialog.jsx |
| pages/finance/components/RevenueInflows.jsx | features/finance/components/RevenueInflows.jsx |
| pages/finance/FinancePage.jsx | features/finance/pages/FinancePage.jsx |
| pages/Layout.jsx | app/Layout.jsx |
| pages/NotFoundPage.jsx | app/NotFoundPage.jsx |
| pages/reminders/RemindersPage.jsx | features/reminders/pages/RemindersPage.jsx |
| pages/renewals/components/RenewalFilters.jsx | features/renewals/components/RenewalFilters.jsx |
| pages/renewals/components/RenewalPagination.jsx | features/renewals/components/RenewalPagination.jsx |
| pages/renewals/components/RenewalTable.jsx | features/renewals/components/RenewalTable.jsx |
| pages/renewals/RenewalsPage.jsx | features/renewals/pages/RenewalsPage.jsx |
| pages/reports/ReportsPage.jsx | features/reports/pages/ReportsPage.jsx |
| pages/settings/SettingsPage.jsx | features/settings/pages/SettingsPage.jsx |
| pages/tax-and-compliance/TaxCompliancePage.jsx | features/tax-compliance/pages/TaxCompliancePage.jsx |
| pages/visa-and-employees/VisaEmployeesPage.jsx | features/visa-employees/pages/VisaEmployeesPage.jsx |
| validator/auth.js | features/auth/schemas/auth.schema.js |
| validator/client.js | features/clients/schemas/client.schema.js |
| validator/dashboard.js | features/dashboard/schemas/dashboard.schema.js |
| validator/finance.js | features/finance/schemas/finance.schema.js |
| validator/service.js | features/services/schemas/service.schema.js |
