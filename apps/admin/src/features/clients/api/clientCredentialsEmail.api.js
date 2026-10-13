const env = import.meta.env;

export const credentialsEmailSettings = {
  serviceId: env.VITE_EMAILJS_SERVICE_ID?.trim(),
  templateId: env.VITE_EMAILJS_TEMPLATE_ID?.trim(),
  publicKey: env.VITE_EMAILJS_PUBLIC_KEY?.trim(),
  supportEmail: env.VITE_PORTAL_SUPPORT_EMAIL?.trim() || "",
  supportPhone: env.VITE_PORTAL_SUPPORT_PHONE?.trim() || "",
  logoUrl: env.VITE_PORTAL_EMAIL_LOGO_URL?.trim() || "",
};

export const isCredentialsEmailConfigured = Boolean(
  credentialsEmailSettings.serviceId && credentialsEmailSettings.templateId && credentialsEmailSettings.publicKey,
);

export async function sendClientCredentialsEmail({ name, emailAddress, html }) {
  if (!isCredentialsEmailConfigured) throw new Error("Email delivery is not configured. Please contact your administrator.");
  // Use a separate transport: never forward the application's auth headers to EmailJS.
  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: credentialsEmailSettings.serviceId,
      template_id: credentialsEmailSettings.templateId,
      user_id: credentialsEmailSettings.publicKey,
      template_params: { to_name: name, to_email: emailAddress, subject: "Welcome to your Operio Client Portal", message_html: html },
    }),
  });
  if (!response.ok) throw new Error(response.status === 429
    ? "Too many email requests. Please wait before trying again."
    : "Unable to send the credentials email. Please check the email service configuration and try again.");
}
