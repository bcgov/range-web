import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';
import { Document, Page } from 'react-pdf';
import { connect } from 'react-redux';
import { downloadPDFBlob } from '../../utils';
import { fetchRupPDF } from '../../actionCreators';
import { Loading } from '../common';

const propTypes = {
  match: PropTypes.shape({ params: PropTypes.object }).isRequired,
  fetchRupPDF: PropTypes.func.isRequired,
};

class RangeUsePlanPDF extends Component {
  state = {
    file: null,
    numPages: 1,
    isFetchingPDF: false,
  }

  componentWillMount() {
    const { fetchRupPDF, match } = this.props;
    const { planId, agreementId } = match.params;

    if (planId && agreementId) {
      this.setState({ isFetchingPDF: true });

      fetchRupPDF(planId).then(
        (blob) => {
          this.setState({
            file: blob,
            isFetchingPDF: false,
          });
        },
        (err) => {
          this.setState({ isFetchingPDF: false });
          throw err;
        },
      );
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
    const { file, numPages, isFetchingPDF } = this.state;

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

        { file &&
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
                file={file}
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

RangeUsePlanPDF.propTypes = propTypes;
export default connect(null, { fetchRupPDF })(RangeUsePlanPDF);
