export function parseClientDate(value) {
  if (!value) return null;
  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
    const [day, month, year] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function renewal(id, item, category, holder, entity, expiryDate, update = {}) {
  return expiryDate ? { id, item, category, holder, entity, expiryDate, ...update } : null;
}

export function getClientRenewalItems(data) {
  if (!data?.client) return [];
  const { client, companies = [], members = [], vehicles = [], drivers = [], documents = [] } = data;
  const primaryCompany = companies[0]?.companyName;
  const recordId = (record) => record?.id ?? record?._id;
  const items = [
    renewal(`${recordId(client)}-passport`, `Passport (${client.name})`, "Passport", client.name, primaryCompany, client.passport?.passportExpiryDate, { sourceType: "client", sourceRecord: client, expiryPath: "passport.passportExpiryDate", identifierPath: "passport.passportNumber", identifier: client.passport?.passportNumber, primaryClient: client.name }),
    renewal(`${recordId(client)}-emirates`, `Emirates ID (${client.name})`, "Emirates ID", client.name, primaryCompany, client.emirates?.emiratesExpiryDate, { sourceType: "client", sourceRecord: client, expiryPath: "emirates.emiratesExpiryDate", identifierPath: "emirates.emiratesId", identifier: client.emirates?.emiratesId, primaryClient: client.name }),
    renewal(`${recordId(client)}-visa`, `E-Visa (${client.name})`, "E-Visa", client.name, primaryCompany, client.visa?.visaExpiryDate, { sourceType: "client", sourceRecord: client, expiryPath: "visa.visaExpiryDate", identifierPath: "visa.visaUIDNumber", identifier: client.visa?.visaUIDNumber, primaryClient: client.name }),
    renewal(`${recordId(client)}-health`, `Health Insurance (${client.name})`, "Health Insurance", client.name, primaryCompany, client.healthInsurance?.healthInsuranceExpiryDate, { sourceType: "client", sourceRecord: client, expiryPath: "healthInsurance.healthInsuranceExpiryDate", identifierPath: "healthInsurance.healthInsuranceCardNumber", identifier: client.healthInsurance?.healthInsuranceCardNumber, primaryClient: client.name }),
    ...companies.map((company) => renewal(`${recordId(company)}-licence`, `Trade Licence (${company.tradeLicenceNumber || company.companyName})`, "Trade Licence", company.companyName, company.companyName, company.licenceExpiryDate, { sourceType: "company", sourceRecord: company, expiryPath: "licenceExpiryDate", identifierPath: "tradeLicenceNumber", identifier: company.tradeLicenceNumber, primaryClient: client.name })),
    ...members.flatMap((member) => [
      renewal(`${recordId(member)}-passport`, `Passport (${member.name})`, "Passport", member.name, primaryCompany, member.passport?.passportExpiryDate, { sourceType: "member", sourceRecord: member, expiryPath: "passport.passportExpiryDate", identifierPath: "passport.passportNumber", identifier: member.passport?.passportNumber, primaryClient: client.name }),
      renewal(`${recordId(member)}-emirates`, `Emirates ID (${member.name})`, "Emirates ID", member.name, primaryCompany, member.emirates?.emiratesExpiryDate, { sourceType: "member", sourceRecord: member, expiryPath: "emirates.emiratesExpiryDate", identifierPath: "emirates.emiratesId", identifier: member.emirates?.emiratesId, primaryClient: client.name }),
      renewal(`${recordId(member)}-visa`, `E-Visa (${member.name})`, "E-Visa", member.name, primaryCompany, member.visa?.visaExpiryDate, { sourceType: "member", sourceRecord: member, expiryPath: "visa.visaExpiryDate", identifierPath: "visa.visaUIDNumber", identifier: member.visa?.visaUIDNumber, primaryClient: client.name }),
      renewal(`${recordId(member)}-health`, `Health Insurance (${member.name})`, "Health Insurance", member.name, primaryCompany, member.healthInsurance?.healthInsuranceExpiryDate, { sourceType: "member", sourceRecord: member, expiryPath: "healthInsurance.healthInsuranceExpiryDate", identifierPath: "healthInsurance.healthInsuranceCardNumber", identifier: member.healthInsurance?.healthInsuranceCardNumber, primaryClient: client.name }),
    ]),
    ...vehicles.flatMap((vehicle) => [
      renewal(`${recordId(vehicle)}-registration`, `Vehicle Registration (${vehicle.registrationNumer || "Vehicle"})`, "Vehicle Registration", vehicle.registrationNumer, primaryCompany, vehicle.registrationExpiry, { sourceType: "vehicle", sourceRecord: vehicle, expiryPath: "registrationExpiry", identifierPath: "registrationNumer", identifier: vehicle.registrationNumer, primaryClient: client.name }),
      renewal(`${recordId(vehicle)}-insurance`, `Vehicle Insurance (${vehicle.registrationNumer || "Vehicle"})`, "Vehicle Insurance", vehicle.registrationNumer, primaryCompany, vehicle.insuranceExpiry, { sourceType: "vehicle", sourceRecord: vehicle, expiryPath: "insuranceExpiry", identifierPath: "policyNumber", identifier: vehicle.policyNumber, primaryClient: client.name }),
    ]),
    ...drivers.map((driver) => renewal(`${recordId(driver)}-licence`, `Driving Licence (${driver.name})`, "Driving Licence", driver.name, primaryCompany, driver.licenceExpiryDate, { sourceType: "driver", sourceRecord: driver, expiryPath: "licenceExpiryDate", identifierPath: null, identifier: null, primaryClient: client.name })),
    ...documents.map((document) => renewal(`${recordId(document)}-document`, document.documentTitle || "Client Document", document.documentType || "Document", client.name, primaryCompany, document.expiryDate, { sourceType: "document", sourceRecord: document, expiryPath: "expiryDate", identifierPath: null, identifier: null, primaryClient: client.name })),
  ].filter(Boolean);

  return items.sort((first, second) => parseClientDate(first.expiryDate) - parseClientDate(second.expiryDate));
}
