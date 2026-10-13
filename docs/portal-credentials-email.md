# Portal credentials email

The Admin Portal Access tab sends saved credentials directly through EmailJS. No backend endpoint or app authentication headers are used for email delivery.

## Configure

Connect the sending mailbox in EmailJS and create an email template:

- To Email: {{to_email}}
- To Name (if available): {{to_name}}
- Subject: {{subject}}
- From Name: Operio Business
- From Email: your connected/verified sender
- Content: switch to HTML/source editing and enter {{{message_html}}} only.

The application generates the branded HTML and escapes client data before inserting it. Do not wrap message_html in double braces: that would display HTML as text.

Fill these existing entries in apps/admin/.env.local:

    VITE_EMAILJS_SERVICE_ID=
    VITE_EMAILJS_TEMPLATE_ID=
    VITE_EMAILJS_PUBLIC_KEY=
    VITE_PORTAL_SUPPORT_EMAIL=
    VITE_PORTAL_SUPPORT_PHONE=
    VITE_PORTAL_EMAIL_LOGO_URL=

The first three are required. Support details are optional; without them the email directs the client to their account manager. Set the logo URL to a publicly accessible HTTPS URL for the Operio logo. The fallback is /operia-logo.jpeg on the Admin origin; localhost assets will not load in a recipient's email.

Restart Vite after editing .env.local. Configure the same public variables in the Admin deployment and rebuild. Restrict allowed origins in the EmailJS dashboard to your Admin domains. Never put SMTP credentials or private provider keys in VITE_ variables.

## Use

Save a valid email, temporary password, and Enabled portal access. Click Send Credentials, review the recipient/template, then Send email. Unsaved changes must be saved first. Passwords are masked in the preview unless explicitly revealed; the email contains the saved password as requested. Delivery uses the portal URL https://operio-client.vercel.app.

The password is transmitted to EmailJS and the recipient mailbox. Use temporary passwords; existing password hashes cannot be used as login passwords. The email asks clients to change their password; this frontend change does not implement or enforce a first-login password reset.

## Backend migration

Replace the feature API function in clientCredentialsEmail.api.js and its configuration check when the authenticated backend contract is available. The production backend should authorize the operator, rate-limit requests, and generate temporary credentials or one-time setup links. Browser configuration alone is not an authorization boundary for sending.

References: https://www.emailjs.com/docs/rest-api/send/ and https://www.emailjs.com/docs/faq/can-i-send-html-from-my-code/
