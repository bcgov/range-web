import React, { Component } from 'react';
import { connect } from 'react-redux';
import jsPDF from './jspdf';
import { Icon } from 'semantic-ui-react';
import { Loading, ErrorPage, PrimaryButton } from '../../common';
// import plan from './mockPlanForPDF';
import { writeBasicInformation } from './content/writeBasicInformation';
import { writePastures } from './content/writePastures';
import { writeGrazingSchedules } from './content/writeGrazingSchedules';
import { writeHeaderAndFooter } from './content/common';
import { writeMinisterIssuesAndActions } from './content/writeMinisterIssues';
import { writeInvasivePlantChecklist } from './content/writeInvasivePlant';
import { writeAdditionalRequirements } from './content/writeAdditionalRequirements';
import { writeManagementConsiderations } from './content/writeManagementConsiderations';
import { getIsFetchingPlan, getPlanErrorOccured, getPlansMap } from '../../../reducers/rootReducer';
import { fetchRUP } from '../../../actionCreators';
import { IMAGE_SRC } from '../../../constants/variables';

class PDFView extends Component {
  state = {
    doc: null,
  }

  componentWillMount() {
    const { match, fetchRUP } = this.props;
    const { planId, agreementId } = match.params;

    if (planId && agreementId) {
      fetchRUP(planId).then((plan) => {
        this.generatePDF(plan);
      });
    }
  }

  getDataUri = (url, callback) => {
    let image = new Image();
    
    image.onload = function () {
      callback(this);
    };

    image.src = url;
  }

  generatePDF = (plan) => {
    this.getDataUri(IMAGE_SRC.MYRANGEBC_LOGO_PNG, (logoImage) => {
      const doc = new jsPDF();
      const startX = 14;
      const halfPageWidth = 105;
      doc.config = {
        primaryColor: '#002C71',
        primaryRGB: [0,44,113],
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

      // doc.output('save', 'filename.pdf'); //Try to save PDF as a file (not works on ie before 10, and some mobile devices)
      // doc.output('datauristring');        //returns the data uri string
      // doc.output('datauri');              //opens the data uri in current window
      // doc.output('dataurlnewwindow');        //opens the data uri in new window

      doc.output('save', `Range Use Plan - ${plan.agreementId}.pdf`);
      this.setState({
        doc,
      })
    });
  }

  onDownloadClicked = () => {
    const { doc } = this.state;
    const { planMaps, match } = this.props;
    const { planId } = match.params;
    const plan = planMaps[planId];

    doc.output('save', `Range Use Plan - ${plan.agreementId}.pdf`);
  }

  render() {
    const { planMaps, match, isFetchingPlan, errorFetchingPlan } = this.props;
    const { planId } = match.params;
    const plan = planMaps[planId];

    return (
      <section className="rup-pdf">
        { isFetchingPlan &&
          <Loading />
        }

        { errorFetchingPlan &&
          <ErrorPage
            message="Error occured while fetching pdf."
          />
        }

        { plan &&
          <div>
            If your download does not begin, please click the button to try again.
            <PrimaryButton
              inverted
              style={{ marginLeft: '10px' }}
              onClick={this.onDownloadClicked}
            >
              <Icon name="print" />
              Download PDF
            </PrimaryButton>
            <div className="rup-pdf__close-btn__container">
              <button
                className="rup-pdf__close-btn"
                onClick={() => window.close()}
              >
                Close window
              </button>
            </div>
          </div>
        }
      </section>
    );
  }
}

const mapStateToProps = state => (
  {
    planMaps: getPlansMap(state),
    isFetchingPlan: getIsFetchingPlan(state),
    errorFetchingPlan: getPlanErrorOccured(state),
  }
);

export default connect(mapStateToProps, { fetchRUP })(PDFView);
