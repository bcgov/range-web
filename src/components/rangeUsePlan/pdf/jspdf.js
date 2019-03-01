import jsPDF from 'jspdf';
import 'jspdf-autotable';

/* eslint-disable func-names */

// https://stackoverflow.com/questions/28327510/align-text-right-using-jspdf/28433113
const splitRegex = /\r\n|\r|\n/g;
jsPDF.API.textEx = function (text, x, y, hAlign, vAlign) {
  let currX = x;
  let currY = y;
  const fontSize = this.internal.getFontSize() / this.internal.scaleFactor;

  // As defined in jsPDF source code
  const lineHeightProportion = 1.15;

  let splittedText = null;
  let lineCount = 1;
  if (vAlign === 'middle' || vAlign === 'bottom' || hAlign === 'center' || hAlign === 'right') {
    splittedText = typeof text === 'string' ? text.split(splitRegex) : text;

    lineCount = splittedText.length || 1;
  }

  // Align the top
  currY += fontSize * (2 - lineHeightProportion);

  if (vAlign === 'middle') {
    currY -= (lineCount / 2) * fontSize;
  } else if (vAlign === 'bottom') {
    currY -= lineCount * fontSize;
  }
  if (hAlign === 'center' || hAlign === 'right') {
    let alignSize = fontSize;
    if (hAlign === 'center') alignSize *= 0.5;

    if (lineCount > 1) {
      for (let iLine = 0; iLine < splittedText.length; iLine += 1) {
        this.text(
          splittedText[iLine],
          currX - this.getStringUnitWidth(splittedText[iLine]) * alignSize,
          currY,
        );
        currY += fontSize;
      }
      return this;
    }
    currX -= this.getStringUnitWidth(text) * alignSize;
  }

  this.text(text, currX, currY);
  return this;
};

export default jsPDF;
