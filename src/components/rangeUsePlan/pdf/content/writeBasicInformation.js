import {
  getAgreementExemptionStatus,
  getAgreementType,
  formatDateFromServer,
  getUserFullName,
  getClientFullName,
  getContactRole,
  getDistrict,
  capitalize,
} from '../helper';
import { writeTitle, writeFieldText, drawHorizontalLine, writeText } from './common';

export const writeBasicInformation = (doc, plan) => {
  const {
    afterHeaderY,
    startX,
    halfPageWidth,
    fieldTitleFontSize,
    grayColor,
    sectionTitleFontSize,
  } = doc.config;
  const {
    agreement, rangeName, altBusinessName,
    planStartDate, planEndDate, extension,
  } = plan;
  const {
    forestFileId, zone, agreementType,
    agreementStartDate: asd, agreementEndDate: aed,
    clients,
  } = agreement || {};
  const { code: zoneCode, user: staff } = zone || {};
  const { phoneNumber, email } = staff || {};

  doc.addPage();
  let currY = afterHeaderY;

  currY = writeTitle(doc, 'Basic Information');
  const marginBottom = 7;
  const fieldTextWidth = halfPageWidth - startX - 1;

  currY += 3;
  writeText({
    doc, text: 'Agreement Information',
    x: startX, y: currY,
    fontSize: sectionTitleFontSize, fontStyle: 'bold',
  });
  writeText({
    doc, text: 'Contact Information',
    x: halfPageWidth, y: currY,
    fontSize: sectionTitleFontSize, fontStyle: 'bold',
  });
  currY += marginBottom;

  currY = Math.max(
    writeFieldText(doc, 'Ran Number', forestFileId, startX, currY, fieldTextWidth),
    writeFieldText(doc, 'District (Responsible)', getDistrict(zone), halfPageWidth, currY, fieldTextWidth),
  );
  currY += marginBottom;

  currY = Math.max(
    writeFieldText(doc, 'Agreement Type', getAgreementType(agreementType), startX, currY, fieldTextWidth),
    writeFieldText(doc, 'Zone', zoneCode, halfPageWidth, currY, fieldTextWidth),
  );
  currY += marginBottom;

  currY = Math.max(
    writeFieldText(doc, 'Agreement Date', `${formatDateFromServer(asd)} - ${formatDateFromServer(aed)}`, startX, currY, fieldTextWidth),
    writeFieldText(doc, 'Contact Name', getUserFullName(staff), halfPageWidth, currY, fieldTextWidth),
  );
  currY += marginBottom;

  currY = Math.max(
    writeFieldText(doc, 'Range Name', capitalize(rangeName), startX, currY, fieldTextWidth),
    writeFieldText(doc, 'Contact Phone', phoneNumber, halfPageWidth, currY, fieldTextWidth),
  );
  currY += marginBottom;

  currY = Math.max(
    writeFieldText(doc, 'Alternative Business Name', altBusinessName, startX, currY, fieldTextWidth),
    writeFieldText(doc, 'Contact Email', email, halfPageWidth, currY, fieldTextWidth),
  );
  currY += marginBottom;

  currY = drawHorizontalLine(doc, currY, 0.2);
  currY += 3;

  writeText({
    doc, text: 'Plan Information',
    x: startX, y: currY,
    fontSize: sectionTitleFontSize, fontStyle: 'bold',
  });
  currY += marginBottom;

  currY = Math.max(
    writeFieldText(doc, 'Plan Start Date', formatDateFromServer(planStartDate), startX, currY, fieldTextWidth),
    writeFieldText(doc, 'Plan End Date', formatDateFromServer(planEndDate), halfPageWidth, currY, fieldTextWidth),
  );
  currY += marginBottom;

  currY = Math.max(
    writeFieldText(doc, 'Extended', extension, startX, currY),
    writeFieldText(doc, 'Exemption Status', getAgreementExemptionStatus(agreement), halfPageWidth, currY, fieldTextWidth),
  );
  currY += marginBottom;

  currY = drawHorizontalLine(doc, currY, 0.2);
  currY += 3;

  writeText({
    doc, text: 'Agreement Holders',
    x: startX, y: currY,
    fontSize: sectionTitleFontSize, fontStyle: 'bold',
  });
  currY += marginBottom;

  currY = writeText({
    doc, text: 'Name',
    x: startX, y: currY,
    fontSize: fieldTitleFontSize,
  });
  writeText({
    doc, text: 'Type',
    x: halfPageWidth, y: currY,
    fontSize: fieldTitleFontSize,
  });
  currY += 6;

  clients.map((client) => {
    writeText({
      doc, text: getClientFullName(client),
      x: startX, y: currY,
      fontColor: grayColor,
    });
    currY = writeText({
      doc, text: getContactRole(client),
      x: halfPageWidth, y: currY,
      fontColor: grayColor,
    });
    currY += 5;

    return null;
  });

  return currY;
};
