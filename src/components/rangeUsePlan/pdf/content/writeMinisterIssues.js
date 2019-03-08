import {
  formatMinisterIssues,
} from '../helper';
import { writeTitle, drawHorizontalLine, drawVerticalLine, writeText, writeFieldText } from './common';

export const writeMinisterIssuesAndActions = (doc, plan) => {
  const { internal, config } = doc;
  const {
    startX,
    afterHeaderY,
    sectionTitleFontSize,
    normalFontSize,
    fieldTitleFontSize,
    primaryColor,
    grayColor,
    lightGrayColor,
    contentWidth,
  } = config;

  const ministerIssues = formatMinisterIssues(plan);

  doc.addPage();
  let currY = afterHeaderY;

  currY = writeTitle(doc, 'Minister\'s Issues and Actions');
  currY += 2;

  if (ministerIssues.length === 0) {
    currY = writeText({
      doc, text: 'No minister issue provided.',
      x: startX, y: currY,
      fontColor: grayColor,
    });
  } else {
    currY = writeText({
      doc, text: 'If more than one readiness criteria is provided, all such criteria must be met before grazing may accur.',
      x: startX, y: currY,
      fontSize: normalFontSize - 0.5, fontColor: lightGrayColor,
    });
    currY += 6;
  }

  ministerIssues.map((mi) => {
    const {
      actionsExist,
      pastureNames,
      ministerIssueType,
      objective,
      detail,
      ministerIssueActions,
    } = mi;
    const { name: mitName } = ministerIssueType || {};

    currY = writeText({
      doc, text: `Issue Type: ${mitName}`,
      x: startX, y: currY,
      fontSize: sectionTitleFontSize, fontStyle: 'bold',
    });

    currY += 6;
    currY = writeFieldText(doc, 'Details', detail, startX, currY);
    currY += 7;
    currY = writeFieldText(doc, 'Objectives', objective, startX, currY);
    currY += 7;
    currY = writeFieldText(doc, 'Pastures', pastureNames, startX, currY);
    currY += 7;

    currY = writeText({
      doc, text: 'Actions',
      x: startX, y: currY,
      fontSize: fieldTitleFontSize, fontColor: primaryColor,
    });
    currY += 6;

    const marginRight = 5;
    if (!actionsExist) {
      currY = writeText({
        doc, text: 'No action provided.',
        x: startX, y: currY,
        fontColor: grayColor,
      });
      currY += 7;
    } else {
      ministerIssueActions && ministerIssueActions.map(((mia) => {
        const { detail: miaDetail, ministerIssueActionType, other } = mia;
        let miatName = ministerIssueActionType.name;
        if (ministerIssueActionType.name === 'Other') {
          miatName = other ? `Other (${other})` : 'Other';
        }

        const startYForVLine = currY;
        const startPageForVLine = internal.getCurrentPageInfo().pageNumber;

        currY = writeFieldText(
          doc, miatName, miaDetail, startX + marginRight, currY, contentWidth - marginRight,
        );
        drawVerticalLine(
          doc, startX + 2, startYForVLine, currY,
          startPageForVLine, internal.getCurrentPageInfo().pageNumber,
          0.7,
        );

        currY += 7;

        return null;
      }));
    }

    currY = drawHorizontalLine(doc, currY, 0.2);
    currY += 4;

    return null;
  });

  return currY;
};
