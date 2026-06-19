import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import { MuiIcon } from '../../common';
import { NUMBER_OF_LIMIT_FOR_NOTE, REFERENCE_KEY, AMENDMENT_TYPE, PLAN_STATUS } from '../../../constants/variables';
import { getReferences, getUser } from '../../../reducers/rootReducer';
import { updateRUP } from '../../../actionCreators/planActionCreator';
import { planUpdated } from '../../../actions';
import {
  isMinorAmendment,
  isMandatoryAmendment,
  isSubmittedAsMinor,
  isSubmittedAsMandatory,
  findStatusWithCode,
  isSingleClient,
  findConfirmationsWithUser,
} from '../../../utils';
import MandatoryTabsForSingleAH from './tabs/MandatoryTabsForSingleAH';
import MandatoryTabsForMultipleAH from './tabs/MandatoryTabsForMultipleAH';
import MinorTabsForSingleAH from './tabs/MinorTabsForSingleAH';
import MinorTabsForMultipleAH from './tabs/MinorTabsForMultipleAH';
import ChooseAmendmentTypeTab from './submissionTabs/ChooseAmendmentTypeTab';
import { updateConfirmation } from '../../../api';

interface AmendmentSubmissionModalProps {
  user: any;
  open: boolean;
  onClose: () => void;
  plan: any;
  references: any;
  clients: any[];
  clientAgreements: any[];
  fetchPlan: () => Promise<any>;
  updateStatusAndContent: (...args: any[]) => any;
  updateRUP: (...args: any[]) => any;
  planUpdated: (data: any) => void;
}

interface AmendmentSubmissionModalState {
  currTabId: string;
  amendmentTypeCode: string | undefined;
  statusCode: string | undefined;
  isAgreed: boolean;
  isSubmitting: boolean;
  note: string;
}

class AmendmentSubmissionModal extends Component<AmendmentSubmissionModalProps, AmendmentSubmissionModalState> {
  static defaultProps = {
    clients: [],
  };

  constructor(props: AmendmentSubmissionModalProps) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState = (): AmendmentSubmissionModalState => ({
    currTabId: 'chooseAmendmentType',
    amendmentTypeCode: undefined,
    statusCode: undefined,
    isAgreed: false,
    isSubmitting: false,
    note: '',
  });

  onClose = () => {
    this.setState(this.getInitialState());
    this.props.onClose();
  };

  handleAmendmentTypeChange = (_e: any, { value: amendmentTypeCode }: any) => {
    this.setState({
      ...this.getInitialState(),
      amendmentTypeCode,
    });
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

  handleTabChange = (_e: any, { value: tabId }: any) => {
    this.setState({ currTabId: tabId });
  };

  submitAmendment = (plan: any, status: any, amendmentType: any) => {
    const { updateStatusAndContent, updateRUP, fetchPlan, user, clientAgreements } = this.props;
    const { note } = this.state;

    const onRequest = () => {
      this.setState({ isSubmitting: true });
    };
    const onSuccess = async () => {
      if (status.id === 18) {
        const currUserConfirmations = findConfirmationsWithUser(user, plan.confirmations, clientAgreements);

        for (const currUserConfirmation of currUserConfirmations) {
          const isOwnSignature = user.clients.some((c: any) => c.clientNumber === currUserConfirmation.clientId);

          await updateConfirmation({
            planId: plan.id,
            user,
            confirmationId: currUserConfirmation.id!,
            confirmed: true,
            isMinorAmendment: amendmentType.code === AMENDMENT_TYPE.MINOR,
            isOwnSignature,
          });
        }
      }

      await updateRUP(plan.id, {
        amendmentTypeId: amendmentType.id,
      });
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
    const { statusCode, amendmentTypeCode } = this.state;
    const { amendmentTypeId } = plan;
    const amendmentTypes = references[REFERENCE_KEY.AMENDMENT_TYPE];
    const minor = amendmentTypes.find((at: any) => at.code === AMENDMENT_TYPE.MINOR);
    const mandatory = amendmentTypes.find((at: any) => at.code === AMENDMENT_TYPE.MANDATORY);
    const confirmationAwaiting = findStatusWithCode(references, PLAN_STATUS.AWAITING_CONFIRMATION);
    const selectedStatusForMandatory = findStatusWithCode(references, statusCode);
    const isMinor = isMinorAmendment(amendmentTypeId, amendmentTypes, amendmentTypeCode);
    const isMandatory = isMandatoryAmendment(amendmentTypeId, amendmentTypes, amendmentTypeCode);
    plan.amendmentTypeId = isMinor ? minor.id : mandatory.id;

    if (isMinor && isSingleClient(clients)) {
      const standsNotReviewed = findStatusWithCode(references, PLAN_STATUS.STANDS_NOT_REVIEWED);
      return this.submitAmendment(plan, standsNotReviewed, minor);
    }

    if (isMinor && !isSingleClient(clients)) {
      return this.submitAmendment(plan, confirmationAwaiting, minor);
    }

    if (isMandatory && isSingleClient(clients)) {
      return this.submitAmendment(plan, selectedStatusForMandatory, mandatory);
    }

    if (isMandatory && !isSingleClient(clients)) {
      if (statusCode === PLAN_STATUS.SUBMITTED_FOR_FINAL_DECISION) {
        return this.submitAmendment(plan, confirmationAwaiting, mandatory);
      }
      return this.submitAmendment(plan, selectedStatusForMandatory, mandatory);
    }

    return null;
  };

  render() {
    const { open, references, plan, clients, user, clientAgreements } = this.props;
    const { amendmentTypeCode, currTabId } = this.state;
    const { amendmentTypeId } = plan;
    const amendmentTypes = references[REFERENCE_KEY.AMENDMENT_TYPE];
    const isSubmittedAsMinorAmendment = isSubmittedAsMinor(amendmentTypeId, amendmentTypes);
    const isSubmittedAsMandatoryAmendment = isSubmittedAsMandatory(amendmentTypeId, amendmentTypes);
    const isAmendmentTypeDecided = isSubmittedAsMinorAmendment || isSubmittedAsMandatoryAmendment;
    const isMinor = isMinorAmendment(amendmentTypeId, amendmentTypes, amendmentTypeCode);
    const isMandatory = isMandatoryAmendment(amendmentTypeId, amendmentTypes, amendmentTypeCode);
    const commonProps = {
      ...this.state,
      user,
      clients,
      clientAgreements,
      isAmendmentTypeDecided,
      isMinor,
      isMandatory,
      handleAmendmentTypeChange: this.handleAmendmentTypeChange,
      handleNoteChange: this.handleNoteChange,
      handleStatusCodeChange: this.handleStatusCodeChange,
      handleAgreeCheckBoxChange: this.handleAgreeCheckBoxChange,
      handleTabChange: this.handleTabChange,
      onSubmitClicked: this.onSubmitClicked,
      onClose: this.onClose,
    };
    const chooseAmendmentTypeTab = {
      id: 'chooseAmendmentType',
      title: '1. Ready to Submit? Choose Your Amendment Type',
      next: isMinor ? 'submitForFinalDecision' : 'chooseSubmissionType',
    };

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
          <ChooseAmendmentTypeTab
            {...commonProps}
            currTabId={currTabId}
            tab={chooseAmendmentTypeTab}
            handleTabChange={this.handleTabChange}
          />

          <MinorTabsForSingleAH {...commonProps} />

          <MinorTabsForMultipleAH {...commonProps} />

          <MandatoryTabsForSingleAH {...commonProps} />

          <MandatoryTabsForMultipleAH {...commonProps} />
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
  updateRUP,
})(AmendmentSubmissionModal as any);
