const PORTAL_EMAIL_LOGO_URL = "https://operio-admin.vercel.app/operia-logo.jpeg";
const COMPANY_PROFILE_URL = "https://operio-admin.vercel.app/OPERIO_Company_Profile.pdf";

export const CLIENT_PORTAL_URL = "https://operio-client.vercel.app";

const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[character]);

export function buildClientCredentialsEmail({ name, emailAddress, password, logoUrl = PORTAL_EMAIL_LOGO_URL, supportEmail = "", supportPhone = "" }) {
  const row = (label, value) => `<tr><td style="padding:14px 10px;border-bottom:1px solid #e4ebef;font-weight:bold;width:45%">${label}</td><td style="padding:14px 10px;border-bottom:1px solid #e4ebef;overflow-wrap:anywhere"><span style="display:block;background:#eaf0f5;padding:12px;border-radius:6px">${escapeHtml(value)}</span></td></tr>`;
  const support = supportEmail || supportPhone;
  const supportLink = supportEmail ? `mailto:${encodeURIComponent(supportEmail)}` : `tel:${supportPhone.replace(/[^+\d]/g, "")}`;
  const safeLogo = /^https?:\/\//.test(logoUrl || "") ? logoUrl : "";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Your Operio client portal</title></head>
<body style="margin:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#092347">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:20px 10px">
<table role="presentation" width="680" cellspacing="0" cellpadding="0" style="width:100%;max-width:680px;background:#fff;border-radius:12px;overflow:hidden">
<tr><td align="center" style="padding:20px;border-bottom:7px solid #00734d">${safeLogo ? `<img src="${escapeHtml(safeLogo)}" width="200" alt="Operio Business — Your business. Our responsibility." style="display:block;width:200px;max-width:100%;height:auto">` : '<h2 style="letter-spacing:6px;margin:12px">OPERIO</h2><p style="color:#00734d;letter-spacing:5px">BUSINESS</p>'}</td></tr>
<tr><td style="padding:28px 24px">
<h1 style="text-align:center;font-size:38px;line-height:1.15;margin:0 0 18px">Welcome to Your<br><span style="color:#006b46">Client Portal</span></h1>
<div style="width:64px;height:3px;background:#edb22b;margin:0 auto 24px"></div>
<p style="font-size:17px;line-height:1.6;color:#344054">Hello ${escapeHtml(name)},<br>your portal is ready. Use the details below to sign in and manage your services securely.</p>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5faf8;border:1px solid #d5eae3;border-radius:8px;font-size:15px;table-layout:fixed">${row("Client Name", name)}${row("Registered Email", emailAddress)}${row("Temporary Password", password)}</table>
<p style="background:#fff7e5;border:1px solid #faeccb;border-radius:8px;padding:18px;font-size:14px;line-height:1.6"><strong>For your security, change your password after your first login.<br>Never share your credentials.</strong></p>
<p style="text-align:center;margin:26px 0 12px"><a href="${CLIENT_PORTAL_URL}" target="_blank" style="display:inline-block;background:#092347;color:#fff;text-decoration:none;padding:18px 28px;border-radius:10px;font-size:18px;font-weight:bold">ACCESS YOUR PORTAL &rarr;</a></p>
<p style="text-align:center;font-size:14px"><a href="${CLIENT_PORTAL_URL}" target="_blank" style="color:#00734d">operio-client.vercel.app</a></p>
<p style="font-size:14px;line-height:1.6;color:#344054">Learn more about Operio and our services in our company profile.</p>
<p style="text-align:center;margin:18px 0"><a href="${COMPANY_PROFILE_URL}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:#00734d;color:#fff;text-decoration:none;padding:14px 22px;border-radius:8px;font-size:15px;font-weight:bold">VIEW / DOWNLOAD COMPANY PROFILE (PDF)</a></p>
<div style="background:#f3f6f9;border-radius:10px;padding:20px;margin-top:24px"><h2 style="margin:0 0 18px;font-size:25px">How to get started</h2>
${["Open the portal link above.", "Sign in using your registered email and temporary password.", "Follow the on-screen instructions and update your password."].map((step, index) => `<p style="font-size:15px;line-height:1.7"><strong style="color:#00734d;margin-right:15px">${index + 1}</strong> ${step}</p>`).join("")}</div>
<div style="background:#f0f9f5;border-radius:10px;padding:22px;margin-top:16px;text-align:center"><h2 style="font-size:25px;margin:0 0 8px">Need assistance?</h2><p style="color:#344054;line-height:1.6">Our support team is here to help you get started.</p>${support ? `<a href="${escapeHtml(supportLink)}" style="display:inline-block;background:#00734d;color:#fff;padding:14px 22px;border-radius:8px;text-decoration:none;font-weight:bold">CONTACT CUSTOMER SUPPORT &rarr;</a><p style="font-size:14px;color:#00734d">${escapeHtml([supportEmail, supportPhone].filter(Boolean).join(" / "))}</p>` : '<p style="font-size:14px;color:#00734d">Please contact your Operio account manager.</p>'}</div>
<p style="border-top:1px solid #dbe3e9;padding-top:18px;margin-top:24px;text-align:center;font-size:12px;line-height:1.7"><strong>Operio Business</strong> | Your Business. Our Responsibility.<br><span style="color:#667085">This is an automated account-access email. Please do not reply directly.</span></p>
</td></tr></table></td></tr></table></body></html>`;
}
