# Portal credentials email

The Admin Portal Access tab sends saved credentials directly through EmailJS. No backend endpoint or app authentication headers are used for email delivery.

## Configure

Connect the sending mailbox in EmailJS and create an email template:

- To Email: {{to_email}}
- To Name (if available): {{to_name}}
- Subject: Welcome to Operio, {{name}}! (or {{subject}}; the application sends the same personalized subject)
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

The first three are required. Support details are optional. Preview and delivery use the same public logo URL. VITE_PORTAL_EMAIL_LOGO_URL is no longer used.

### Public logo and company profile

- Logo: https://operio-admin.vercel.app/operia-logo.jpeg
- PDF download: https://operio-admin.vercel.app/OPERIO_Company_Profile.pdf

The email displays the hosted logo and includes a View / Download Company Profile link. The PDF is linked, not attached. No paid attachment feature, CID, or Base64 file payload is used.

Remove any previously configured static or variable attachments from the EmailJS template. Keep Content set to {{{message_html}}} and To Email set to {{to_email}}.

Both URLs must remain publicly accessible. Some email clients block remote images until the recipient allows them. The PDF link opens the hosted document for viewing or saving.

Restart Vite after editing .env.local. Configure the same public variables in the Admin deployment and rebuild. Restrict allowed origins in the EmailJS dashboard to your Admin domains. Never put SMTP credentials or private provider keys in VITE_ variables.

## Use

If EmailJS returns "The recipients address is empty", open the template whose ID matches
`VITE_EMAILJS_TEMPLATE_ID` and set its **To Email** field to `{{to_email}}`, then save it.
The application sends the saved Portal Access email as `template_params.to_email`.
Putting this variable only in the email body does not configure the recipient.
A different variable such as `{{email}}` or `{{recipient_email}}` will resolve to an
empty value because the application does not send those parameters.
Changing the hosted template alone does not require rebuilding the app; changing
the template ID in the environment does require restarting Vite or rebuilding.

Save a valid email, temporary password, and Enabled portal access. Click Send Credentials, review the recipient/template, then Send email. Unsaved changes must be saved first. Passwords are masked in the preview unless explicitly revealed; the email contains the saved password as requested. Delivery uses the portal URL https://operio-client.vercel.app.

The password is transmitted to EmailJS and the recipient mailbox. Use temporary passwords; existing password hashes cannot be used as login passwords. The email asks clients to change their password; this frontend change does not implement or enforce a first-login password reset.

## Backend migration

Replace the feature API function in clientCredentialsEmail.api.js and its configuration check when the authenticated backend contract is available. The production backend should authorize the operator, rate-limit requests, and generate temporary credentials or one-time setup links. Browser configuration alone is not an authorization boundary for sending.

References: https://www.emailjs.com/docs/rest-api/send/ and https://www.emailjs.com/docs/faq/can-i-send-html-from-my-code/
