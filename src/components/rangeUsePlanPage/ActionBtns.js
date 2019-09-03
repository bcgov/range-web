import React from 'react'
import { Button } from 'semantic-ui-react'
import { connect } from 'formik'
import {
  SAVE_DRAFT,
  SUBMIT,
  AMEND_PLAN,
  SIGN_SUBMISSION,
  AMEND_PLAN_CONFIRM_HEADER,
  AMEND_PLAN_CONFIRM_CONTENT
} from '../../constants/strings'
import { CONFIRMATION_MODAL_ID } from '../../constants/variables'
import DownloadPDFBtn from './DownloadPDFBtn'

const ActionBtns = ({
  canEdit,
  canAmend,
  canConfirm,
  canSubmit,
  canDownload,
  isSavingAsDraft,
  isSubmitting,
  isCreatingAmendment,
  onViewPDFClicked,
  onSaveDraftClick,
  onAmendPlanClicked,
  openSubmissionModal,
  openAHSignatureModal,
  openConfirmationModal,
  formik
}) => {
  const downloadPDFBtn = (
    <DownloadPDFBtn key="downloadPDFBtn" onClick={onViewPDFClicked} />
  )
  const saveDraftBtn = (
    <Button
      key="saveDraftBtn"
      type="button"
      inverted
      compact
      loading={formik.isSubmitting}
      onClick={() => {
        formik.setFieldValue('formStatus', 'draft')
        formik.submitForm()
      }}
      style={{ marginRight: '0', marginLeft: '10px' }}>
      {SAVE_DRAFT}
    </Button>
  )
  const submitBtn = (
    <Button
      key="submitBtn"
      inverted
      compact
      loading={isSubmitting}
      onClick={openSubmissionModal}
      style={{ marginRight: '0', marginLeft: '10px' }}>
      {SUBMIT}
    </Button>
  )
  const amendBtn = (
    <Button
      key="amendBtn"
      inverted
      compact
      content={AMEND_PLAN}
      loading={isCreatingAmendment}
      style={{ marginRight: '0', marginLeft: '10px' }}
      onClick={() => {
        openConfirmationModal({
          id: CONFIRMATION_MODAL_ID.AMEND_PLAN,
          header: AMEND_PLAN_CONFIRM_HEADER,
          content: AMEND_PLAN_CONFIRM_CONTENT,
          onYesBtnClicked: onAmendPlanClicked,
          closeAfterYesBtnClicked: true
        })
      }}
    />
  )
  const confirmSubmissionBtn = (
    <Button
      key="confirmSubmissionBtn"
      inverted
      compact
      style={{ marginRight: '0', marginLeft: '10px' }}
      onClick={openAHSignatureModal}>
      {SIGN_SUBMISSION}
    </Button>
  )

  if (canEdit) {
    return [downloadPDFBtn, saveDraftBtn, submitBtn]
  }
  if (canAmend) {
    return [downloadPDFBtn, amendBtn]
  }
  if (canConfirm) {
    return [downloadPDFBtn, confirmSubmissionBtn]
  }
  if (canSubmit) {
    return [downloadPDFBtn, submitBtn]
  }

  return downloadPDFBtn
}

export default connect(ActionBtns)
