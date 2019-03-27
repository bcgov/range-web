import { writeTitle, drawHorizontalLine, writeText } from './common';

export const writeInvasivePlantChecklist = (doc, plan) => {
  const {
    startX,
    afterHeaderY,
    contentWidth,
    grayColor,
  } = doc.config;

  const { invasivePlantChecklist } = plan;
  const {
    equipmentAndVehiclesParking,
    beginInUninfestedArea,
    undercarrigesInspected,
    revegetate,
    other,
  } = invasivePlantChecklist || {};

  const nothingSelected = !(
    equipmentAndVehiclesParking
    || beginInUninfestedArea
    || undercarrigesInspected
    || revegetate
    || other
  );
  if (nothingSelected) {
    return null;
  }

  doc.addPage();
  let currY = afterHeaderY;

  const marginBottom = 7;
  const marginLeft = 9;
  currY = writeTitle(doc, 'Invasive Plants');
  currY += 2;

  currY = writeText({
    doc, text: 'I commit to carry out the following measures to prevent the introduction or spread of invasive plants that are likely the result of my range practices:',
    x: startX, y: currY,
    fontColor: grayColor,
  });
  currY += marginBottom;

  if (equipmentAndVehiclesParking) {
    currY = writeText({
      doc, text: '    •    Equipment and vehicles will not be parked on invasive plant infestations',
      x: startX, y: currY,
      fontColor: grayColor,
    });
    currY += marginBottom;
  }

  if (beginInUninfestedArea) {
    currY = writeText({
      doc, text: '    •    Any work will being in un-infested areas before moving to infested locations',
      x: startX, y: currY,
      fontColor: grayColor,
    });
    currY += marginBottom;
  }

  if (undercarrigesInspected) {
    currY = writeText({
      doc, text: '    •',
      x: startX, y: currY,
      fontColor: grayColor,
    });
    currY = writeText({
      doc, text: 'Clothing and vehicle/equipment undercarriages will be regularly inspected for plant parts or propagules if working in an area known to contain invasive plants',
      x: startX + marginLeft, y: currY,
      fontColor: grayColor,
      cusContentWidth: contentWidth - marginLeft,
    });
    currY += marginBottom;
  }

  if (revegetate) {
    currY = writeText({
      doc, text: '    •',
      x: startX, y: currY,
      fontColor: grayColor,
    });
    currY = writeText({
      doc, text: 'Revegetate disturbed areas that have exposed mineral soil within one year of disturbance by seeding using Common #1 Forage Mixture or better. The certificate of seed analysis will be requested and seed that contains weed seeds of listed invasive plants and/or invasive plants that are high priority to the area will be rejected. Seeding will occur around range developments and areas of cattle congregation where bare soil is exposed. Revegetated areas will be monitored and revegetated as necessary until exposed soil is eliminated.',
      x: startX + marginLeft, y: currY,
      fontColor: grayColor,
      cusContentWidth: contentWidth - marginLeft,
    });
    currY += marginBottom;
  }

  if (other) {
    currY = writeText({
      doc, text: 'Other:',
      x: startX, y: currY,
      fontColor: grayColor, fontStyle: 'bold',
    });
    currY += marginBottom;

    currY = writeText({
      doc, text: '    •',
      x: startX, y: currY,
      fontColor: grayColor,
    });

    currY = writeText({
      doc, text: other,
      x: startX + marginLeft, y: currY,
      fontColor: grayColor,
      cusContentWidth: contentWidth - marginLeft,
    });
    currY += marginBottom;
  }

  currY = drawHorizontalLine(doc, currY, 0.2);
  currY += 3;

  return currY;
};
