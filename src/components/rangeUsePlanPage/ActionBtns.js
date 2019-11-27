import React from 'react'
import { Button, Icon, Menu, Dropdown } from 'semantic-ui-react'
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
import UpdateStatusDropdown from './pageForStaff/UpdateStatusDropdown'

const ActionBtns = ({
  canEdit,
  canAmend,
  canConfirm,
  canSubmit,
  canUpdateStatus,
  isSubmitting,
  isCreatingAmendment,
  onViewPDFClicked,
  onAmendPlanClicked,
  onViewVersionsClicked,
  openSubmissionModal,
  openAHSignatureModal,
  openConfirmationModal,
  formik,
  plan,
  isFetchingPlan,
  fetchPlan
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
      <Icon name="save" />
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
      <Icon name="check" />
      {SUBMIT}
    </Button>
  )
  const amendMenuItem = (
    <Menu.Item
      key="amendBtn"
      loading={isCreatingAmendment}
      onClick={() => {
        openConfirmationModal({
          id: CONFIRMATION_MODAL_ID.AMEND_PLAN,
          header: AMEND_PLAN_CONFIRM_HEADER,
          content: AMEND_PLAN_CONFIRM_CONTENT,
          onYesBtnClicked: onAmendPlanClicked,
          closeAfterYesBtnClicked: true
        })
      }}>
      <Icon name="edit" />
      {AMEND_PLAN}
    </Menu.Item>
  )
  const confirmSubmissionMenuItem = (
    <Menu.Item key="confirmSubmissionBtn" onClick={openAHSignatureModal}>
      {SIGN_SUBMISSION}
    </Menu.Item>
  )
  const viewVersionsMenuItem = (
    <Menu.Item key="viewVersionBtn" onClick={onViewVersionsClicked}>
      <Icon name="history" />
      {VIEW_VERSIONS}
    </Menu.Item>
  )

  return (
    <>
      {canEdit && saveDraftBtn}
      {canSubmit && submitBtn}
      <Dropdown
        trigger={<Icon name="ellipsis vertical" inverted />}
        closeOnBlur
        icon={null}
        pointing="top right"
        style={{ marginLeft: 10 }}
        value={null}>
        <Dropdown.Menu>
          {downloadPDFBtn}
          {viewVersionsMenuItem}
          {canConfirm && confirmSubmissionMenuItem}
          {canAmend && amendMenuItem}
          {canUpdateStatus && (
            <UpdateStatusDropdown
              plan={plan}
              fetchPlan={fetchPlan}
              isFetchingPlan={isFetchingPlan}
            />
          )}
        </Dropdown.Menu>
      </Dropdown>
    </>
  )
}

export default connect(ActionBtns)
