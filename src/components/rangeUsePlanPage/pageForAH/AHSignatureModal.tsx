import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import { MuiIcon } from '../../common';
import { getUser } from '../../../reducers/rootReducer';
import { CONFIRMATION_OPTION, REFERENCE_KEY, AMENDMENT_TYPE } from '../../../constants/variables';
import { isPlanAmendment, findConfirmationsWithUser } from '../../../utils';
import { updateRUPConfirmation } from '../../../actionCreators/planActionCreator';
import { planUpdated, confirmationUpdated } from '../../../actions';
import ConfirmationTabs from './tabs/ConfirmationTabs';

interface AHSignatureModalProps {
  user: any;
  open: boolean;
  onClose: () => void;
  plan: any;
  clients: any[];
  clientAgreements: any[];
  updateRUPConfirmation: (...args: any[]) => Promise<any>;
  confirmationUpdated: (data: any) => void;
  planUpdated: (data: any) => void;
  onSuccess?: () => void;
  references: any;
  updateStatusAndContent: any;
  fetchPlan: () => Promise<any>;
}

interface AHSignatureModalState {
  isAgreed: boolean;
  isConfirming: boolean;
  confirmationOption: string | null;
}

class AHSignatureModal extends Component<AHSignatureModalProps, AHSignatureModalState> {
  static defaultProps = {
    clients: [],
  };

  constructor(props: AHSignatureModalProps) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState = (): AHSignatureModalState => ({
    isAgreed: false,
    isConfirming: false,
    confirmationOption: null,
  });

  onClose = () => {
    this.setState(this.getInitialState());
    this.props.onClose();
  };

  handleConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    const { updateRUPConfirmation, plan, user, clientAgreements, confirmationUpdated, planUpdated, references } =
      this.props;

    const onRequest = () => this.setState({ isConfirming: true });
    const onSuccess = (data: any) => {
      const { allConfirmed, plan: updatedPlan, confirmation } = data;

      if (allConfirmed) {
        planUpdated({ plan: { ...plan, ...updatedPlan } });
      }

      confirmationUpdated({ confirmation });
      this.setState({ isConfirming: false });
      if (this.props.onSuccess) this.props.onSuccess();
    };
    const onError = (err: any) => {
      this.setState({ isConfirming: false });
      throw err;
    };

    const currUserConfirmations = findConfirmationsWithUser(user, plan.confirmations, clientAgreements);

    const confirmed = true;
    const amendmentTypes = references[REFERENCE_KEY.AMENDMENT_TYPE];
    const minorAmendmentType = amendmentTypes.find((a: any) => a.code === AMENDMENT_TYPE.MINOR);
    const isMinorAmendment = isPlanAmendment(plan) && plan.amendmentTypeId === minorAmendmentType.id;

    onRequest();

    try {
      let data: any;
      for (const currUserConfirmation of currUserConfirmations) {
        if (!currUserConfirmation.confirmed) {
          const isOwnSignature = user.clients.some((c: any) => c.clientNumber === currUserConfirmation.clientId);
          const res = await updateRUPConfirmation(
            plan,
            user,
            currUserConfirmation.id,
            confirmed,
            isMinorAmendment,
            isOwnSignature,
          );
          data = res;
        }
      }

      onSuccess(data);
    } catch (e) {
      onError(e);
    }
  };

  handleSubmissionChoiceChange = (_e: any, { value: confirmationOption }: any) => {
    if (confirmationOption === CONFIRMATION_OPTION.REQUEST) {
      this.setState({ confirmationOption, isAgreed: false });
      return;
    }

    this.setState({ confirmationOption });
  };

  handleAgreeCheckBoxChange = (_e: any, { checked }: any) => {
    this.setState({ isAgreed: checked });
  };

  render() {
    const { open } = this.props;
    const { isAgreed, isConfirming, confirmationOption } = this.state;

    return (
      <Dialog open={open} onClose={this.onClose} maxWidth="sm" fullWidth>
        <DialogContent sx={{ position: 'relative' }}>
          <IconButton
            aria-label="close"
            onClick={this.onClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
            size="small"
          >
            <MuiIcon name="close" />
          </IconButton>
          <ConfirmationTabs
            {...this.props}
            onClose={this.onClose}
            handleAgreeCheckBoxChange={this.handleAgreeCheckBoxChange}
            handleConfirmation={this.handleConfirmation}
            handleSubmissionChoiceChange={this.handleSubmissionChoiceChange}
            isAgreed={isAgreed}
            isConfirming={isConfirming}
            confirmationOption={confirmationOption}
          />
        </DialogContent>
      </Dialog>
    );
  }
}

const mapStateToProps = (state: any) => ({
  user: getUser(state),
});

export default connect(mapStateToProps, {
  updateRUPConfirmation,
  planUpdated,
  confirmationUpdated,
})(AHSignatureModal as any);
