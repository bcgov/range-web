import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ChooseAmendmentTypeTab from './submissionTabs/ChooseAmendmentTypeTab';
import SubmitForFinalDecisionTab from './submissionTabs/SubmitForFinalDecisionTab';
import RequestSignaturesTab from './submissionTabs/RequestSignaturesTab';
import LastTab from './submissionTabs/LastTab';
import { isSingleClient } from '../../../utils';

class MinorTabsForMultipleAH extends Component {
  static propTypes = {
    user: PropTypes.shape({}).isRequired,
    isMandatory: PropTypes.bool.isRequired,
    isMinor: PropTypes.bool.isRequired,
    isAmendmentTypeDecided: PropTypes.bool,
    clients: PropTypes.arrayOf(PropTypes.object).isRequired,
    isAgreed: PropTypes.bool.isRequired,
    note: PropTypes.string.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    handleStatusCodeChange: PropTypes.func.isRequired,
    handleAgreeCheckBoxChange: PropTypes.func.isRequired,
    handleNoteChange: PropTypes.func.isRequired,
    onSubmitClicked: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isAmendmentTypeDecided: false,
  };

  state = {
    currTabId: 'chooseAmendmentType',
  }

  handleTabChange = (e, { value: tabId }) => {
    this.setState({
      currTabId: tabId,
    });
  }

  render() {
    const {
      user,
      clients,
      isAgreed,
      isSubmitting,
      handleAgreeCheckBoxChange,
      onSubmitClicked,
      onClose,
      isMandatory,
    } = this.props;
    const { currTabId } = this.state;
    const tabsMap = {
      chooseAmendmentType: {
        id: 'chooseAmendmentType',
        title: '1. Ready to Submit? Choose Your Amendment Type',
        next: 'submitForFinalDecision',
      },
      submitForFinalDecision: {
        id: 'submitForFinalDecision',
        title: '2. Finalize and Sign Your Submission and eSignature',
        back: 'chooseAmendmentType',
        next: 'requestSignatures',
        shouldSubmit: false,
        text1: 'You are about to finalize and sign a minor amendment to your RUP. '
          + 'No approval is required for minor amendments. Your RUP will be automatically updated when all agreement holders have reviewed and signed the amendment. This amendment may be reviewed by range staff for consistency with minor amendment requirements.',
        text2: 'You will be notified if it did not meet requirements including if it has been rescinded and you must follow your pre-amendment RUP.',
        checkbox1: 'I understand that this submission constitues a legal document and eSignature.',
        rightBtn1: 'Next',
      },
      requestSignatures: {
        id: 'requestSignatures',
        title: '3. Confirm Signature and Submit',
        back: 'submitForFinalDecision',
        next: 'last',
        text1: 'You’re ready to submit your Minor Amendment to your range use plan. The other agreement holders below will be notified to confirm the submission and provide eSignatures.',
        text2: 'Once all agreement holders have confirmed the submission and provided their eSignatures, your RUP will be updated as approval is not required for minor amendments. This submission may be reviewed by range staff for consistency with minor amendment requirements.',
        text3: 'All other agreement holders required to sign this amendment are listed below.',
      },
      last: {
        id: 'last',
        title: 'You have successfully signed this minor amendment and submitted it to other agreement holders for signature',
        text1: 'No approval is required for minor amendments. Your RUP will be automatically updated when all agreement holders have reviewed and signed the amendment. This amendment may be reviewed by range staff for consistency with minor amendment requirements.',
        text2: 'You only will be notified if it did not meet requirements including if it has been rescinded and you must follow your pre-amendment RUP.',
      },
    };

    if (isMandatory) {
      return null;
    }

    if (isSingleClient(clients)) {
      return null;
    }

    return (
      <Fragment>
        <ChooseAmendmentTypeTab
          {...this.props}
          currTabId={currTabId}
          tab={tabsMap.chooseAmendmentType}
          handleTabChange={this.handleTabChange}
          onCancelClicked={onClose}
        />

        <SubmitForFinalDecisionTab
          currTabId={currTabId}
          tab={tabsMap.submitForFinalDecision}
          isSubmitting={isSubmitting}
          handleTabChange={this.handleTabChange}
          onSubmitClicked={onSubmitClicked}
          handleAgreeCheckBoxChange={handleAgreeCheckBoxChange}
          isAgreed={isAgreed}
        />

        <RequestSignaturesTab
          currTabId={currTabId}
          tab={tabsMap.requestSignatures}
          clients={clients}
          user={user}
          isSubmitting={isSubmitting}
          handleTabChange={this.handleTabChange}
          onSubmitClicked={onSubmitClicked}
        />

        <LastTab
          currTabId={currTabId}
          tab={tabsMap.last}
          onClose={onClose}
        />
      </Fragment>
    );
  }
}

export default MinorTabsForMultipleAH;
