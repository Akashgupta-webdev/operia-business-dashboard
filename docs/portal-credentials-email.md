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

The first three are required. Support details are optional. The preview uses the local logo; delivery uses cid:operia-logo.jpeg. VITE_PORTAL_EMAIL_LOGO_URL is no longer used.

### Required static attachments

In the EmailJS template's Attachments tab:

1. Remove the old Variable Attachment entries named operio_logo and company_profile.
2. Add a Static Attachment: upload apps/admin/public/operia-logo.jpeg. Keep the exact filename operia-logo.jpeg (case sensitive).
3. Add a Static Attachment: upload apps/admin/public/OPERIO_Company_Profile.pdf.
4. Save the template. Keep Content set to {{{message_html}}} and To Email set to {{to_email}}.

EmailJS automatically includes these files with every email using this template. The request sends only recipient, subject and HTML variables, avoiding the 50 KB limit caused by Base64 file data. The PDF is a downloadable attachment; the logo is embedded using cid:operia-logo.jpeg.

Your plan must support static attachments and their combined file size. Re-upload the hosted copies when changing either public asset. The frontend cannot verify the hosted attachment configuration.

References: https://www.emailjs.com/docs/user-guide/file-attachments/ and https://www.emailjs.com/docs/user-guide/embedded-images/

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
