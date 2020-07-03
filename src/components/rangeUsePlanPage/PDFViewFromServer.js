import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'semantic-ui-react'
// import { Document, Page } from 'react-pdf';
import { connect } from 'react-redux'
import { downloadPDFBlob } from '../../utils'
import { fetchRupPDF } from '../../actionCreators'
import { Loading, ErrorPage, PrimaryButton } from '../common'
import {
  getPlanPDF,
  getIsFetchingPlanPDF,
  getPlanPDFErrorOccured
} from '../../reducers/rootReducer'

class PDFView extends Component {
  static propTypes = {
    match: PropTypes.shape({ params: PropTypes.object }).isRequired,
    fetchRupPDF: PropTypes.func.isRequired,
    isFetchingPDF: PropTypes.bool.isRequired,
    errorFetchingPDF: PropTypes.bool.isRequired,
    planPDFBlob: PropTypes.shape({})
  }

  static defaultProps = {
    planPDFBlob: null
  }

  state = {
    // numPages: 1,
  }

  UNSAFE_componentWillMount() {
    const { fetchRupPDF, match } = this.props
    const { planId, agreementId } = match.params

    if (planId && agreementId) {
      fetchRupPDF(planId).then(() => {
        this.onDownloadClicked()
      })
    }
  }

  onDownloadClicked = () => {
    const { match, planPDFBlob } = this.props
    const { agreementId } = match.params
    downloadPDFBlob(planPDFBlob, this.donwloadPDFLink, `${agreementId}.pdf`)
  }

  // onLoadSuccess = ({ numPages }) => {
  //   this.setState({
  //     numPages,
  //   });
  // }

  setDownlaodPDFRef = ref => {
    this.donwloadPDFLink = ref
  }

  render() {
    const { planPDFBlob, isFetchingPDF, errorFetchingPDF } = this.props
    // const { numPages } = this.state;
    // const pages = Array.from(
    //   new Array(numPages),
    //   (el, index) => (
    //     <Page
    //       key={`page_${index + 1}`}
    //       pageIndex={index + 1}
    //       pageNumber={index + 1}
    //       scale={1.2}
    //     />
    //   ),
    // );

    return (
      <section className="rup-pdf">
        <a
          className="rup-pdf__link"
          href="download"
          ref={this.setDownlaodPDFRef}>
          link
        </a>

        {isFetchingPDF && <Loading />}

        {errorFetchingPDF && (
          <ErrorPage message="Error occurred while fetching pdf." />
        )}

        {planPDFBlob && (
          <div>
            If your download does not begin, please click the button to try
            again.
            <PrimaryButton
              inverted
              style={{ marginLeft: '10px' }}
              onClick={this.onDownloadClicked}>
              <Icon name="print" />
              Download PDF
            </PrimaryButton>
            <div className="rup-pdf__close-btn__container">
              <button
                className="rup-pdf__close-btn"
                onClick={() => window.close()}>
                Close window
              </button>
            </div>
          </div>
        )}

        {/* Compatibility issue with the most recent React version I think...
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
                // loading={<Loading />}
                onLoadSuccess={this.onLoadSuccess}
              >
                {pages}
              </Document>
            </div>
          </div> */}
      </section>
    )
  }
}

const mapStateToProps = state => ({
  planPDFBlob: getPlanPDF(state),
  isFetchingPDF: getIsFetchingPlanPDF(state),
  errorFetchingPDF: getPlanPDFErrorOccured(state)
})

export default connect(
  mapStateToProps,
  { fetchRupPDF }
)(PDFView)
