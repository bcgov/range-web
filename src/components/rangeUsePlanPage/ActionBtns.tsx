import React from 'react';
import { Button, Icon, Menu, Dropdown } from 'semantic-ui-react';
import { useFormikContext } from 'formik';
import { SAVE_DRAFT, SUBMIT, AMEND_PLAN, SIGN_SUBMISSION } from '../../constants/strings';
import DownloadPDFBtn from './DownloadPDFBtn';
import UpdateStatusDropdown from './pageForStaff/UpdateStatusDropdown';

const UntypedUpdateStatusDropdown = UpdateStatusDropdown as any;
import { useNetworkStatus } from '../../utils/hooks/network';
import { useCurrentPlan } from '../../providers/PlanProvider';
import DiscardAmendmentButton from './DiscardAmendmentButton';
import AmendFromLegalButton from './AmendFromLegalButton';

interface Permissions {
  edit?: boolean;
  amend?: boolean;
  amendFromLegal?: boolean;
  confirm?: boolean;
  submit?: boolean;
  updateStatus?: boolean;
  discard?: boolean;
  submitAsMandatory?: boolean;
  manageAgents?: boolean;
}

interface ActionBtnsProps {
  permissions?: Permissions;
  isSubmitting?: boolean;
  isCreatingAmendment?: boolean;
  onViewPDFClicked?: () => void;
  onManageAgentsClicked?: () => void;
  onSubmit?: () => void;
  onSignSubmission?: () => void;
  onAmend?: () => void;
  user?: any;
  plan?: any;
  isFetchingPlan?: boolean;
  fetchPlan?: () => void;
  beforeUpdateStatus?: () => Promise<void>;
}

const ActionBtns = ({
  permissions: permissionsOptions,
  isSubmitting,
  isCreatingAmendment,
  onViewPDFClicked,
  onManageAgentsClicked,
  onSubmit,
  onSignSubmission,
  onAmend,
  user,
  plan,
  isFetchingPlan,
  fetchPlan,
  beforeUpdateStatus,
}: ActionBtnsProps) => {
  const isOnline = useNetworkStatus();
  const { isSavingPlan } = useCurrentPlan()!;
  const formik = useFormikContext<any>();

  const downloadPDFBtn = <DownloadPDFBtn key="downloadPDFBtn" onClick={onViewPDFClicked} />;
  const saveDraftBtn = (
    <Button
      key="saveDraftBtn"
      type="button"
      inverted
      compact
      disabled={isSavingPlan}
      loading={formik.isSubmitting}
      onClick={() => {
        formik.submitForm();
      }}
    >
      <Icon name="save" />
      {SAVE_DRAFT}
    </Button>
  );
  const submitBtn = (
    <Button
      key="submitBtn"
      inverted
      compact
      type="button"
      loading={isSubmitting}
      onClick={async () => {
        await formik.submitForm();
        const errors = await formik.validateForm();

        if (Object.keys(errors).length === 0) {
          onSubmit?.();
        }
      }}
      disabled={!isOnline}
    >
      <Icon name="check" />
      {SUBMIT}
    </Button>
  );
  const amendBtn = (
    <Button
      key="amendBtn"
      inverted
      compact
      type="button"
      loading={isCreatingAmendment}
      disabled={!isOnline}
      onClick={() => {
        onAmend?.();
      }}
    >
      <Icon name="edit" />
      {AMEND_PLAN}
    </Button>
  );
  const confirmSubmissionBtn = (
    <Button key="confirmSubmissionBtn" disabled={!isOnline} onClick={onSignSubmission} inverted compact type="button">
      {SIGN_SUBMISSION}
    </Button>
  );
  const manageAgentsMenuItem = (
    <Menu.Item key="manageAgentsBtn" onClick={onManageAgentsClicked}>
      <Icon name="user" />
      Manage Agents
    </Menu.Item>
  );

  const permissions: Required<Permissions> = {
    edit: false,
    amend: false,
    amendFromLegal: false,
    confirm: false,
    submit: false,
    updateStatus: false,
    discard: false,
    submitAsMandatory: false,
    manageAgents: false,
    ...permissionsOptions,
  };

  return (
    <>
      <div className="rup__actions__btns__buttons">
        {permissions.edit && saveDraftBtn}
        {permissions.submit && submitBtn}
        {permissions.amend && amendBtn}
        {permissions.confirm && confirmSubmissionBtn}
        {permissions.discard && <DiscardAmendmentButton />}
        {permissions.amendFromLegal && <AmendFromLegalButton />}
      </div>

      <Dropdown
        trigger={
          <Button inverted compact type="button">
            Options
          </Button>
        }
        closeOnBlur
        icon={null}
        pointing="top right"
        style={{ marginLeft: 5 }}
        value={null as any}
      >
        <Dropdown.Menu>
          {downloadPDFBtn}
          {permissions.manageAgents && manageAgentsMenuItem}
          {permissions.updateStatus && (
            <UntypedUpdateStatusDropdown
              user={user}
              plan={plan}
              fetchPlan={fetchPlan!}
              isFetchingPlan={isFetchingPlan!}
              beforeUpdateStatus={beforeUpdateStatus}
            />
          )}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default ActionBtns;
