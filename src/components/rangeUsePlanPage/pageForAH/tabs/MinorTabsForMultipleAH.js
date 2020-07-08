import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import SubmitForFinalDecisionTab from '../submissionTabs/SubmitForFinalDecisionTab'
import RequestSignaturesTab from '../submissionTabs/RequestSignaturesTab'
import LastTab from '../submissionTabs/LastTab'
import { isSingleClient } from '../../../../utils'

class MinorTabsForMultipleAH extends Component {
  static propTypes = {
    user: PropTypes.shape({}).isRequired,
    isMandatory: PropTypes.bool.isRequired,
    clients: PropTypes.arrayOf(PropTypes.object).isRequired,
    isAgreed: PropTypes.bool.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    handleAgreeCheckBoxChange: PropTypes.func.isRequired,
    onSubmitClicked: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    handleTabChange: PropTypes.func.isRequired,
    currTabId: PropTypes.string.isRequired
  }

  static defaultProps = {}

  render() {
    const {
      user,
      clients,
      clientAgreements,
      isAgreed,
      isSubmitting,
      handleAgreeCheckBoxChange,
      onSubmitClicked,
      onClose,
      isMandatory,
      currTabId,
      handleTabChange
    } = this.props
    const tabsMap = {
      submitForFinalDecision: {
        id: 'submitForFinalDecision',
        title: '2. Finalize and Sign Your Submission and eSignature',
        back: 'chooseAmendmentType',
        next: 'requestSignatures',
        shouldSubmit: false,
        text1:
          'You are about to finalize and sign a minor amendment to your RUP. ' +
          'No approval is required for minor amendments. Your RUP will be automatically updated when all agreement holders have reviewed and signed the amendment. This amendment may be reviewed by range staff for consistency with minor amendment requirements.',
        text2:
          'You will be notified if it did not meet requirements including if it has been rescinded and you must follow your pre-amendment RUP.',
        checkbox1:
          'I understand that this submission constitues a legal document and eSignature.',
        rightBtn1: 'Next'
      },
      requestSignatures: {
        id: 'requestSignatures',
        title: '3. Confirm Signature and Submit',
        back: 'submitForFinalDecision',
        next: 'last',
        text1:
          'You’re ready to submit your Minor Amendment to your range use plan. The other agreement holders below will be notified to confirm the submission and provide eSignatures.',
        text2:
          'Once all agreement holders have confirmed the submission and provided their eSignatures, your RUP will be updated as approval is not required for minor amendments. This submission may be reviewed by range staff for consistency with minor amendment requirements.',
        text3:
          'All other agreement holders required to sign this amendment are listed below.'
      },
      last: {
        id: 'last',
        title:
          'You have successfully signed this minor amendment and submitted it to other agreement holders for signature',
        text1:
          'No approval is required for minor amendments. Your RUP will be automatically updated when all agreement holders have reviewed and signed the amendment. This amendment may be reviewed by range staff for consistency with minor amendment requirements.',
        text2:
          'You only will be notified if it did not meet requirements including if it has been rescinded and you must follow your pre-amendment RUP.'
      }
    }

    if (isMandatory || isSingleClient(clients)) {
      return null
    }

    return (
      <Fragment>
        <SubmitForFinalDecisionTab
          currTabId={currTabId}
          tab={tabsMap.submitForFinalDecision}
          isSubmitting={isSubmitting}
          handleTabChange={handleTabChange}
          onSubmitClicked={onSubmitClicked}
          handleAgreeCheckBoxChange={handleAgreeCheckBoxChange}
          isAgreed={isAgreed}
        />

        <RequestSignaturesTab
          currTabId={currTabId}
          tab={tabsMap.requestSignatures}
          clients={clients}
          clientAgreements={clientAgreements}
          user={user}
          isSubmitting={isSubmitting}
          handleTabChange={handleTabChange}
          onSubmitClicked={onSubmitClicked}
        />

        <LastTab currTabId={currTabId} tab={tabsMap.last} onClose={onClose} />
      </Fragment>
    )
  }
}

export default MinorTabsForMultipleAH
