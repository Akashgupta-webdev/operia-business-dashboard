import { clientCredentialsSchema } from "../schemas/clientCredentials.schema";

const env = import.meta.env;

export const credentialsEmailSettings = {
  serviceId: env.VITE_EMAILJS_SERVICE_ID?.trim(),
  templateId: env.VITE_EMAILJS_TEMPLATE_ID?.trim(),
  publicKey: env.VITE_EMAILJS_PUBLIC_KEY?.trim(),
  supportEmail: env.VITE_PORTAL_SUPPORT_EMAIL?.trim() || "",
  supportPhone: env.VITE_PORTAL_SUPPORT_PHONE?.trim() || "",
};

export const isCredentialsEmailConfigured = Boolean(
  credentialsEmailSettings.serviceId && credentialsEmailSettings.templateId && credentialsEmailSettings.publicKey,
);

export async function sendClientCredentialsEmail({ name, emailAddress, html }) {
  if (!isCredentialsEmailConfigured) throw new Error("Email delivery is not configured. Please contact your administrator.");
  const recipient = clientCredentialsSchema.extract("emailAddress").required().validate(emailAddress);
  if (recipient.error) throw new Error("A valid recipient email address is required. Save the client's email in Portal Access before sending.");
  // Use a separate transport: never forward the application's auth headers to EmailJS.
  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: credentialsEmailSettings.serviceId,
      template_id: credentialsEmailSettings.templateId,
      user_id: credentialsEmailSettings.publicKey,
      template_params: { to_name: name, to_email: recipient.value, subject: "Welcome to your Operio Client Portal", message_html: html },
    }),
  });
  if (!response.ok) {
    const reason = await response.text();
    if (/variables size|maximum allowed variables/i.test(reason)) {
      throw new Error("EmailJS rejected oversized template variables. Configure the logo and PDF as static attachments in the EmailJS template, not as Base64 variables.");
    }
    if (/recipients?['’]? address is empty/i.test(reason)) {
      throw new Error('EmailJS could not resolve the recipient. In the configured EmailJS template, set "To Email" to {{to_email}} and save the template.');
    }
    throw new Error(response.status === 429
      ? "Too many email requests. Please wait before trying again."
      : "Unable to send the credentials email. Please check the email service configuration and try again.");
  }
}
