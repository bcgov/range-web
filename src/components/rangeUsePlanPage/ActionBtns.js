import React from 'react'
import PropTypes from 'prop-types'
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
import { useNetworkStatus } from '../../utils/hooks/network'
import { useCurrentPlan } from '../../providers/PlanProvider'
import DiscardAmendmentButton from './DiscardAmendmentButton'

const ActionBtns = ({
  permissions: permissionsOptions,
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
  fetchPlan,
  beforeUpdateStatus
}) => {
  const isOnline = useNetworkStatus()
  const { isSavingPlan } = useCurrentPlan()

  const downloadPDFBtn = (
    <DownloadPDFBtn key="downloadPDFBtn" onClick={onViewPDFClicked} />
  )
  const saveDraftBtn = (
    <Button
      key="saveDraftBtn"
      type="button"
      inverted
      compact
      disabled={isSavingPlan}
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
      disabled={!isOnline}
      style={{ marginRight: '0', marginLeft: '10px' }}>
      <Icon name="check" />
      {SUBMIT}
    </Button>
  )
  const amendBtn = (
    <Button
      key="amendBtn"
      inverted
      compact
      type="button"
      loading={isCreatingAmendment}
      disabled={!isOnline}
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
    </Button>
  )
  const confirmSubmissionBtn = (
    <Button
      key="confirmSubmissionBtn"
      disabled={!isOnline}
      onClick={openAHSignatureModal}
      inverted
      compact
      type="button">
      {SIGN_SUBMISSION}
    </Button>
  )
  const viewVersionsMenuItem = (
    <Menu.Item key="viewVersionBtn" onClick={onViewVersionsClicked}>
      <Icon name="history" />
      {VIEW_VERSIONS}
    </Menu.Item>
  )

  const permissions = {
    edit: false,
    amend: false,
    confirm: false,
    submit: false,
    updateStatus: false,
    discard: false,
    submitAsMandatory: false,
    ...permissionsOptions
  }

  return (
    <>
      {permissions.edit && saveDraftBtn}
      {permissions.submit && submitBtn}
      {permissions.amend && amendBtn}
      {permissions.confirm && confirmSubmissionBtn}
      {permissions.discard && <DiscardAmendmentButton />}

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
          {permissions.updateStatus && (
            <UpdateStatusDropdown
              plan={plan}
              fetchPlan={fetchPlan}
              isFetchingPlan={isFetchingPlan}
              beforeUpdateStatus={beforeUpdateStatus}
            />
          )}
        </Dropdown.Menu>
      </Dropdown>
    </>
  )
}

ActionBtns.propTypes = {
  permissions: PropTypes.shape({
    edit: PropTypes.bool,
    amend: PropTypes.bool,
    confirm: PropTypes.bool,
    submit: PropTypes.bool,
    updateStatus: PropTypes.bool,
    discard: PropTypes.bool
  })
}

export default connect(ActionBtns)
