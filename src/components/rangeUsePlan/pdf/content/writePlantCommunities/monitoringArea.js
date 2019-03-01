import { writeText, writeFieldText, drawVerticalLine } from '../common';
import { handleNullValue, getMonitoringAreaPurposes } from '../../helper';

export const writeMonitoringAreas = (doc, y, pc) => {
  const { internal, config } = doc;
  const {
    startX,
    halfPageWidth,
    contentWidth,
    fieldTitleFontSize,
    primaryColor,
  } = config;
  const {
    name,
    communityType,
    monitoringAreas,
  } = pc;
  let currY = y;

  if (!monitoringAreas || monitoringAreas.length === 0) {
    return currY;
  }

  const communityTypeName = (communityType && communityType.name) || name;
  const marginRight = 5;
  const moreMarginRight = 10;
  let momentCurrY;

  currY += 7;
  currY = writeText({
    doc, text: `Monitoring Areas (${handleNullValue(communityTypeName)})`,
    x: startX + marginRight, y: currY,
    fontSize: fieldTitleFontSize + 0.5, fontColor: primaryColor,
  });

  monitoringAreas.map((ma) => {
    const {
      latitude,
      location,
      longitude,
      name: maName,
      otherPurpose,
      purposes,
      rangelandHealth,
    } = ma;
    const rangelandHealthName = rangelandHealth && rangelandHealth.name;
    const purposeNames = getMonitoringAreaPurposes(purposes, otherPurpose);

    currY += 6;
    const startYForVLine = currY;
    const startPageForVLine = internal.getCurrentPageInfo().pageNumber;

    currY = writeText({
      doc, text: `Monitoring Area: ${maName}`,
      x: startX + moreMarginRight, y: currY,
      fontStyle: 'bold', fontSize: fieldTitleFontSize,
    });

    currY += 5;
    momentCurrY = currY;
    currY = Math.max(
      writeFieldText(doc, 'Location', location, startX + moreMarginRight, momentCurrY, contentWidth - moreMarginRight),
      writeFieldText(doc, 'Latitude/Longitude', `${handleNullValue(latitude)}, ${handleNullValue(longitude)}`, halfPageWidth, momentCurrY, contentWidth - moreMarginRight),
    );

    currY += 7;
    currY = writeFieldText(doc, 'Rangeland Health', `${handleNullValue(rangelandHealthName)}`, startX + moreMarginRight, currY, contentWidth - moreMarginRight);

    currY += 7;
    currY = writeFieldText(doc, 'Purposes', `${handleNullValue(purposeNames)}`, startX + moreMarginRight, currY, contentWidth - moreMarginRight);
    drawVerticalLine(
      doc, startX + moreMarginRight - 3, startYForVLine, currY,
      startPageForVLine, internal.getCurrentPageInfo().pageNumber,
      0.4, primaryColor,
    );

    currY += 2;

    return null;
  });

  return currY - 2;
};
