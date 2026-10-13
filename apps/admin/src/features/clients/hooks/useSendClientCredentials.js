import { useMutation } from "@tanstack/react-query";
import { sendClientCredentialsEmail } from "@/features/clients/api/clientCredentialsEmail.api";

export default function useSendClientCredentials() {
  return useMutation({ mutationFn: sendClientCredentialsEmail, retry: false, gcTime: 0 });
}
