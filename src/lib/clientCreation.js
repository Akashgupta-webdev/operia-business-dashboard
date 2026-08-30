const emptyPassport = () => ({
  passportNumber: "",
  passportIssueDate: "",
  passportExpiryDate: "",
});

const emptyEmirates = () => ({
  emiratesId: "",
  emiratesIssueDate: "",
  emiratesExpiryDate: "",
});

const emptyVisa = () => ({
  visaUIDNumber: "",
  visaIssueDate: "",
  visaExpiryDate: "",
});

const emptyHealthInsurance = () => ({
  healthInsuranceCardNumber: "",
  healthInsuranceIssueDate: "",
  healthInsuranceExpiryDate: "",
});

export const createEmptyMember = () => ({
  memberType: "Partner",
  name: "",
  passport: emptyPassport(),
  emirates: emptyEmirates(),
  visa: emptyVisa(),
  healthInsurance: emptyHealthInsurance(),
});

export const createEmptyVehicle = () => ({
  registrationNumer: "",
  tcNumber: "",
  policyNumber: "",
  registrationExpiry: "",
  insuranceExpiry: "",
});

export const createEmptyDriver = () => ({
  name: "",
  licenceIssueDate: "",
  licenceExpiryDate: "",
});

export const createEmptyService = () => ({
  category: "",
  package: "",
  status: "Pending",
  packagePrice: "",
  paymentStatus: "Unpaid",
  targetCompletionDate: "",
  notes: "",
});

export const createEmptyDocument = () => ({
  documentTitle: "",
  documentType: "",
  issueDate: "",
  expiryDate: "",
  file: undefined,
});

export const createClientDefaultValues = () => ({
  client: {
    name: "",
    nationality: "",
    mobileNumber: "",
    whatsappNumber: "",
    emailAddress: "",
    clientType: "INDIVIDUAL",
    passport: emptyPassport(),
    emirates: emptyEmirates(),
    visa: emptyVisa(),
    healthInsurance: emptyHealthInsurance(),
  },
  company: {
    companyName: "",
    tradeLicenceNumber: "",
    licenceExpiryDate: "",
    vatTaxRegistrationNumber: "",
    corporateTaxNumber: "",
  },
  members: [createEmptyMember()],
  vehicles: [createEmptyVehicle()],
  drivers: [createEmptyDriver()],
  services: [createEmptyService()],
  documents: [createEmptyDocument()],
  payments: [{
    totalBilled: "",
    amountReceived: "",
    paymentStatus: "Unpaid",
    paymentMethod: "",
    notes: "",
  }],
  reminders: [{
    followupDate: "",
    remindBefore: "7 day before",
    priority: "Normal",
    notes: "",
  }],
});

const hasText = (value) => typeof value === "string" && Boolean(value.trim());
const hasNestedValue = (value) => {
  if (Array.isArray(value)) return value.some(hasNestedValue);
  if (value && typeof value === "object") return Object.values(value).some(hasNestedValue);
  return hasText(value);
};

const apiDate = (value) => {
  if (!hasText(value)) return undefined;
  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) return value;

  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}-${month}-${year}` : value;
};

const noteArray = (value) => (hasText(value) ? [value.trim()] : undefined);

const prune = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  if (Array.isArray(value)) {
    const nextValue = value.map(prune).filter((item) => item !== undefined);
    return nextValue.length ? nextValue : undefined;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value)
      .map(([key, item]) => [key, prune(item)])
      .filter(([, item]) => item !== undefined);
    return entries.length ? Object.fromEntries(entries) : undefined;
  }
  return typeof value === "string" ? value.trim() : value;
};

const mapPassport = (passport = {}) => prune({
  passportNumber: passport.passportNumber,
  passportIssueDate: apiDate(passport.passportIssueDate),
  passportExpiryDate: apiDate(passport.passportExpiryDate),
});

const mapEmirates = (emirates = {}) => prune({
  emiratesId: emirates.emiratesId,
  emiratesIssueDate: apiDate(emirates.emiratesIssueDate),
  emiratesExpiryDate: apiDate(emirates.emiratesExpiryDate),
});

const mapVisa = (visa = {}) => prune({
  visaUIDNumber: visa.visaUIDNumber,
  visaIssueDate: apiDate(visa.visaIssueDate),
  visaExpiryDate: apiDate(visa.visaExpiryDate),
});

const mapHealthInsurance = (healthInsurance = {}) => prune({
  healthInsuranceCardNumber: healthInsurance.healthInsuranceCardNumber,
  healthInsuranceIssueDate: apiDate(healthInsurance.healthInsuranceIssueDate),
  healthInsuranceExpiryDate: apiDate(healthInsurance.healthInsuranceExpiryDate),
});

export const buildClientCreationRequest = (values) => {
  const client = prune({
    name: values.client.name,
    nationality: values.client.nationality,
    mobileNumber: values.client.mobileNumber,
    whatsappNumber: values.client.whatsappNumber,
    emailAddress: values.client.emailAddress?.toLowerCase(),
    clientType: values.client.clientType,
    passport: mapPassport(values.client.passport),
    emirates: mapEmirates(values.client.emirates),
    visa: mapVisa(values.client.visa),
    healthInsurance: mapHealthInsurance(values.client.healthInsurance),
  });

  const members = values.members
    .filter((member) => hasText(member.name) || [member.passport, member.emirates, member.visa, member.healthInsurance].some(hasNestedValue))
    .map((member) => prune({
      memberType: member.memberType,
      name: member.name,
      passport: mapPassport(member.passport),
      emirates: mapEmirates(member.emirates),
      visa: mapVisa(member.visa),
      healthInsurance: mapHealthInsurance(member.healthInsurance),
    }));

  const vehicles = values.vehicles
    .filter(hasNestedValue)
    .map((vehicle) => prune({
      registrationNumer: vehicle.registrationNumer,
      tcNumber: vehicle.tcNumber,
      policyNumber: vehicle.policyNumber,
      registrationExpiry: apiDate(vehicle.registrationExpiry),
      insuranceExpiry: apiDate(vehicle.insuranceExpiry),
    }));

  const drivers = values.drivers
    .filter(hasNestedValue)
    .map((driver) => prune({
      name: driver.name,
      licenceIssueDate: apiDate(driver.licenceIssueDate),
      licenceExpiryDate: apiDate(driver.licenceExpiryDate),
    }));

  const services = values.services
    .filter((service) => [service.category, service.package, service.packagePrice, service.targetCompletionDate, service.notes].some(hasText))
    .map((service) => prune({
      category: service.category,
      package: service.package,
      status: service.status,
      packagePrice: service.packagePrice,
      paymentStatus: service.paymentStatus,
      targetCompletionDate: apiDate(service.targetCompletionDate),
      notes: noteArray(service.notes),
    }));

  const documentRows = values.documents.filter((document) => document.file?.[0]);
  const files = documentRows.map((document) => document.file[0]);
  const documents = documentRows.map((document) => prune({
    documentTitle: document.documentTitle,
    documentType: document.documentType,
    issueDate: apiDate(document.issueDate),
    expiryDate: apiDate(document.expiryDate),
  }) ?? {});

  const payments = values.payments
    .filter((payment) => [payment.totalBilled, payment.amountReceived, payment.paymentMethod, payment.notes].some(hasText))
    .map((payment) => prune({
      totalBilled: payment.totalBilled,
      amountReceived: payment.amountReceived,
      paymentStatus: payment.paymentStatus,
      paymentMethod: payment.paymentMethod,
      notes: noteArray(payment.notes),
    }));

  const reminders = values.reminders
    .filter((reminder) => [reminder.followupDate, reminder.notes].some(hasText))
    .map((reminder) => prune({
      followupDate: apiDate(reminder.followupDate),
      remindBefore: reminder.remindBefore,
      priority: reminder.priority,
      notes: noteArray(reminder.notes),
    }));

  const payload = prune({
    client,
    company: values.client.clientType === "COMPANY" ? prune({
      companyName: values.company.companyName,
      tradeLicenceNumber: values.company.tradeLicenceNumber,
      licenceExpiryDate: apiDate(values.company.licenceExpiryDate),
      vatTaxRegistrationNumber: values.company.vatTaxRegistrationNumber,
      corporateTaxNumber: values.company.corporateTaxNumber,
    }) : undefined,
    members,
    vehicles,
    drivers,
    services,
    documents: files.length ? documents : undefined,
    payments,
    reminders,
  });

  return { payload, files };
};
