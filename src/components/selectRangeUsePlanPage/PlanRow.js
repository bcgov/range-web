import IconButton from '@material-ui/core/IconButton';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import React, { useState } from 'react';
import { PLAN } from '../../constants/fields';
import {
  canUserEditThisPlan,
  doesStaffOwnPlan,
  formatDateFromServer,
  isPlanActive,
} from '../../utils';
import { Status } from '../common';
import { canUserEdit } from '../common/PermissionsField';
import VersionsDropdown from '../rangeUsePlanPage/versionsList/VersionsDropdown';
import { useStyles } from './SortableAgreementTable';
import ExtensionColumn from './ExtensionColumn';
import PlanActions from './PlanActions';

function PlanRow({ agreement, user, currentPage }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const canEdit = canUserEditThisPlan(
    { ...agreement.plan, agreement: agreement },
    user,
  );

  return (
    <>
      <TableRow
        className={classes.root}
        hover
        tabIndex={-1}
        key={agreement.plan?.id}
      >
        <TableCell align="left" style={{ minWidth: 150 }}>
          {agreement.forestFileId}
          {agreement.plan?.id && (
            <IconButton
              aria-label="expand row"
              size="small"
              style={{ marginLeft: '3px' }}
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>

        <TableCell align="left">{agreement.plan?.rangeName ?? '-'}</TableCell>
        <TableCell align="left">
          {
            agreement.clients.find((client) => client.clientTypeCode === 'A')
              ?.name
          }
        </TableCell>

        <TableCell align="left">
          {agreement.zone?.user
            ? `${agreement?.zone?.user?.givenName} ${agreement?.zone?.user?.familyName}`
            : 'Not provided'}
        </TableCell>

        <TableCell align="left">
          {agreement.plan?.id ? (
            formatDateFromServer(agreement.plan.planEndDate)
          ) : (
            <span>-</span>
          )}
        </TableCell>
        <TableCell align="left">{agreement.zone?.district?.code}</TableCell>
        <TableCell align="left">
          {agreement.plan?.id ? (
            <span>{agreement.plan.status.code}</span>
          ) : (
            <span>-</span>
          )}
        </TableCell>
        <TableCell align="left">
          {agreement.plan?.id ? (
            <Status user={user} status={agreement.plan.status} />
          ) : (
            <span>-</span>
          )}
        </TableCell>
        <TableCell>
          {!agreement.plan?.id &&
          !(
            canUserEdit(PLAN.ADD, user) && doesStaffOwnPlan({ agreement }, user)
          ) ? (
            <div style={{ padding: '6px 16px' }}>No plan</div>
          ) : (
            <PlanActions
              agreement={agreement}
              planId={agreement.plan?.id}
              canEdit={canEdit}
              currentPage={currentPage}
              canCreatePlan={
                canUserEdit(PLAN.ADD, user) &&
                doesStaffOwnPlan({ agreement }, user)
              }
            ></PlanActions>
          )}
        </TableCell>
        <TableCell>
          {isPlanActive(agreement.plan) && agreement.plan?.extensionStatus ? (
            <ExtensionColumn
              user={user}
              currentPage={currentPage}
              agreement={agreement}
            />
          ) : (
            <div>-</div>
          )}
        </TableCell>
      </TableRow>
      {agreement.plan?.id && (
        <>
          <VersionsDropdown open={open} planId={agreement.plan.id} />
        </>
      )}
    </>
  );
}

export default PlanRow;
