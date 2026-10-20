import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@operio/ui/components/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@operio/ui/components/dialog";
import { credentialsEmailSettings, isCredentialsEmailConfigured } from "@/features/clients/api/clientCredentialsEmail.api";
import useSendClientCredentials from "@/features/clients/hooks/useSendClientCredentials";
import { buildClientCredentialsEmail } from "@/features/clients/utils/clientCredentialsEmail";

export default function SendCredentialsDialog({ client, credentials, open, onOpenChange }) {
  const [showPassword, setShowPassword] = useState(false);
  const [sendError, setSendError] = useState("");
  const mutation = useSendClientCredentials();
  const emailValues = {
    name: client.name,
    emailAddress: credentials.emailAddress.trim().toLowerCase(),
    password: credentials.password,
    ...credentialsEmailSettings,
    logoUrl: new URL(`${import.meta.env.BASE_URL}operia-logo.jpeg`, window.location.origin).href,
  };
  const send = async () => {
    setSendError("");
    try {
      await mutation.mutateAsync({ name: emailValues.name, emailAddress: emailValues.emailAddress, html: buildClientCredentialsEmail({ ...emailValues, logoUrl: "cid:operia-logo.jpeg" }) });
      toast.success("Credentials email sent successfully.");
      onOpenChange(false);
    } catch (error) {
      setSendError(error.message);
    } finally {
      mutation.reset();
    }
  };
  return <Dialog open={open} onOpenChange={(value) => { if (!mutation.isPending) onOpenChange(value); }}>
    <DialogContent className="flex max-h-[90svh] max-w-3xl flex-col gap-4 p-4 sm:p-6" showCloseButton={!mutation.isPending}>
      <DialogHeader className="pr-8"><DialogTitle>Send Credentials</DialogTitle><DialogDescription>Review the welcome email for {emailValues.emailAddress}.</DialogDescription></DialogHeader>
      <div className="flex items-center justify-between gap-3 text-caption text-text-secondary"><span>Subject: Welcome to your Operio Client Portal</span><Button type="button" variant="outline" size="sm" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide password" : "Show password"}</Button></div>
      <iframe title="Client credentials email preview" sandbox="" referrerPolicy="no-referrer" className="min-h-0 w-full flex-1 rounded-lg border border-border-default bg-white" style={{ height: "58vh", flexBasis: "58vh" }} srcDoc={buildClientCredentialsEmail({ ...emailValues, password: showPassword ? emailValues.password : "••••••••••••" })} />
      <p className="text-caption text-text-secondary">Includes the Operio logo and attachment: OPERIO_Company_Profile.pdf.</p>
      {!isCredentialsEmailConfigured && <p role="status" className="text-body-sm text-text-secondary">Email delivery is not configured. Please contact your administrator to enable sending.</p>}
      {sendError && <p role="alert" className="text-body-sm text-danger-600">{sendError}</p>}
      <DialogFooter><Button type="button" variant="outline" disabled={mutation.isPending} onClick={() => onOpenChange(false)}>Cancel</Button><Button type="button" disabled={!isCredentialsEmailConfigured || mutation.isPending} onClick={send}><Send className="size-4" />{mutation.isPending ? "Sending..." : "Send email"}</Button></DialogFooter>
    </DialogContent>
  </Dialog>;
}
