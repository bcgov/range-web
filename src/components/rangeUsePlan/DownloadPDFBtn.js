import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { downloadPDFBlob, cannotDownloadPDF } from '../../utils';
import { fetchRupPDF } from '../../actionCreators';
import { getPlanPDF, getIsFetchingPlanPDF } from '../../reducers/rootReducer';
import { DOWNLOAD_PDF } from '../../constants/strings';
import { PrimaryButton } from '../common';

class DownloadPDFBtn extends Component {
  static propTypes = {
    plan: PropTypes.shape({}).isRequired,
    fetchRupPDF: PropTypes.func.isRequired,
    isFetchingPDF: PropTypes.bool.isRequired,
    planPDFBlob: PropTypes.shape({}),
  };

  static defaultProps = {
    planPDFBlob: null,
  }

  onDownloadClicked = () => {
    const { fetchRupPDF, plan, planPDFBlob } = this.props;
    const { id: planId, agreementId } = plan;

    if (planId) {
      fetchRupPDF(planId).then(() => {
        setTimeout(() => {
          downloadPDFBlob(planPDFBlob, this.donwloadPDFLink, `${agreementId}.pdf`);
        }, 100);
      });
    }
  }

  setDownlaodPDFRef = (ref) => { this.donwloadPDFLink = ref; }

  render() {
    const { isFetchingPDF, plan } = this.props;
    const isDisabled = cannotDownloadPDF(plan.status);

    return (
      <span>
        <a
          className="rup-pdf__link"
          href="download"
          ref={(ref) => { this.donwloadPDFLink = ref; }}
        >
          link
        </a>

        <PrimaryButton
          disabled={isDisabled}
          loading={isFetchingPDF}
          onClick={this.onDownloadClicked}
          content={DOWNLOAD_PDF}
        />
      </span>
    );
  }
}

const mapStateToProps = state => (
  {
    planPDFBlob: getPlanPDF(state),
    isFetchingPDF: getIsFetchingPlanPDF(state),
  }
);

export default connect(mapStateToProps, { fetchRupPDF })(DownloadPDFBtn);
