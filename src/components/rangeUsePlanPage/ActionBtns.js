import React from 'react'
import { Button } from 'semantic-ui-react'
import { connect } from 'formik'
import {
  SAVE_DRAFT,
  SUBMIT,
  AMEND_PLAN,
  SIGN_SUBMISSION,
  AMEND_PLAN_CONFIRM_HEADER,
  AMEND_PLAN_CONFIRM_CONTENT,
  VIEW_VERSIONS
} from '../../constants/strings'
import { CONFIRMATION_MODAL_ID } from '../../constants/variables'
import DownloadPDFBtn from './DownloadPDFBtn'

const ActionBtns = ({
  canEdit,
  canAmend,
  canConfirm,
  canSubmit,
  isSubmitting,
  isCreatingAmendment,
  onViewPDFClicked,
  onAmendPlanClicked,
  onViewVersionsClicked,
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
      type="button"
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
  const viewVersionsBtn = (
    <Button
      key="viewVersionnBtn"
      type="button"
      inverted
      compact
      style={{ marginRight: '0', marginLeft: '10px' }}
      onClick={onViewVersionsClicked}>
      {VIEW_VERSIONS}
    </Button>
  )

  if (canSubmit && !canEdit) {
    return [downloadPDFBtn, submitBtn]
  }
  if (canEdit && !canSubmit) {
    return [downloadPDFBtn, saveDraftBtn]
  }
  if (canEdit) {
    return [downloadPDFBtn, viewVersionsBtn, saveDraftBtn, submitBtn]
  }
  if (canAmend) {
    return [downloadPDFBtn, viewVersionsBtn, amendBtn]
  }
  if (canConfirm) {
    return [downloadPDFBtn, viewVersionsBtn, confirmSubmissionBtn]
  }
  if (canSubmit) {
    return [downloadPDFBtn, viewVersionsBtn, submitBtn]
  }

  return [downloadPDFBtn, viewVersionsBtn]
}

export default connect(ActionBtns)
