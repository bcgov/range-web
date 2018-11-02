/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';
import { Document, Page } from 'react-pdf';
import { connect } from 'react-redux';
import { downloadPDFBlob } from '../../utils';
import { fetchRupPDF } from '../../actionCreators';
import { Loading, ErrorPage } from '../common';
import { getPlanPDF, getIsFetchingPlanPDF, getPlanPDFError } from '../../reducers/rootReducer';

class PDFView extends Component {
  static propTypes = {
    match: PropTypes.shape({ params: PropTypes.object }).isRequired,
    fetchRupPDF: PropTypes.func.isRequired,
    isFetchingPDF: PropTypes.bool.isRequired,
    errorFetchingPDF: PropTypes.shape({}),
    planPDFBlob: PropTypes.shape({}),
  };

  static defaultProps = {
    planPDFBlob: null,
    errorFetchingPDF: null,
  }

  state = {
    numPages: 1,
  }

  componentWillMount() {
    const { fetchRupPDF, match } = this.props;
    const { planId, agreementId } = match.params;

    if (planId && agreementId) {
      fetchRupPDF(planId);
    }
  }

  onDownloadClicked = () => {
    const { match, planPDFBlob } = this.props;
    const { agreementId } = match.params;
    downloadPDFBlob(planPDFBlob, this.donwloadPDFLink, `${agreementId}.pdf`);
  }

  onLoadSuccess = ({ numPages }) => {
    this.setState({
      numPages,
    });
  }

  setDownlaodPDFRef = (ref) => { this.donwloadPDFLink = ref; }

  render() {
    const { numPages } = this.state;
    const { planPDFBlob, isFetchingPDF, errorFetchingPDF } = this.props;
    const pages = Array.from(
      new Array(numPages),
      (el, index) => (
        <Page
          key={`page_${index + 1}`}
          pageIndex={index + 1}
          pageNumber={index + 1}
          scale={1.2}
        />
      ),
    );

    return (
      <section className="rup-pdf">
        <a
          className="rup-pdf__link"
          href="download"
          ref={this.setDownlaodPDFRef}
        >
          link
        </a>

        { isFetchingPDF &&
          <Loading />
        }

        { errorFetchingPDF &&
          <ErrorPage
            message="Error occured while fetching pdf."
          />
        }

        { planPDFBlob &&
          <div className="rup-pdf__content">
            <div className="rup-pdf__preview__header">
              <div>
                <div style={{ fontWeight: 'bold' }}>Previewing PDF</div>
                To print this PDF download it to your computer prior to printing.
              </div>
              <Button
                onClick={this.onDownloadClicked}
              >
                <Icon name="print" />
                Download PDF
              </Button>
            </div>
            <div className="rup-pdf__preview">
              <Document
                file={planPDFBlob}
                loading={<Loading />}
                onLoadSuccess={this.onLoadSuccess}
              >
                {pages}
              </Document>
            </div>
          </div>
        }
      </section>
    );
  }
}

const mapStateToProps = state => (
  {
    planPDFBlob: getPlanPDF(state),
    isFetchingPDF: getIsFetchingPlanPDF(state),
    errorFetchingPDF: getPlanPDFError(state),
  }
);

export default connect(mapStateToProps, { fetchRupPDF })(PDFView);
