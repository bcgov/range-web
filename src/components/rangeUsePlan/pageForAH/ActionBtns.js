import React from 'react';
import { Button } from 'semantic-ui-react';
import { DOWNLOAD_PDF, SAVE_DRAFT, SUBMIT, AMEND_PLAN, CONFIRM_SUBMISSION } from '../../../constants/strings';

const ActionBtns = ({
  canEdit,
  canAmend,
  canConfirm,
  canSubmit,
  isSavingAsDraft,
  isSubmitting,
  isCreatingAmendment,
  onViewPDFClicked,
  onSaveDraftClick,
  openSubmitConfirmModal,
  onAmendPlanClicked,
  openConfirmAmendmentModal,
}) => {
  const previewPDF = (
    <Button
      inverted
      compact
      key="previewPDFBtn"
      onClick={onViewPDFClicked}
      style={{ marginRight: '0' }}
    >
      {DOWNLOAD_PDF}
    </Button>
  );
  const saveDraft = (
    <Button
      inverted
      compact
      key="saveDraftBtn"
      loading={isSavingAsDraft}
      onClick={onSaveDraftClick}
      style={{ marginRight: '0', marginLeft: '10px' }}
    >
      {SAVE_DRAFT}
    </Button>
  );
  const submit = (
    <Button
      inverted
      compact
      key="submitBtn"
      loading={isSubmitting}
      onClick={openSubmitConfirmModal}
      style={{ marginRight: '0', marginLeft: '10px' }}
    >
      {SUBMIT}
    </Button>
  );
  const amend = (
    <Button
      inverted
      compact
      key="amendBtn"
      loading={isCreatingAmendment}
      onClick={onAmendPlanClicked}
      style={{ marginRight: '0', marginLeft: '10px' }}
    >
      {AMEND_PLAN}
    </Button>
  );
  const confirmSubmission = (
    <Button
      inverted
      compact
      key="confirmSubmissionBtn"
      style={{ marginRight: '0', marginLeft: '10px' }}
      onClick={openConfirmAmendmentModal}
    >
      {CONFIRM_SUBMISSION}
    </Button>
  );
  if (canEdit) {
    return [previewPDF, saveDraft, submit];
  }
  if (canAmend) {
    return [previewPDF, amend];
  }
  if (canConfirm) {
    return [previewPDF, confirmSubmission];
  }
  if (canSubmit) {
    return [previewPDF, submit];
  }

  return previewPDF;
};

export default ActionBtns;
