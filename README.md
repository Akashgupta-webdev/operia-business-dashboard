# Single Super Admin CRM Website – Final Workflow

This CRM will be used **only by you as Super Admin**. There will be no staff, manager, or client login.

The entire system should be **client-centric**:

> Create Client → Add Company → Select Services → Upload Documents → Track Deadlines → Receive Reminders → Renew or Complete Service

---

## 1. Super Admin Login

Only one secure admin panel will be available.

### Features

* Secure email and password login
* Forgot password
* Change password
* Login activity history
* Automatic logout after inactivity
* Backup and restore database
* No user-role or employee-access module

---

# 2. Main Dashboard

After login, the dashboard should immediately show your pending and upcoming work.

## Dashboard Summary Cards

* Total Clients
* Total Companies
* Active Services
* Pending Applications
* Documents Expiring Soon
* Expired Documents
* Upcoming VAT Filings
* Upcoming Corporate Tax Filings
* Visa Expiries
* Insurance Expiries
* Overdue Work
* Completed Services

## Upcoming Actions Section

Example:

| Client        | Company         | Action Required          | Due Date    | Status   |
| ------------- | --------------- | ------------------------ | ----------- | -------- |
| Ahmed Khan    | ABC Trading LLC | VAT Filing               | 28 Aug 2026 | Due Soon |
| Mohammed Ali  | XYZ Services    | Trade Licence Renewal    | 5 Sep 2026  | Pending  |
| Sara Ahmed    | —               | Health Insurance Renewal | 10 Sep 2026 | Due Soon |
| Tech Line LLC | Tech Line LLC   | Corporate Tax Filing     | 30 Sep 2026 | Pending  |

## Dashboard Filters

* Today
* This Week
* This Month
* Overdue
* Expiring in 30 Days
* Expiring in 60 Days
* Expiring in 90 Days
* Service Type
* Client
* Company
* Status

---

# 3. Client Database

Whenever someone takes any service from you, first create their **Client Record**.

## Client Details

* Client ID — automatically generated
* Client type:

  * Individual
  * Company
* Full name
* Mobile number
* WhatsApp number
* Email address
* Nationality
* Emirates ID number
* Passport number
* Address
* Preferred communication method
* Notes
* Client status:

  * Active
  * Inactive
  * Prospect
  * Archived
* Date added
* Last updated

## Client Profile Page

Every client should have one main profile containing:

* Personal information
* Connected companies
* Services taken
* Uploaded documents
* Upcoming renewals
* VAT and tax filings
* Visa and insurance records
* Notes
* Complete activity history

This means you do not need to search through different sections. Everything related to that client will be available in one place.

---

# 4. Company Database

One client may have one or multiple companies.

## Company Details

* Company ID
* Company name
* Trade name
* Legal name
* Company type
* Mainland or Free Zone
* Free Zone name
* Licence number
* Licence activity
* Licence issue date
* Licence expiry date
* Establishment Card number
* Establishment Card expiry date
* VAT TRN number
* Corporate Tax Registration number
* Company email
* Company mobile number
* Registered address
* Bank name
* Account name
* IBAN
* Account number
* Company status:

  * Active
  * Under Formation
  * Suspended
  * Expired
  * Closed
* Notes

## Company Owners and Signatories

Multiple owners or authorised signatories can be added.

* Full name
* Designation
* Ownership percentage
* Emirates ID
* Passport
* Mobile number
* Email
* Authorised signatory status
* Signature Card status
* Signature Card activation date
* Signature Card expiry date

---

# 5. Service Management

A client can take one or several services. Each service should have its own record and workflow.

## Main Service Categories

### Company Documents

* Trade Licence
* VAT Registration
* Corporate Tax Registration
* Establishment Card
* Signature Card
* Signature Card Activation
* Bank Account Assistance

### Tax and Compliance

* Quarterly VAT Filing
* VAT Registration
* VAT Deregistration
* VAT Payment Tracking
* Corporate Tax Registration
* Annual Corporate Tax Filing
* Corporate Tax Payment Tracking
* Tax Certificate
* Filing Amendment
* Filing Acknowledgement

### Visa and Employee Services

* Investor Visa
* Partner Visa
* Employee Visa
* Visa Renewal
* Visa Cancellation
* Status Change
* Medical Test
* Emirates ID
* Health Insurance
* Typing Services
* Beneficiary Update
* ILOE Insurance
* Immigration and Labour Services

---

# 6. Client Service Record

Whenever a client takes a service, create a separate **Service Record**.

## Service Record Fields

* Service reference number
* Client name
* Company name
* Service category
* Service name
* Service start date
* Expected completion date
* Actual completion date
* Government fee
* Service fee
* Total amount
* Payment status:

  * Unpaid
  * Partially Paid
  * Paid
* Current service status:

  * New
  * Documents Required
  * Documents Received
  * Under Review
  * Application Submitted
  * Payment Pending
  * Under Process
  * Additional Documents Required
  * Approved
  * Rejected
  * Completed
  * Cancelled
* Application number
* Reference number
* Authority or department
* Notes
* Supporting documents
* Completion document
* Renewal required:

  * Yes
  * No
* Next renewal date

---

# 7. Document Management

Every document should be saved under the relevant client or company.

## Document Types

* Trade Licence
* VAT Certificate
* Corporate Tax Certificate
* Tax Registration Certificate
* Establishment Card
* Signature Card
* Memorandum of Association
* Certificate of Incorporation
* Share Certificate
* Emirates ID
* Passport
* Visa
* Medical Certificate
* Emirates ID Application
* Health Insurance Card
* ILOE Certificate
* Bank Account Letter
* IBAN Certificate
* Bank Statement
* Filing Acknowledgement
* Payment Receipt
* Other Documents

## Document Record Fields

* Document name
* Document category
* Client
* Company
* Employee or owner
* Document number
* Issue date
* Expiry date
* Issuing authority
* Uploaded PDF, JPG, or PNG
* Current status:

  * Valid
  * Expiring Soon
  * Expired
  * Renewal in Progress
  * Renewed
  * Cancelled
* Renewal required:

  * Yes
  * No
* Reminder date
* Notes
* Previous version
* Latest version
* Upload date
* Last updated date

---

# 8. Document Renewal Flow

Example: Trade Licence Renewal

```text
Trade Licence uploaded
        ↓
Expiry date entered
        ↓
System creates renewal reminders
        ↓
90 days before expiry – Upcoming
        ↓
60 days before expiry – Reminder
        ↓
30 days before expiry – Due Soon
        ↓
7 days before expiry – Urgent
        ↓
Expiry date passed – Expired
        ↓
Renewal service created
        ↓
New licence uploaded
        ↓
Old licence moved to Document History
        ↓
New expiry date saved
```

The old document should never be deleted. It should remain available under **Document History**.

---

# 9. VAT Filing Flow

VAT filing is usually recurring, so the CRM should automatically create the next filing period.

## VAT Profile

* Client
* Company
* VAT TRN
* VAT registration date
* Filing frequency:

  * Monthly
  * Quarterly
* First tax period
* Tax period start date
* Tax period end date
* Filing due date
* VAT group status
* FTA login reference
* Notes

## VAT Filing Record

* Tax period
* Filing start date
* Filing end date
* Due date
* Sales amount
* Purchase amount
* Output VAT
* Input VAT
* VAT payable
* VAT refundable
* Payment due date
* Filing status:

  * Upcoming
  * Documents Required
  * Accounts Under Review
  * Return Prepared
  * Client Approval Pending
  * Submitted
  * Payment Pending
  * Paid
  * Overdue
  * Amended
* Filing acknowledgement
* Payment receipt
* Notes

## VAT Filing Workflow

```text
Company VAT profile created
        ↓
Quarterly filing periods automatically generated
        ↓
Reminder appears before filing due date
        ↓
Collect invoices and bank statements
        ↓
Mark documents as received
        ↓
Prepare VAT return
        ↓
Submit VAT return
        ↓
Upload acknowledgement
        ↓
Record VAT payable or refundable
        ↓
Update payment status
        ↓
Next VAT period automatically created
```

## VAT Reminder Rules

* 30 days before due date
* 15 days before due date
* 7 days before due date
* 3 days before due date
* On due date
* Daily after the due date until completed

---

# 10. Corporate Tax Filing Flow

Corporate Tax should be linked with the company’s financial year.

## Corporate Tax Profile

* Corporate Tax Registration number
* Financial year start date
* Financial year end date
* Registration date
* First tax period
* Return due date
* Tax group status
* Small Business Relief status
* Notes

## Corporate Tax Filing Record

* Tax period
* Financial year
* Filing due date
* Accounting records received
* Financial statements received
* Tax computation prepared
* Taxable income
* Tax payable
* Filing status
* Payment status
* Filing acknowledgement
* Payment receipt
* Notes

## Corporate Tax Workflow

```text
Corporate Tax profile created
        ↓
Financial year entered
        ↓
Annual return due date generated
        ↓
System sends advance reminders
        ↓
Documents collected
        ↓
Tax calculation prepared
        ↓
Return submitted
        ↓
Acknowledgement uploaded
        ↓
Payment status updated
        ↓
Next annual filing record generated
```

## Corporate Tax Reminder Rules

* 120 days before due date
* 90 days before due date
* 60 days before due date
* 30 days before due date
* 15 days before due date
* 7 days before due date
* On due date
* Overdue reminder

---

# 11. Visa and Employee Database

A company can have multiple employees, partners, investors, and dependants.

## Employee or Individual Record

* Full name
* Employee ID
* Company
* Designation
* Nationality
* Date of birth
* Gender
* Mobile number
* Email
* Passport number
* Passport expiry date
* Visa type
* Visa number
* Visa issue date
* Visa expiry date
* Emirates ID number
* Emirates ID expiry date
* Medical status
* Insurance provider
* Insurance policy number
* Insurance expiry date
* ILOE policy number
* ILOE expiry date
* Beneficiary details
* Current status:

  * Active
  * Visa Under Process
  * Renewal Due
  * Cancelled
  * Left Company

---

# 12. Visa Processing Flow

```text
Client or employee record created
        ↓
Visa service selected
        ↓
Required document checklist generated
        ↓
Documents uploaded
        ↓
Application submitted
        ↓
Entry permit or status change
        ↓
Medical test
        ↓
Emirates ID application
        ↓
Health insurance
        ↓
Visa approval
        ↓
Visa and Emirates ID uploaded
        ↓
Expiry reminders activated
```

## Visa Status Options

* New Request
* Documents Pending
* Application Submitted
* Entry Permit Issued
* Status Change Pending
* Medical Pending
* Medical Completed
* Emirates ID Pending
* Insurance Pending
* Visa Approved
* Completed
* Rejected
* Cancelled

---

# 13. Health Insurance Flow

```text
Client or employee selected
        ↓
Insurance service created
        ↓
Required documents uploaded
        ↓
Quotation received
        ↓
Plan selected
        ↓
Payment completed
        ↓
Policy issued
        ↓
Policy document uploaded
        ↓
Policy expiry date saved
        ↓
Renewal reminders activated
```

## Insurance Record

* Insured person
* Company
* Insurance provider
* Plan name
* Policy number
* Policy start date
* Policy expiry date
* Premium
* Payment status
* Policy document
* Insurance card
* Renewal status
* Notes

---

# 14. ILOE Insurance Flow

* Employee selected
* ILOE category selected
* Policy number entered
* Policy start date
* Policy expiry date
* Certificate uploaded
* Payment receipt uploaded
* Renewal reminder created
* Renewal completed
* Previous certificate saved in history

---

# 15. Beneficiary Update Flow

```text
Client or employee selected
        ↓
Existing beneficiary details recorded
        ↓
New beneficiary details entered
        ↓
Supporting documents uploaded
        ↓
Request submitted
        ↓
Reference number recorded
        ↓
Request approved
        ↓
Updated acknowledgement uploaded
        ↓
Service marked completed
```

---

# 16. Automatic Reminder System

The system should automatically generate reminders based on expiry dates and due dates.

## Reminder Categories

* Trade Licence expiry
* Establishment Card expiry
* Signature Card expiry
* Passport expiry
* Visa expiry
* Emirates ID expiry
* Health Insurance expiry
* ILOE expiry
* VAT filing due
* VAT payment due
* Corporate Tax filing due
* Corporate Tax payment due
* Service follow-up
* Missing document follow-up

## Reminder Status

* Upcoming
* Due Soon
* Urgent
* Due Today
* Overdue
* Completed
* Snoozed
* Dismissed

## Suggested Reminder Schedule

| Type               | Reminder Schedule                     |
| ------------------ | ------------------------------------- |
| Trade Licence      | 90, 60, 30, 15, 7 and 1 day before    |
| Establishment Card | 60, 30, 15 and 7 days before          |
| Visa               | 60, 30, 15, 7 and 1 day before        |
| Emirates ID        | 60, 30, 15 and 7 days before          |
| Insurance          | 45, 30, 15 and 7 days before          |
| Passport           | 180, 90, 60 and 30 days before        |
| VAT Filing         | 30, 15, 7, 3 and 1 day before         |
| Corporate Tax      | 120, 90, 60, 30, 15 and 7 days before |

---

# 17. Renewal Management

A separate **Renewals Page** should show all upcoming renewals.

## Renewal Table

| Client      | Company     | Document/Service | Expiry Date | Days Remaining | Status   |
| ----------- | ----------- | ---------------- | ----------- | -------------: | -------- |
| Ahmed Khan  | ABC Trading | Trade Licence    | 15 Sep 2026 |             45 | Upcoming |
| XYZ LLC     | XYZ LLC     | VAT Filing       | 28 Aug 2026 |             27 | Due Soon |
| John Mathew | ABC Trading | Visa             | 10 Aug 2026 |              9 | Urgent   |

## Renewal Actions

* Start renewal
* Add follow-up note
* Update status
* Upload renewed document
* Change expiry date
* Mark completed
* Snooze reminder
* Create service record

---

# 18. Work Calendar

A calendar should display all important dates.

## Calendar Events

* Document expiries
* VAT filing dates
* Corporate Tax filing dates
* Visa expiries
* Insurance expiries
* Medical appointments
* Emirates ID appointments
* Application follow-ups
* Payment due dates

Calendar views:

* Daily
* Weekly
* Monthly
* List view

---

# 19. Global Search

You should be able to search using:

* Client name
* Company name
* Mobile number
* Email
* Licence number
* VAT TRN
* Corporate Tax number
* Emirates ID
* Passport number
* Visa number
* Policy number
* Application number
* Document number

---

# 20. Activity and Document History

Every client and company should maintain a complete timeline.

Example:

```text
01 Aug 2026 – Client created
02 Aug 2026 – Trade Licence uploaded
03 Aug 2026 – VAT Registration service started
06 Aug 2026 – Application submitted
10 Aug 2026 – VAT Certificate received
10 Aug 2026 – VAT Certificate uploaded
10 Aug 2026 – Quarterly VAT reminders activated
```

The system should record:

* What was added
* What was changed
* Previous status
* New status
* Document uploads
* Renewal completion
* Filing submission
* Notes
* Date and time

---

# 21. Recommended CRM Menu

```text
Dashboard

Clients
    ├── All Clients
    ├── Add Client
    └── Archived Clients

Companies
    ├── All Companies
    ├── Add Company
    └── Owners & Signatories

Services
    ├── All Services
    ├── New Service
    ├── Pending Services
    └── Completed Services

Documents
    ├── All Documents
    ├── Expiring Soon
    ├── Expired Documents
    └── Document History

Tax & Compliance
    ├── VAT Profiles
    ├── VAT Filings
    ├── Corporate Tax Profiles
    └── Corporate Tax Filings

Visa & Employees
    ├── Employees
    ├── Visa Applications
    ├── Emirates ID
    ├── Medical
    ├── Health Insurance
    ├── ILOE
    └── Beneficiary Updates

Renewals
    ├── Upcoming
    ├── Urgent
    ├── Overdue
    └── Completed

Calendar

Reminders

Reports

Settings
```

---

# 22. Core Database Structure

The developer should create separate but connected database tables:

1. `admin`
2. `clients`
3. `companies`
4. `company_owners`
5. `employees`
6. `service_categories`
7. `client_services`
8. `documents`
9. `document_versions`
10. `vat_profiles`
11. `vat_filings`
12. `corporate_tax_profiles`
13. `corporate_tax_filings`
14. `visa_applications`
15. `insurance_policies`
16. `iloe_policies`
17. `beneficiary_updates`
18. `renewals`
19. `reminders`
20. `payments`
21. `notes`
22. `activity_logs`

---

# Final Practical Example

Suppose **ABC Trading LLC** takes the following services from you:

* Trade Licence Renewal
* Quarterly VAT Filing
* Employee Visa
* Health Insurance

The CRM flow will be:

```text
Create Ahmed Khan as Client
        ↓
Create ABC Trading LLC under Ahmed Khan
        ↓
Upload Trade Licence, VAT Certificate and Establishment Card
        ↓
Add Trade Licence expiry date
        ↓
Create quarterly VAT periods
        ↓
Add employee and visa details
        ↓
Upload health insurance policy
        ↓
CRM automatically tracks all due dates
        ↓
Dashboard shows the next required action
        ↓
Renewed documents replace current versions
        ↓
Old documents remain available in history
```

The most important principle is:

> **One client profile should show every company, service, document, filing, employee, expiry date, reminder and history connected to that client.** ✅# operia-business-dashboard
