import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import { MuiIcon } from '../../common';
import { PLAN_STATUS, NUMBER_OF_LIMIT_FOR_NOTE } from '../../../constants/variables';
import { getReferences, getUser } from '../../../reducers/rootReducer';
import { planUpdated } from '../../../actions';
import { isSingleClient, findStatusWithCode, findConfirmationsWithUser } from '../../../utils';
import TabsForSingleAH from './tabs/TabsForSingleAH';
import TabsForMultipleAH from './tabs/TabsForMultipleAH';
import { updateRUPConfirmation } from '../../../actionCreators/planActionCreator';

interface SubmissionModalProps {
  user: any;
  open: boolean;
  onClose: () => void;
  plan: any;
  references: any;
  clients: any[];
  clientAgreements: any[];
  fetchPlan: () => Promise<any>;
  updateStatusAndContent: (...args: any[]) => any;
  planUpdated: (data: any) => void;
  updateRUPConfirmation: (...args: any[]) => Promise<any>;
}

interface SubmissionModalState {
  statusCode: string | null;
  isAgreed: boolean;
  note: string;
  isSubmitting: boolean;
}

class SubmissionModal extends Component<SubmissionModalProps, SubmissionModalState> {
  static defaultProps = {
    clients: [],
  };

  constructor(props: SubmissionModalProps) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState = (): SubmissionModalState => ({
    statusCode: null,
    isAgreed: false,
    note: '',
    isSubmitting: false,
  });

  onClose = () => {
    this.setState(this.getInitialState());
    this.props.onClose();
  };

  handleStatusCodeChange = (_e: any, { value: statusCode }: any) => {
    this.setState({ statusCode });
  };

  handleAgreeCheckBoxChange = (_e: any, { checked }: any) => {
    this.setState({ isAgreed: checked });
  };

  handleNoteChange = (_e: any, { value: note }: any) => {
    if (note.length <= NUMBER_OF_LIMIT_FOR_NOTE) {
      this.setState({ note });
    }
  };

  submitPlan = (plan: any, status: any) => {
    const { updateStatusAndContent, updateRUPConfirmation, fetchPlan, user, clientAgreements } = this.props;
    const { note } = this.state;

    const onRequest = () => {
      this.setState({ isSubmitting: true });
    };
    const onSuccess = async () => {
      const currUserConfirmations = findConfirmationsWithUser(user, plan.confirmations, clientAgreements);
      const confirmed = true;
      const isMinorAmendment = false;
      if (status.id === 14 || status.id === 18) {
        for (const currUserConfirmation of currUserConfirmations) {
          const isOwnSignature = user.clients.some((c: any) => c.clientNumber === currUserConfirmation.clientId);
          await updateRUPConfirmation(plan, user, currUserConfirmation.id, confirmed, isMinorAmendment, isOwnSignature);
        }
      }

      await fetchPlan();
      this.setState({ isSubmitting: false });
    };
    const onError = () => {
      this.onClose();
    };

    return updateStatusAndContent({ status, note }, onRequest, onSuccess, onError);
  };

  onSubmitClicked = (e: React.FormEvent) => {
    e.preventDefault();
    const { plan, references, clients } = this.props;
    const { statusCode } = this.state;
    const confirmationAwaiting = findStatusWithCode(references, PLAN_STATUS.AWAITING_CONFIRMATION);
    const status = findStatusWithCode(references, statusCode);
    const isSubmittedForFinal = statusCode === PLAN_STATUS.SUBMITTED_FOR_FINAL_DECISION;

    if (!isSingleClient(clients) && isSubmittedForFinal) {
      return this.submitPlan(plan, confirmationAwaiting);
    } else {
      return this.submitPlan(plan, status);
    }
  };

  render() {
    const { open, clients, user, clientAgreements } = this.props;
    const { isSubmitting, statusCode, isAgreed, note } = this.state;

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
          <TabsForSingleAH
            clients={clients}
            statusCode={statusCode}
            isAgreed={isAgreed}
            note={note}
            isSubmitting={isSubmitting}
            handleAgreeCheckBoxChange={this.handleAgreeCheckBoxChange}
            handleStatusCodeChange={this.handleStatusCodeChange}
            handleNoteChange={this.handleNoteChange}
            onSubmitClicked={this.onSubmitClicked}
            onClose={this.onClose}
          />

          <TabsForMultipleAH
            clients={clients}
            clientAgreements={clientAgreements}
            statusCode={statusCode}
            isAgreed={isAgreed}
            note={note}
            isSubmitting={isSubmitting}
            user={user}
            handleAgreeCheckBoxChange={this.handleAgreeCheckBoxChange}
            handleStatusCodeChange={this.handleStatusCodeChange}
            handleNoteChange={this.handleNoteChange}
            onSubmitClicked={this.onSubmitClicked}
            onClose={this.onClose}
          />
        </DialogContent>
      </Dialog>
    );
  }
}

const mapStateToProps = (state: any) => ({
  user: getUser(state),
  references: getReferences(state),
});

export default connect(mapStateToProps, {
  planUpdated,
  updateRUPConfirmation,
})(SubmissionModal as any);
