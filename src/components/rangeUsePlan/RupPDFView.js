import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';
import { Document, Page } from 'react-pdf';
import { connect } from 'react-redux';
import { downloadPDFBlob } from '../../handlers';
import { getRupPDF } from '../../actions/rangeUsePlanActions';
import { Loading } from '../common';

const propTypes = {
  match: PropTypes.shape({ params: PropTypes.object }).isRequired,
  getRupPDF: PropTypes.func.isRequired,
  isLoadingPDF: PropTypes.bool.isRequired,
};

class RangeUsePlanPDF extends Component {
  state = {
    file: null,
    numPages: 1,
  }

  componentWillMount() {
    const { getRupPDF, match } = this.props;
    const { planId, agreementId } = match.params;

    if (planId && agreementId) {
      const setPDFFileState = (blob) => {
        this.setState({
          file: blob,
        });
      };
      getRupPDF(planId).then(setPDFFileState);
    }
  }

  onDownloadClicked = () => {
    const { agreementId } = this.props.match.params;
    downloadPDFBlob(this.state.file, this.donwloadPDFLink, `${agreementId}.pdf`);
  }

  onLoadSuccess = ({ numPages }) => {
    this.setState({
      numPages,
    });
  }

  setDownlaodPDFRef = (ref) => { this.donwloadPDFLink = ref; }

  render() {
    const { file, numPages } = this.state;

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
      <div className="rup-pdf">
        <a
          className="rup__pdf-link"
          href="download"
          ref={this.setDownlaodPDFRef}
        >
          link
        </a>

        { this.props.isLoadingPDF &&
          <Loading />
        }

        { file &&
          <div className="rup-pdf__container">
            <div className="rup-pdf__container__download-btn">
              <Button
                primary
                basic
                onClick={this.onDownloadClicked}
              >
                <Icon name="print" />
                Download PDF
              </Button>
            </div>
            <div className="rup-pdf__container__document">
              <Document
                file={file}
                loading={<Loading />}
                onLoadSuccess={this.onLoadSuccess}
              >
                {pages}
              </Document>
            </div>
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    isLoadingPDF: state.pdf.isLoading,
  }
);

RangeUsePlanPDF.propTypes = propTypes;
export default connect(mapStateToProps, { getRupPDF })(RangeUsePlanPDF);
