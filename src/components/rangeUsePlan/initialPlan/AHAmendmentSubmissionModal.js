import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal, Icon } from 'semantic-ui-react';
import { NUMBER_OF_LIMIT_FOR_NOTE, REFERENCE_KEY } from '../../../constants/variables';
import { getReferences, getUser } from '../../../reducers/rootReducer';
import { createRUPStatusRecord } from '../../../actionCreators/planActionCreator';
import { planUpdated } from '../../../actions';
import { isMinorAmendment, isMandatoryAmendment, isSubmittedAsMinor, isSubmittedAsMandatory } from '../../../utils';
import MandatoryTabsForSingleAH from './MandatoryTabsForSingleAH';
import MandatoryTabsForMultipleAH from './MandatoryTabsForMultipleAH';
import MinorTabsForSingleAH from './MinorTabsForSingleAH';
import MinorTabsForMultipleAH from './MinorTabsForMultipleAH';

class AHAmendmentSubmissionModal extends Component {
  static propTypes = {
    user: PropTypes.shape({}).isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    plan: PropTypes.shape({}).isRequired,
    references: PropTypes.shape({}).isRequired,
    clients: PropTypes.arrayOf(PropTypes.object),
    fetchPlan: PropTypes.func.isRequired,
    updateStatusAndContent: PropTypes.func.isRequired,
    createRUPStatusRecord: PropTypes.func.isRequired,
  }

  static defaultProps = {
    clients: [],
  };

  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState = () => ({
    amendmentTypeCode: null,
    statusCode: null,
    isAgreed: false,
    isSubmitting: false,
    note: '',
  })

  onClose = () => {
    this.setState(this.getInitialState());
    this.props.onClose();
  }


  handleAmendmentTypeChange = (e, { value: amendmentTypeCode }) => {
    this.setState({
      ...this.getInitialState(),
      amendmentTypeCode,
    });
  }

  handleStatusCodeChange = (e, { value: statusCode }) => {
    this.setState({ statusCode });
  }

  handleAgreeCheckBoxChange = (e, { checked }) => {
    this.setState({ isAgreed: checked });
  }

  handleNoteChange = (e, { value: note }) => {
    if (note.length <= NUMBER_OF_LIMIT_FOR_NOTE) {
      this.setState({ note });
    }
  }

  submitPlan = (plan, planStatus) => {
    // const {
    //   updateStatusAndContent,
    //   createRUPStatusRecord,
    //   fetchPlan,
    // } = this.props;
    // const { note } = this.state;

    // const onRequest = () => {
    //   this.setState({ isSubmitting: true });
    // };
    // const onSuccess = async () => {
    //   if (note) {
    //     await createRUPStatusRecord(plan, planStatus, note);
    //   }
    //   await fetchPlan();
    //   this.setState({ isSubmitting: false });
    // };
    // const onError = () => {
    //   this.onClose();
    // };

    // return updateStatusAndContent(planStatus, onRequest, onSuccess, onError);
  }

  onSubmitClicked = (e) => {
    // e.preventDefault();
    // const { plan, references, clients } = this.props;
    // const { statusCode } = this.state;
    // const confirmationAwaiting = findStatusWithCode(references, PLAN_STATUS.AWAITING_CONFIRMATION);
    // const status = findStatusWithCode(references, statusCode);
    // const isSubmittedForFinal = statusCode === PLAN_STATUS.SUBMITTED_FOR_FINAL_DECISION;

    // if (!isSingleClient(clients) && isSubmittedForFinal) {
    //   return this.submitPlan(plan, confirmationAwaiting);
    // } else {
    //   return this.submitPlan(plan, status);
    // }
  }

  render() {
    const { open, references, plan, clients, user } = this.props;
    const { amendmentTypeCode } = this.state;
    const { amendmentTypeId } = plan;
    const amendmentTypes = references[REFERENCE_KEY.AMENDMENT_TYPE];
    const isSubmittedAsMinorAmendment = isSubmittedAsMinor(amendmentTypeId, amendmentTypes);
    const isSubmittedAsMandatoryAmendment = isSubmittedAsMandatory(amendmentTypeId, amendmentTypes);
    const isAmendmentTypeDecided = isSubmittedAsMinorAmendment || isSubmittedAsMandatoryAmendment;
    const isMinor = isMinorAmendment(amendmentTypeId, amendmentTypes, amendmentTypeCode);
    const isMandatory = isMandatoryAmendment(amendmentTypeId, amendmentTypes, amendmentTypeCode);
    const commonProps = {
      ...this.state,
      isAmendmentTypeDecided,
      isMinor,
      isMandatory,
      clients,
      handleAmendmentTypeChange: this.handleAmendmentTypeChange,
      handleNoteChange: this.handleNoteChange,
      handleStatusCodeChange: this.handleStatusCodeChange,
      handleAgreeCheckBoxChange: this.handleAgreeCheckBoxChange,
      onSubmitClicked: this.onSubmitClicked,
      onClose: this.onClose,
    };

    return (
      <Modal
        dimmer="blurring"
        size="tiny"
        open={open}
        onClose={this.onClose}
        closeIcon={<Icon name="close" color="black" />}
      >
        <Modal.Content>
          <MinorTabsForSingleAH {...commonProps} />

          <MinorTabsForMultipleAH
            {...commonProps}
            user={user}
          />

          <MandatoryTabsForSingleAH {...commonProps} />

          <MandatoryTabsForMultipleAH
            {...commonProps}
            user={user}
          />
        </Modal.Content>
      </Modal>
    );
  }
}

const mapStateToProps = state => (
  {
    user: getUser(state),
    references: getReferences(state),
  }
);

export default connect(mapStateToProps, {
  planUpdated,
  createRUPStatusRecord,
})(AHAmendmentSubmissionModal);
