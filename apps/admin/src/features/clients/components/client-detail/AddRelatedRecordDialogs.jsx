import { Car, Contact, UserRoundPlus } from "lucide-react";

import useCreateClientDriver from "@/features/clients/hooks/useCreateClientDriver";
import useCreateClientMember from "@/features/clients/hooks/useCreateClientMember";
import useCreateClientVehicle from "@/features/clients/hooks/useCreateClientVehicle";
import {
  buildClientDriverCreatePayload,
  buildClientMemberCreatePayload,
  buildClientVehicleCreatePayload,
  createClientDriverCreateDefaultValues,
  createClientMemberCreateDefaultValues,
  createClientVehicleCreateDefaultValues,
} from "@/features/clients/utils/clientRelatedCreate";
import {
  clientDriverCreateSchema,
  clientMemberCreateSchema,
  clientVehicleCreateSchema,
} from "@/features/clients/schemas/client.schema";
import CreateRelatedRecordDialog from "./CreateRelatedRecordDialog";
import { DriverFormFields, MemberFormFields, VehicleFormFields } from "./RelatedRecordFormFields";

export function AddMemberDialog({ clientId, open, onOpenChange }) {
  const mutation = useCreateClientMember(clientId);
  return (
    <CreateRelatedRecordDialog clientId={clientId} open={open} onOpenChange={onOpenChange} mutation={mutation} schema={clientMemberCreateSchema} defaultValues={createClientMemberCreateDefaultValues} buildPayload={buildClientMemberCreatePayload} title="Add Member" description="Enter the new member details." entityName="Member" icon={UserRoundPlus} iconClassName="bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300" widthClassName="max-w-5xl">
      <MemberFormFields />
    </CreateRelatedRecordDialog>
  );
}

export function AddVehicleDialog({ clientId, open, onOpenChange }) {
  const mutation = useCreateClientVehicle(clientId);
  return (
    <CreateRelatedRecordDialog clientId={clientId} open={open} onOpenChange={onOpenChange} mutation={mutation} schema={clientVehicleCreateSchema} defaultValues={createClientVehicleCreateDefaultValues} buildPayload={buildClientVehicleCreatePayload} title="Add Vehicle" description="Enter the new vehicle details." entityName="Vehicle" icon={Car} iconClassName="bg-success-50 text-success-600 dark:bg-success-700/20 dark:text-success-500">
      <VehicleFormFields />
    </CreateRelatedRecordDialog>
  );
}

export function AddDriverDialog({ clientId, open, onOpenChange }) {
  const mutation = useCreateClientDriver(clientId);
  return (
    <CreateRelatedRecordDialog clientId={clientId} open={open} onOpenChange={onOpenChange} mutation={mutation} schema={clientDriverCreateSchema} defaultValues={createClientDriverCreateDefaultValues} buildPayload={buildClientDriverCreatePayload} title="Add Driver" description="Enter the new driver details." entityName="Driver" icon={Contact} iconClassName="bg-warning-50 text-warning-600 dark:bg-warning-700/20 dark:text-warning-500">
      <DriverFormFields />
    </CreateRelatedRecordDialog>
  );
}
