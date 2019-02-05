/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal, Icon } from 'semantic-ui-react';
import { AMENDMENT_TYPE, REFERENCE_KEY, PLAN_STATUS, NUMBER_OF_LIMIT_FOR_NOTE } from '../../../constants/variables';
import { getReferences, getUser } from '../../../reducers/rootReducer';
import { updateRUP, createRUPStatusHistoryRecord } from '../../../actionCreators/planActionCreator';
import { planUpdated } from '../../../actions';
import { isSingleClient, isSubmittedAsMinor, isSubmittedAsMandatory, isMandatoryAmendment, isMinorAmendment, findStatusWithCode } from '../../../utils';
import ChooseSubmissionTypeTab from './ChooseSubmissionTypeTab';
import SubmitForFeedbackTab from './SubmitForFeedbackTab';
import SubmitForFinalDecisionTab from './SubmitForFinalDecisionTab';

class SubmissionModal extends Component {
  static propTypes = {
    user: PropTypes.shape({}).isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    plan: PropTypes.shape({}).isRequired,
    references: PropTypes.shape({}).isRequired,
    clients: PropTypes.arrayOf(PropTypes.object),
    // updateRUP: PropTypes.func.isRequired,
    // updateStatusAndContent: PropTypes.func.isRequired,
    // createRUPStatusHistoryRecord: PropTypes.func.isRequired,
  }

  static defaultProps = {
    clients: [],
  };

  state = {
    currTabId: 'chooseSubmissionType',
    statusCode: null,
  }

  onClose = () => {
    this.setState({
      currTabId: 'chooseSubmissionType',
      statusCode: null,
    });
    this.props.onClose();
  }

  handleStatusCodeChange = (e, { value: statusCode }) => {
    this.setState({ statusCode });
  }

  handleTabChange = (e, { value: tabId }) => {
    this.setState({
      currTabId: tabId,
    });
  }

  onSubmitClicked = (e) => {
    console.log(e, 'onSubmitClicked');
  }

  handleAgreeCheckBoxChange = (e) => {
    console.log(e, 'handleAgreeCheckBoxChange');
  }

  render() {
    const {
      open,
      clients,
      user,
      plan,
      references,
    } = this.props;
    const { currTabId, statusCode } = this.state;
    const tabsMap = {
      chooseSubmissionType: {
        id: 'chooseSubmissionType',
        title: '1. Ready to Submit? Choose Your Submission Type',
        back: null,
        next: statusCode === PLAN_STATUS.SUBMITTED_FOR_REVIEW
          ? 'submitForFeedback'
          : 'submitForFinalDecision',
        radio1: 'this is radio 1',
        radio2: 'this is radio 2',
      },
      submitForFeedback: {
        id: 'submitForFeedback',
        title: '2. Submit Your initial range use plan for Review',
        back: 'chooseSubmissionType',
        next: null,
        text1: 'You’re ready to submit an initial range use plan for Range staff review. You will be notified once the submission has been reviewed.',
      },
      submitForFinalDecision: {
        id: 'submitForFinalDecision',
        title: '3. Confirm Your Submission and eSignature',
        back: 'chooseSubmissionType',
        next: null,
        text1: 'You are about to submit your initial range use plan.',
        checkbox1: 'I understand that this submission constitues a legal document and eSignature. This submission will be reviewed the Range Staff.',
      },
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
          <ChooseSubmissionTypeTab
            currTabId={currTabId}
            tab={tabsMap.chooseSubmissionType}
            statusCode={statusCode}
            handleStatusCodeChange={this.handleStatusCodeChange}
            onCancelClicked={this.onClose}
            onNextClicked={this.handleTabChange}
          />

          <SubmitForFeedbackTab
            currTabId={currTabId}
            tab={tabsMap.submitForFeedback}
            isSubmitting={false}
            onBackClicked={this.handleTabChange}
            onSubmitClicked={this.onSubmitClicked}
          />

          <SubmitForFinalDecisionTab
            currTabId={currTabId}
            tab={tabsMap.submitForFinalDecision}
            isSubmitting={false}
            onBackClicked={this.handleTabChange}
            onSubmitClicked={this.onSubmitClicked}
            handleAgreeCheckBoxChange={this.handleAgreeCheckBoxChange}
            isAgreed={false}
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
  updateRUP,
  planUpdated,
  createRUPStatusHistoryRecord,
})(SubmissionModal);
