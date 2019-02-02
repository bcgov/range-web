import React from 'react';
import { Button, Popup } from 'semantic-ui-react';
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
    <Popup
      trigger={
        <Button
          inverted
          compact
          key="amendBtn"
          disabled={isCreatingAmendment}
          style={{ marginRight: '0', marginLeft: '10px' }}
          content={AMEND_PLAN}
        />
      }
      content={
        <Button
          primary
          content="Confirm to amend"
          onClick={onAmendPlanClicked}
          loading={isCreatingAmendment}
        />
      }
      on="click"
      position="bottom right"
    />
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
