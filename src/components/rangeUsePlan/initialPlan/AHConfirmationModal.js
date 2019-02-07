import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal, Icon } from 'semantic-ui-react';
import { getUser, getConfirmationsMap } from '../../../reducers/rootReducer';
import { CONFIRMATION_OPTION } from '../../../constants/variables';
import { getUserFullName, getUserEmail } from '../../../utils';
import { updateRUPConfirmation } from '../../../actionCreators/planActionCreator';
import { planUpdated, confirmationUpdated } from '../../../actions';
import ConfirmChoiceTab from './confirmationTabs/ConfirmChoiceTab';
import LastTab from './confirmationTabs/LastTab';
import RequestClarificationTab from './confirmationTabs/RequestClarificationTab';

class AmendmentConfirmationModal extends Component {
  static propTypes = {
    user: PropTypes.shape({}).isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    plan: PropTypes.shape({}).isRequired,
    clients: PropTypes.arrayOf(PropTypes.object),
    confirmationsMap: PropTypes.shape({}).isRequired,
    updateRUPConfirmation: PropTypes.func.isRequired,
    confirmationUpdated: PropTypes.func.isRequired,
    planUpdated: PropTypes.func.isRequired,
  };

  static defaultProps = {
    clients: [],
  };

  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState = () => (
    {
      isAgreed: false,
      isConfirmating: false,
      confirmationOption: null,
      currTabId: 'confirmChoice',
    }
  )

  onClose = () => {
    this.setState(this.getInitialState());
    this.props.onClose();
  }

  onConfirmChoiceClicked = (e) => {
    console.log(e, 'onConfirmChoiceClicked');
  }

  handleTabChange = (e, { value: tabId }) => {
    this.setState({
      currTabId: tabId,
    });
  }

  handleSubmissionChoiceChange = (e, { value: confirmationOption }) => {
    if (confirmationOption === CONFIRMATION_OPTION.REQUEST) {
      this.setState({ confirmationOption, isAgreed: false });
      return;
    }

    this.setState({ confirmationOption });
  }

  handleAgreeCheckBoxChange = (e, { checked }) => {
    this.setState({ isAgreed: checked });
  }

  render() {
    const {
      confirmationOption,
      currTabId,
    } = this.state;
    const { open, plan, user } = this.props;
    const tabsMap = {
      confirmChoice: {
        id: 'confirmChoice',
        title: '1. Confirm you Submission Choice',
        next: confirmationOption === CONFIRMATION_OPTION.CONFIRM
          ? 'lastTab'
          : 'requestClarification',
        radio1: 'the range use plan will be automatically updated once all agreement holders have completed this step.',
        radio2: 'do not agree to the range use plan at this time and get information on options',
      },
      requestClarification: {
        id: 'requestClarification',
        title: '2. Request Clarification or Changes',
        back: 'confirmChoice',
        text1: `Please contact ${getUserFullName(plan.creator)}(${getUserEmail(user)}) who initiated this range use plan for clarification or to request changes.`,
        text2: `Submissions can only be recalled by ${getUserFullName(plan.creator)} who initiated this range use plan.`,
      },
      lastTab: {
        id: 'lastTab',
        title: 'Your confirmation has been saved',
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
          <ConfirmChoiceTab
            tab={tabsMap.confirmChoice}
            {...this.props}
            {...this.state}
            onClose={this.onClose}
            handleSubmissionChoiceChange={this.handleSubmissionChoiceChange}
            handleAgreeCheckBoxChange={this.handleAgreeCheckBoxChange}
            onConfirmChoiceClicked={this.onConfirmChoiceClicked}
            handleTabChange={this.handleTabChange}
          />

          <RequestClarificationTab
            tab={tabsMap.requestClarification}
            currTabId={currTabId}
            onClose={this.onClose}
            handleTabChange={this.handleTabChange}
          />

          <LastTab
            tab={tabsMap.lastTab}
            currTabId={currTabId}
            onClose={this.onClose}
            {...this.props}
          />
        </Modal.Content>
      </Modal>
    );
  }
}

const mapStateToProps = state => (
  {
    user: getUser(state),
    confirmationsMap: getConfirmationsMap(state),
  }
);

export default connect(mapStateToProps, {
  updateRUPConfirmation,
  planUpdated,
  confirmationUpdated,
})(AmendmentConfirmationModal);
