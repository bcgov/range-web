import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { fetchRupPDF, fetchRUP } from '../../actionCreators';
import { Loading, ErrorPage, PrimaryButton } from '../common';
import { getIsFetchingPlan, getPlanErrorOccured, getPlansMap } from '../../reducers/rootReducer';
import { generatePDF } from './pdf';

class PDFView extends Component {
  static propTypes = {
    match: PropTypes.shape({ params: PropTypes.object }).isRequired,
    fetchRUP: PropTypes.func.isRequired,
    isFetchingPlan: PropTypes.bool.isRequired,
    errorFetchingPlan: PropTypes.bool.isRequired,
    planMaps: PropTypes.shape({}),
  };

  static defaultProps = {
    planMaps: null,
  }

  state = {
    doc: null,
  }

  componentWillMount() {
    const { match, fetchRUP } = this.props;
    const { planId, agreementId } = match.params;

    if (planId && agreementId) {
      fetchRUP(planId).then((plan) => {
        const doc = generatePDF(plan);
        this.setState({
          doc,
        });
      });
    }
  }

  onDownloadClicked = () => {
    const { doc } = this.state;
    const { planMaps, match } = this.props;
    const { planId } = match.params;
    const plan = planMaps[planId];

    doc.output('save', `${plan.agreementId}.pdf`); // Try to save PDF as a file (not works on ie before 10, and some mobile devices)
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

export default connect(mapStateToProps, { fetchRupPDF, fetchRUP })(PDFView);
