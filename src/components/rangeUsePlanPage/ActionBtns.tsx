import React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useFormikContext } from 'formik';
import { SAVE_DRAFT, SUBMIT, AMEND_PLAN, SIGN_SUBMISSION } from '../../constants/strings';
import DownloadPDFBtn from './DownloadPDFBtn';
import UpdateStatusDropdown from './pageForStaff/UpdateStatusDropdown';
import { MuiIcon } from '../common';

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
  isSubmitting: _isSubmitting,
  isCreatingAmendment: _isCreatingAmendment,
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
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const downloadPDFBtn = <DownloadPDFBtn key="downloadPDFBtn" onClick={onViewPDFClicked} />;
  const saveDraftBtn = (
    <Button
      key="saveDraftBtn"
      type="button"
      variant="outlined"
      disabled={isSavingPlan || formik.isSubmitting}
      onClick={() => {
        formik.submitForm();
      }}
      style={{ marginRight: 4 }}
    >
      <MuiIcon name="save" />
      {SAVE_DRAFT}
    </Button>
  );
  const submitBtn = (
    <Button
      key="submitBtn"
      variant="outlined"
      type="button"
      disabled={!isOnline}
      onClick={async () => {
        await formik.submitForm();
        const errors = await formik.validateForm();

        if (Object.keys(errors).length === 0) {
          onSubmit?.();
        }
      }}
      style={{ marginRight: 4 }}
    >
      <MuiIcon name="check" />
      {SUBMIT}
    </Button>
  );
  const amendBtn = (
    <Button
      key="amendBtn"
      variant="outlined"
      type="button"
      disabled={!isOnline}
      onClick={() => {
        onAmend?.();
      }}
      style={{ marginRight: 4 }}
    >
      <MuiIcon name="edit" />
      {AMEND_PLAN}
    </Button>
  );
  const confirmSubmissionBtn = (
    <Button
      key="confirmSubmissionBtn"
      disabled={!isOnline}
      onClick={onSignSubmission}
      variant="outlined"
      type="button"
      style={{ marginRight: 4 }}
    >
      {SIGN_SUBMISSION}
    </Button>
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

        <Button
          variant="outlined"
          type="button"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          style={{ marginLeft: 5 }}
        >
          Options
        </Button>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          {downloadPDFBtn}
          {permissions.manageAgents && (
            <MenuItem key="manageAgentsBtn" onClick={onManageAgentsClicked}>
              <ListItemIcon>
                <MuiIcon name="user" />
              </ListItemIcon>
              <ListItemText>Manage Agents</ListItemText>
            </MenuItem>
          )}
          {permissions.updateStatus && (
            <UntypedUpdateStatusDropdown
              user={user}
              plan={plan}
              fetchPlan={fetchPlan!}
              isFetchingPlan={isFetchingPlan!}
              beforeUpdateStatus={beforeUpdateStatus}
            />
          )}
        </Menu>
      </div>
    </>
  );
};

export default ActionBtns;
