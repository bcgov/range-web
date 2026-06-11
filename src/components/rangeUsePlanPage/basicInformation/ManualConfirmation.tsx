import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ALREADY_SIGNED, PENDING_SUBMISSION, SIGN_MANUALLY } from '../../../constants/strings';
import { PrimaryButton } from '../../common';
import { isPlanAmendment, isUserStaff } from '../../../utils';
import { AMENDMENT_TYPE } from '../../../constants/variables';
import { updateRUPConfirmation } from '../../../actionCreators/planActionCreator';
import { getUser } from '../../../reducers/rootReducer';
import * as strings from '../../../constants/strings';
import { toastErrorMessage, toastSuccessMessage } from '../../../actionCreators';
import type { RootState } from '../../../configureStore';

interface Confirmation {
  id: number;
  confirmed: boolean;
  clientId?: number;
  [key: string]: any;
}

interface ManualConfirmationOwnProps {
  confirmation?: Confirmation;
  plan: any;
  fetchPlan: () => Promise<any>;
  amendmentTypes: any[];
}

interface ManualConfirmationStateProps {
  user: any;
}

interface ManualConfirmationDispatchProps {
  updateRUPConfirmation: (...args: any[]) => Promise<any>;
  toastSuccessMessage: (msg: string) => void;
}

type ManualConfirmationProps = ManualConfirmationOwnProps &
  ManualConfirmationStateProps &
  ManualConfirmationDispatchProps;

interface ManualConfirmationState {
  isConfirming: boolean;
}

class ManualConfirmation extends Component<ManualConfirmationProps, ManualConfirmationState> {
  constructor(props: ManualConfirmationProps) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState = (): ManualConfirmationState => ({
    isConfirming: false,
  });

  onManualConfirmation = async () => {
    const { confirmation, plan, user, amendmentTypes, updateRUPConfirmation, fetchPlan, toastSuccessMessage } =
      this.props;

    if (!confirmation) return;

    const onSuccess = async () => {
      fetchPlan().then(() => {
        this.setState({ isConfirming: false });
        toastSuccessMessage(strings.MANUAL_SIGNING_SUCCESS);
      });
    };
    const onError = (err: any) => {
      this.setState({ isConfirming: false });
      toastErrorMessage(strings.MANUAL_SIGNING_FAILUTE);
      throw err;
    };
    const minorAmendmentType = amendmentTypes.find((a: any) => a.code === AMENDMENT_TYPE.MINOR);
    const isMinorAmendment = isPlanAmendment(plan) && plan.amendmentTypeId === minorAmendmentType.id;
    this.setState({ isConfirming: true });
    try {
      const res = await updateRUPConfirmation(plan, user, confirmation.id, true, isMinorAmendment, false, true);
      onSuccess();
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
          <PrimaryButton key="pendingConfirmation" disabled inverted compact type="button">
            {PENDING_SUBMISSION}
          </PrimaryButton>
        )}
      </>
    );
  }
}

const mapStateToProps = (state: RootState): ManualConfirmationStateProps => ({
  user: getUser(state),
});

export default connect(mapStateToProps, {
  updateRUPConfirmation,
  toastSuccessMessage,
})(ManualConfirmation as any);
