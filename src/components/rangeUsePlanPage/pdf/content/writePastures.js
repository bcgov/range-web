import { handleNullValue } from '../helper';
import { writeTitle, writeFieldText, drawHorizontalLine, writeText } from './common';
import { writePlantCommunities } from './writePlantCommunities';

export const writePastures = (doc, plan) => {
  const {
    startX,
    afterHeaderY,
    halfPageWidth,
    sectionTitleFontSize,
    grayColor,
  } = doc.config;
  const oneThirdWidth = halfPageWidth * 2 * 0.333;
  let momentCurrY;
  const { pastures = [] } = plan;

  doc.addPage();
  let currY = afterHeaderY;

  currY = writeTitle(doc, 'Pastures');

  if (pastures.length === 0) {
    currY += 2;
    currY = writeText({
      doc, text: 'No pasture provided.',
      x: startX, y: currY,
      fontColor: grayColor,
    });
  }

  currY -= 2;
  pastures.map((pasture) => {
    currY += 4;
    const { name, allowableAum, graceDays, pldPercent, notes } = pasture;
    currY = writeText({
      doc, text: `Pasture: ${handleNullValue(name)}`,
      x: startX, y: currY,
      fontSize: sectionTitleFontSize, fontStyle: 'bold',
    });
    currY += 6;

    momentCurrY = currY;
    currY = Math.max(
      writeFieldText(doc, 'Allowable AUMs', `${handleNullValue(allowableAum)}`, startX, momentCurrY),
      writeFieldText(doc, 'Private Land Deduction', `${handleNullValue(pldPercent)}`, oneThirdWidth, momentCurrY),
      writeFieldText(doc, 'Grace Days', `${handleNullValue(graceDays)}`, oneThirdWidth * 2, momentCurrY),
    );
    currY += 6;

    currY = writeFieldText(doc, 'Pasture Notes (non legal content)', notes, startX, currY);
    currY += 8;

    currY = writePlantCommunities(doc, currY, pasture);
    currY = drawHorizontalLine(doc, currY, 0.2);

    return null;
  });

  return currY;
};
