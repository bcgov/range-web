import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  ALREADY_SIGNED,
  PENDING_SUBMISSION,
  SIGN_MANUALLY,
} from '../../../constants/strings';
import { PrimaryButton } from '../../common';
import { isPlanAmendment, isUserStaff } from '../../../utils';
import { AMENDMENT_TYPE } from '../../../constants/variables';
import { updateRUPConfirmation } from '../../../actionCreators/planActionCreator';
import { getUser } from '../../../reducers/rootReducer';
import * as strings from '../../../constants/strings';
import {
  toastErrorMessage,
  toastSuccessMessage,
} from '../../../actionCreators';

class ManualConfirmation extends Component {
  static propTypes = {
    confirmation: PropTypes.object,
    user: PropTypes.shape({}).isRequired,
    plan: PropTypes.shape({}).isRequired,
    updateRUPConfirmation: PropTypes.func.isRequired,
  };
  getInitialState = () => ({
    isConfirming: false,
  });

  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  onManualConfirmation = async (_) => {
    const {
      confirmation,
      plan,
      user,
      amendmentTypes,
      updateRUPConfirmation,
      fetchPlan,
      toastSuccessMessage,
    } = this.props;

    const onSuccess = async (data) => {
      fetchPlan().then(() => {
        this.setState({ isConfirming: false });
        toastSuccessMessage(strings.MANUAL_SIGNING_SUCCESS);
      });
    };
    const onError = (err) => {
      this.setState({ isConfirming: false });
      toastErrorMessage(strings.MANUAL_SIGNING_FAILUTE);
      throw err;
    };
    const minorAmendmentType = amendmentTypes.find(
      (a) => a.code === AMENDMENT_TYPE.MINOR,
    );
    const isMinorAmendment =
      isPlanAmendment(plan) && plan.amendmentTypeId === minorAmendmentType.id;
    this.setState({ isConfirming: true });
    try {
      const res = await updateRUPConfirmation(
        plan,
        user,
        confirmation.id,
        true,
        isMinorAmendment,
        false,
        true,
      );
      onSuccess(res);
    } catch (e) {
      onError(e);
    }
  };
  render() {
    const { confirmation, user } = this.props;
    const { isConfirming } = this.state;
    if (!confirmation) {
      return null;
    }
    return (
      <>
        {confirmation.confirmed ? (
          <PrimaryButton disabled inverted compact type="button">
            {ALREADY_SIGNED}
          </PrimaryButton>
        ) : user && isUserStaff(user) ? (
          <PrimaryButton
            key="confirmSubmissionBtn"
            onClick={this.onManualConfirmation}
            inverted
            compact
            loading={isConfirming}
            type="button"
          >
            {SIGN_MANUALLY}
          </PrimaryButton>
        ) : (
          <PrimaryButton
            key="pendingConfirmation"
            disabled
            inverted
            compact
            type="button"
          >
            {PENDING_SUBMISSION}
          </PrimaryButton>
        )}
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  user: getUser(state),
});

export default connect(mapStateToProps, {
  updateRUPConfirmation,
  toastSuccessMessage,
})(ManualConfirmation);
