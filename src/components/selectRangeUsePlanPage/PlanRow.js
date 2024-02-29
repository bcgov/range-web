import { Button } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import EditIcon from '@material-ui/icons/Edit';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import ViewIcon from '@material-ui/icons/Visibility';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PLAN } from '../../constants/fields';
import { RANGE_USE_PLAN } from '../../constants/routes';
import * as strings from '../../constants/strings';
import {
  canUserEditThisPlan,
  doesStaffOwnPlan,
  formatDateFromServer,
} from '../../utils';
import { Status } from '../common';
import { canUserEdit } from '../common/PermissionsField';
import VersionsDropdown from '../rangeUsePlanPage/versionsList/VersionsDropdown';
import NewPlanButton from './NewPlanButton';
import { useStyles } from './SortableAgreementTable';
import ExtensionColumn from './ExtensionColumn';

function PlanRow({ agreement, location, user, currentPage }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const canEdit = canUserEditThisPlan({ ...agreement.plan }, user);

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
          {!agreement.plan?.id ? (
            canUserEdit(PLAN.ADD, user) &&
            doesStaffOwnPlan({ agreement }, user) ? (
              <NewPlanButton agreement={agreement} />
            ) : (
              <div style={{ padding: '6px 16px' }}>No plan</div>
            )
          ) : (
            <Button
              fullWidth
              variant="outlined"
              component={Link}
              to={{
                pathname: `${RANGE_USE_PLAN}/${agreement.plan?.id}`,
                state: {
                  page: currentPage,
                  prevSearch: location.search,
                },
              }}
              endIcon={canEdit ? <EditIcon /> : <ViewIcon />}
            >
              {canEdit ? 'Edit' : strings.VIEW}
            </Button>
          )}
        </TableCell>
        <TableCell>
          {agreement.plan?.extensionStatus ? (
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
        <VersionsDropdown open={open} planId={agreement.plan.id} />
      )}
    </>
  );
}

export default PlanRow;
