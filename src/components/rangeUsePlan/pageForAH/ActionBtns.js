import React from 'react';
import { Button, Popup } from 'semantic-ui-react';
import { DOWNLOAD_PDF, SAVE_DRAFT, SUBMIT, AMEND_PLAN, SIGN_SUBMISSION } from '../../../constants/strings';

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
  onAmendPlanClicked,
  openSubmissionModal,
  openConfirmationModal,
}) => {
  const previewPDFBtn = (
    <Button
      key="previewPDFBtn"
      inverted
      compact
      onClick={onViewPDFClicked}
      style={{ marginRight: '0' }}
    >
      {DOWNLOAD_PDF}
    </Button>
  );
  const saveDraftBtn = (
    <Button
      key="saveDraftBtn"
      inverted
      compact
      loading={isSavingAsDraft}
      onClick={onSaveDraftClick}
      style={{ marginRight: '0', marginLeft: '10px' }}
    >
      {SAVE_DRAFT}
    </Button>
  );
  const submitBtn = (
    <Button
      key="submitBtn"
      inverted
      compact
      loading={isSubmitting}
      onClick={openSubmissionModal}
      style={{ marginRight: '0', marginLeft: '10px' }}
    >
      {SUBMIT}
    </Button>
  );
  const amendPopup = (
    <Popup
      key="amendPopup"
      trigger={
        <Button
          inverted
          compact
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
  const confirmSubmissionBtn = (
    <Button
      key="confirmSubmissionBtn"
      inverted
      compact
      style={{ marginRight: '0', marginLeft: '10px' }}
      onClick={openConfirmationModal}
    >
      {SIGN_SUBMISSION}
    </Button>
  );

  if (canEdit) {
    return [previewPDFBtn, saveDraftBtn, submitBtn];
  }
  if (canAmend) {
    return [previewPDFBtn, amendPopup];
  }
  if (canConfirm) {
    return [previewPDFBtn, confirmSubmissionBtn];
  }
  if (canSubmit) {
    return [previewPDFBtn, submitBtn];
  }

  return previewPDFBtn;
};

export default ActionBtns;
