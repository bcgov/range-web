import jspdf from './jspdf';
// import plan from './mockPlan';
import { writeBasicInformation } from './content/writeBasicInformation';
import { writePastures } from './content/writePastures';
import { writeGrazingSchedules } from './content/writeGrazingSchedules';
import { writeHeaderAndFooter } from './content/common';
import { writeMinisterIssuesAndActions } from './content/writeMinisterIssues';
import { writeInvasivePlantChecklist } from './content/writeInvasivePlant';
import { writeAdditionalRequirements } from './content/writeAdditionalRequirements';
import { writeManagementConsiderations } from './content/writeManagementConsiderations';

const getDataUri = (url, callback) => {
  const image = new Image(); // eslint-disable-line no-undef

  image.onload = () => {
    callback(this);
  };

  image.src = url;
};

export const generatePDF = (plan) => {
  getDataUri('/logo.png', (logoImage) => {
    const doc = new jspdf();
    const startX = 14;
    const halfPageWidth = 105;
    doc.config = {
      primaryColor: '#002C71',
      primaryRGB: [0, 44, 113],
      accentColor: '#F3B229',
      blackColor: '#000000',
      grayColor: '#444444',
      lightGrayColor: '#777777',
      halfPageWidth,
      contentWidth: (halfPageWidth * 2) - (startX * 2),
      pageHeight: 290,
      startX,
      contentEndX: 196,
      startY: 10,
      afterHeaderY: 29,
      contentEndY: 280,
      sectionTitleFontSize: 13,
      fieldTitleFontSize: 11,
      normalFontSize: 10,
      tableMarginBottom: 15,
    };

    // https://stackoverflow.com/a/43999406
    // doc.setFont("arial");

    writeBasicInformation(doc, plan);
    writePastures(doc, plan);
    writeGrazingSchedules(doc, plan);
    writeMinisterIssuesAndActions(doc, plan);
    writeInvasivePlantChecklist(doc, plan);
    writeAdditionalRequirements(doc, plan);
    writeManagementConsiderations(doc, plan);

    writeHeaderAndFooter(doc, plan, logoImage);

    // doc.output('save', `${plan.agreementId}.pdf`); // Try to save PDF as a file (not works on ie before 10, and some mobile devices)
    doc.output('dataurlnewwindow');        //opens the data uri in new window
    return doc;
  });
};
