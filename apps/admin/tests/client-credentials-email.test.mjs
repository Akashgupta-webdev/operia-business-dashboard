import test from "node:test";
import assert from "node:assert/strict";
import { buildClientCredentialsEmail, CLIENT_PORTAL_URL } from "../src/features/clients/utils/clientCredentialsEmail.js";

test("credentials email escapes client values and preserves the portal destination", () => {
  const html = buildClientCredentialsEmail({ name: '<img src=x onerror=alert(1)>', emailAddress: 'client@example.com', password: 'A<&"secret', logoUrl: 'javascript:alert(1)' });
  assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'));
  assert.ok(html.includes('A&lt;&amp;&quot;secret'));
  assert.ok(!html.includes('javascript:'));
  assert.ok(!html.includes('<img src=x'));
  assert.ok(html.includes('href="' + CLIENT_PORTAL_URL + '"'));
  assert.ok(html.includes('client@example.com'));
});

test("credentials email renders configured support details", () => {
  const html = buildClientCredentialsEmail({ name: 'Client', emailAddress: 'client@example.com', password: 'temporary123', supportEmail: 'support@example.com', supportPhone: '+971 123456789' });
  assert.ok(html.includes('mailto:support%40example.com'));
  assert.ok(html.includes('support@example.com / +971 123456789'));
});
