import {
  handleNullValue,
  formatDateFromServer,
  getPrimaryClientFullName,
} from '../helper';

export const checkY = (doc, currY) => {
  const { contentEndY, afterHeaderY } = doc.config;

  if (currY >= contentEndY) {
    doc.addPage();
    return afterHeaderY;
  }

  return currY;
};

export const writeText = ({
  doc,
  text,
  x,
  y,
  fontSize,
  fontStyle = 'normal',
  fontColor,
  hAlign = null,
  vAlign = null,
  cusContentWidth = null,
}) => {
  const { blackColor, normalFontSize, contentWidth } = doc.config;

  let currY = checkY(doc, y);

  doc.setFontSize(fontSize || normalFontSize)
    .setFontStyle(fontStyle)
    .setTextColor(fontColor || blackColor);

  const width = cusContentWidth || contentWidth;
  const splitTextArray = doc.splitTextToSize(handleNullValue(text), width);
  splitTextArray.map((textChunk) => {
    currY = checkY(doc, currY);
    doc.textEx(textChunk, x, currY, hAlign, vAlign);
    currY += 5;

    return null;
  });

  return currY - 5;
};

export const writeFieldText = (doc, title, content, x, y, cusContentWidth = null) => {
  const { fieldTitleFontSize, grayColor } = doc.config;
  let currY = writeText({
    doc,
    text: title,
    x,
    y,
    fontSize: fieldTitleFontSize,
  });

  currY = writeText({
    doc,
    text: content,
    x,
    y: currY + 5,
    fontColor: grayColor,
    cusContentWidth,
  });

  return currY;
};

export const writeLogoImage = (doc, logoImage) => {
  const { startX, startY } = doc.config;
  const di = 10;
  doc.addImage(logoImage, 'PNG', startX - 3.5, startY - 3, 600 / di, 214 / di);
};

export const writeHeaderAndFooter = (doc, plan, logoImage) => {
  const { config } = doc;
  const {
    startY, contentEndX, blackColor, grayColor, normalFontSize, halfPageWidth, pageHeight,
  } = config;
  const {
    forestFileId, agreementStartDate: asd, agreementEndDate: aed, clients,
  } = plan.agreement || {};

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i += 1) {
    doc.setPage(i);

    if (logoImage) {
      writeLogoImage(doc, logoImage);
    }

    // header
    doc.setFontSize(15).setFontStyle('bold').setTextColor(blackColor);
    doc.textEx('Range Use Plan', contentEndX - 0.5, startY, 'right');

    doc.setFontSize(10).setFontStyle('normal').setTextColor(grayColor);
    doc.textEx(`${forestFileId} | ${getPrimaryClientFullName(clients)}`, contentEndX - 1, startY + 7, 'right');
    doc.textEx(`${formatDateFromServer(asd)} - ${formatDateFromServer(aed)}`, contentEndX - 0.5, startY + 12, 'right');

    // footer
    doc.setFontSize(normalFontSize).setFontStyle('normal').setTextColor(blackColor);
    doc.textEx(`${i}/${totalPages}`, halfPageWidth, pageHeight - 3);
  }
};

export const drawHorizontalLine = (doc, y, thickness) => {
  const { startX, contentEndX, primaryColor } = doc.config;
  const currY = checkY(doc, y);

  doc.setLineWidth(thickness).setDrawColor(primaryColor);
  doc.line(startX, currY, contentEndX, currY); // horizontal line

  return currY + thickness;
};

export const drawVerticalLine = (
  doc, x, y1, y2, firstPage, lastPage, thickness, cusColor = null,
) => {
  const { accentColor, contentEndY, afterHeaderY } = doc.config;
  const color = cusColor || accentColor;
  const pageAdded = firstPage !== lastPage;
  if (pageAdded) {
    for (let page = firstPage; page <= lastPage; page += 1) {
      if (page === firstPage) {
        if (y1 < contentEndY) {
          // go back to the first page and draw
          doc.setPage(page);
          doc.setLineWidth(thickness).setDrawColor(color);
          doc.line(x, y1, x, contentEndY + 2);
        }
      } else if (page === lastPage) {
        // go to the last page and finish drawing
        doc.setPage(page);
        doc.setLineWidth(thickness).setDrawColor(color);
        doc.line(x, afterHeaderY, x, y2 + 4);
      } else {
        // draw the line from top to the bottom in the pages
        // between the first and last page
        doc.setPage(page);
        doc.setLineWidth(thickness).setDrawColor(color);
        doc.line(x, afterHeaderY, x, contentEndY + 2);
      }
    }
  } else {
    doc.setLineWidth(thickness).setDrawColor(color);
    doc.line(x, y1, x, y2 + 4);
  }
};


export const writeTitle = (doc, title) => {
  const { startX, afterHeaderY, blackColor } = doc.config;

  let currY = writeText({
    doc,
    text: title,
    x: startX,
    y: afterHeaderY,
    fontSize: 16,
    fontColor: blackColor,
    fontStyle: 'bold',
  });

  currY += 8;
  currY = drawHorizontalLine(doc, currY, 0.5);

  return currY;
};
