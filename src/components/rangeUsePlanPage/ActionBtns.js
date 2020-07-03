import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon, Menu, Dropdown } from 'semantic-ui-react'
import { connect } from 'formik'
import {
  SAVE_DRAFT,
  SUBMIT,
  AMEND_PLAN,
  SIGN_SUBMISSION,
  VIEW_VERSIONS
} from '../../constants/strings'
import DownloadPDFBtn from './DownloadPDFBtn'
import UpdateStatusDropdown from './pageForStaff/UpdateStatusDropdown'
import { useNetworkStatus } from '../../utils/hooks/network'
import { useCurrentPlan } from '../../providers/PlanProvider'
import DiscardAmendmentButton from './DiscardAmendmentButton'
import SubmitAsMandatoryButton from './SubmitAsMandatoryButton'
import AmendFromLegalButton from './AmendFromLegalButton'

const ActionBtns = ({
  permissions: permissionsOptions,
  isSubmitting,
  isCreatingAmendment,
  onViewPDFClicked,
  onViewVersionsClicked,
  onManageAgentsClicked,
  onSubmit,
  onSignSubmission,
  onAmend,
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
      }}>
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
      onClick={async () => {
        await formik.submitForm()
        const errors = await formik.validateForm()

        if (Object.keys(errors).length === 0) {
          onSubmit()
        }
      }}
      disabled={!isOnline}>
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
        onAmend()
      }}>
      <Icon name="edit" />
      {AMEND_PLAN}
    </Button>
  )
  const confirmSubmissionBtn = (
    <Button
      key="confirmSubmissionBtn"
      disabled={!isOnline}
      onClick={onSignSubmission}
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
  const manageAgentsMenuItem = (
    <Menu.Item key="manageAgentsBtn" onClick={onManageAgentsClicked}>
      <Icon name="user" />
      Manage Agents
    </Menu.Item>
  )

  const permissions = {
    edit: false,
    amend: false,
    amendFromLegal: false,
    confirm: false,
    submit: false,
    updateStatus: false,
    discard: false,
    submitAsMandatory: false,
    manageAgents: false,
    ...permissionsOptions
  }

  return (
    <>
      <div className="rup__actions__btns__buttons">
        {permissions.edit && saveDraftBtn}
        {permissions.submit && submitBtn}
        {permissions.amend && amendBtn}
        {permissions.confirm && confirmSubmissionBtn}
        {permissions.discard && <DiscardAmendmentButton />}
        {permissions.submitAsMandatory && <SubmitAsMandatoryButton />}
        {permissions.amendFromLegal && <AmendFromLegalButton />}
      </div>

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
          {permissions.manageAgents && manageAgentsMenuItem}
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
    discard: PropTypes.bool,
    submitAsMandatory: PropTypes.bool,
    amendFromLegal: PropTypes.bool,
    manageAgents: PropTypes.bool
  }),
  onViewPDFClicked: PropTypes.func,
  onViewVersionsClicked: PropTypes.func,
  onSubmit: PropTypes.func,
  onSignSubmission: PropTypes.func,
  onAmend: PropTypes.func
}

export default connect(ActionBtns)
