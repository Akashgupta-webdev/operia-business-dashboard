function toApiDate(value) {
  if (!value) return undefined;
  const [year, month, day] = value.split("-");
  return `${day}-${month}-${year}`;
}

function optionalValue(value) {
  return value?.trim() || undefined;
}

function compactObject(value) {
  const compacted = Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined),
  );
  return Object.keys(compacted).length ? compacted : undefined;
}

export function createClientMemberCreateDefaultValues() {
  return {
    name: "",
    memberType: "",
    passport: { passportNumber: "", passportIssueDate: "", passportExpiryDate: "" },
    emirates: { emiratesId: "", emiratesIssueDate: "", emiratesExpiryDate: "" },
    visa: { visaUIDNumber: "", visaIssueDate: "", visaExpiryDate: "" },
    healthInsurance: { healthInsuranceCardNumber: "", healthInsuranceIssueDate: "", healthInsuranceExpiryDate: "" },
  };
}

export function buildClientMemberCreatePayload(values) {
  return compactObject({
    memberType: values.memberType || undefined,
    name: optionalValue(values.name),
    passport: compactObject({
      passportNumber: optionalValue(values.passport?.passportNumber)?.toUpperCase(),
      passportIssueDate: toApiDate(values.passport?.passportIssueDate),
      passportExpiryDate: toApiDate(values.passport?.passportExpiryDate),
    }),
    emirates: compactObject({
      emiratesId: optionalValue(values.emirates?.emiratesId),
      emiratesIssueDate: toApiDate(values.emirates?.emiratesIssueDate),
      emiratesExpiryDate: toApiDate(values.emirates?.emiratesExpiryDate),
    }),
    visa: compactObject({
      visaUIDNumber: optionalValue(values.visa?.visaUIDNumber),
      visaIssueDate: toApiDate(values.visa?.visaIssueDate),
      visaExpiryDate: toApiDate(values.visa?.visaExpiryDate),
    }),
    healthInsurance: compactObject({
      healthInsuranceCardNumber: optionalValue(values.healthInsurance?.healthInsuranceCardNumber),
      healthInsuranceIssueDate: toApiDate(values.healthInsurance?.healthInsuranceIssueDate),
      healthInsuranceExpiryDate: toApiDate(values.healthInsurance?.healthInsuranceExpiryDate),
    }),
  });
}

export function createClientVehicleCreateDefaultValues() {
  return {
    registrationNumer: "",
    policyNumber: "",
    insuranceExpiry: "",
    tcNumber: "",
    registrationExpiry: "",
  };
}

export function buildClientVehicleCreatePayload(values) {
  return compactObject({
    registrationNumer: optionalValue(values.registrationNumer),
    tcNumber: optionalValue(values.tcNumber),
    policyNumber: optionalValue(values.policyNumber),
    registrationExpiry: toApiDate(values.registrationExpiry),
    insuranceExpiry: toApiDate(values.insuranceExpiry),
  });
}

export function createClientDriverCreateDefaultValues() {
  return { name: "", licenceIssueDate: "", licenceExpiryDate: "" };
}

export function buildClientDriverCreatePayload(values) {
  return compactObject({
    name: optionalValue(values.name),
    licenceIssueDate: toApiDate(values.licenceIssueDate),
    licenceExpiryDate: toApiDate(values.licenceExpiryDate),
  });
}
