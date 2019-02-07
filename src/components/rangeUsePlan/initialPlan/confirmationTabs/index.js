import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { CONFIRMATION_OPTION } from '../../../../constants/variables';
import { getUserFullName, getUserEmail } from '../../../../utils';
import ConfirmChoiceTab from './ConfirmChoiceTab';
import LastTab from './LastTab';
import RequestClarificationTab from './RequestClarificationTab';

class ConfirmationTabs extends Component {
  static propTypes = {
    user: PropTypes.shape({}).isRequired,
    plan: PropTypes.shape({}).isRequired,
    confirmationOption: PropTypes.string,
    onClose: PropTypes.func.isRequired,
  };

  static defaultProps = {
    confirmationOption: null,
  }

  state = {
    currTabId: 'confirmChoice',
  }

  handleTabChange = (e, { value: tabId }) => {
    this.setState({
      currTabId: tabId,
    });
  }

  render() {
    const { currTabId } = this.state;
    const { plan, user, confirmationOption, onClose } = this.props;
    const tabsMap = {
      confirmChoice: {
        id: 'confirmChoice',
        title: '1. Confirm you Submission Choice',
        next: confirmationOption === CONFIRMATION_OPTION.CONFIRM
          ? 'last'
          : 'requestClarification',
        radio1: 'the range use plan will be automatically updated'
          + ' once all agreement holders have completed this step.',
        radio2: 'do not agree to the range use plan at this time and get information on options',
      },
      requestClarification: {
        id: 'requestClarification',
        title: '2. Request Clarification or Changes',
        back: 'confirmChoice',
        text1: `Please contact ${getUserFullName(plan.creator)}(${getUserEmail(user)}) `
          + 'who initiated this range use plan for clarification or to request changes.',
        text2: 'Submissions can only be recalled by '
          + `${getUserFullName(plan.creator)} who initiated this range use plan.`,
      },
      last: {
        id: 'last',
        title: 'Your confirmation has been saved',
      },
    };

    return (
      <Fragment>
        <ConfirmChoiceTab
          {...this.props}
          tab={tabsMap.confirmChoice}
          currTabId={currTabId}
          handleTabChange={this.handleTabChange}
        />

        <RequestClarificationTab
          tab={tabsMap.requestClarification}
          currTabId={currTabId}
          handleTabChange={this.handleTabChange}
          onClose={onClose}
        />

        <LastTab
          {...this.props}
          tab={tabsMap.last}
          currTabId={currTabId}
        />
      </Fragment>
    );
  }
}

export default ConfirmationTabs;
