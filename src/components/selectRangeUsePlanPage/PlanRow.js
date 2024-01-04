import { Button, CircularProgress, Tooltip } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import EditIcon from '@material-ui/icons/Edit'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import ViewIcon from '@material-ui/icons/Visibility'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import * as API from '../../constants/api'
import { PLAN } from '../../constants/fields'
import { RANGE_USE_PLAN } from '../../constants/routes'
import * as strings from '../../constants/strings'
import {
  axios,
  canUserEditThisPlan,
  doesStaffOwnPlan,
  formatDateFromServer,
  getAuthHeaderConfig,
  isUserAgreementHolder,
  isUserStaff
} from '../../utils'
import { PrimaryButton, Status } from '../common'
import { canUserEdit } from '../common/PermissionsField'
import VersionsDropdown from '../rangeUsePlanPage/versionsList/VersionsDropdown'
import NewPlanButton from './NewPlanButton'
import { useStyles } from './SortableAgreementTable'
import { ThumbDown, ThumbUp } from '@material-ui/icons'

function PlanRow({ agreement, location, user, currentPage }) {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const canEdit = canUserEditThisPlan({ ...agreement.plan }, user)
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [voting, setVoting] = useState(false)
  const extendPlan = async planId => {
    setLoading(true)
    const response = await axios.put(
      API.EXTEND_PLAN(planId),
      {},
      getAuthHeaderConfig()
    )
    setLoading(false)
    history.push({
      pathname: `/range-use-plan/${response.data.newPlanId}`,
      state: {
        page: currentPage,
        prevSearch: location.search
      }
    })
  }

  const handleApprove = async planId => {
    setVoting(true)
    await axios.put(
      API.APPROVE_PLAN_EXTENSION(planId),
      {},
      getAuthHeaderConfig()
    )
    agreement.plan.requestedExtension = true
    setVoting(false)
  }
  const handleReject = async planId => {
    setVoting(true)
    await axios.put(
      API.REJECT_PLAN_EXTENSION(planId),
      {},
      getAuthHeaderConfig()
    )
    agreement.plan.requestedExtension = false
    setVoting(false)
  }
  return (
    <>
      <TableRow
        className={classes.root}
        hover
        tabIndex={-1}
        key={agreement.plan?.id}>
        <TableCell align="left" style={{ minWidth: 150 }}>
          {agreement.forestFileId}
          {agreement.plan?.id && (
            <IconButton
              aria-label="expand row"
              size="small"
              style={{ marginLeft: '3px' }}
              onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>

        <TableCell align="left">{agreement.plan?.rangeName ?? '-'}</TableCell>
        <TableCell align="left">
          {
            agreement.clients.find(client => client.clientTypeCode === 'A')
              ?.name
          }
        </TableCell>

        <TableCell align="left">
          {agreement.zone?.user
            ? `${agreement?.zone?.user?.givenName} ${agreement?.zone?.user?.familyName}`
            : 'Not provided'}
        </TableCell>

        <TableCell align="left">
          {agreement.agreementEndDate ? (
            formatDateFromServer(agreement?.agreementEndDate)
          ) : (
            <span>-</span>
          )}
        </TableCell>

        <TableCell align="left">
          {agreement.plan?.id ? (
            formatDateFromServer(agreement.plan.planEndDate)
          ) : (
            <span>-</span>
          )}
        </TableCell>
        <TableCell align="left">
          {agreement.plan?.extensionOf ? (
            <Button
              component={Link}
              to={{
                pathname: `${RANGE_USE_PLAN}/${agreement.plan?.extensionOf}`,
                state: {
                  page: currentPage,
                  prevSearch: location.search
                }
              }}>
              link
            </Button>
          ) : (
            <span></span>
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
                  prevSearch: location.search
                }
              }}
              endIcon={canEdit ? <EditIcon /> : <ViewIcon />}>
              {canEdit ? 'Edit' : strings.VIEW}
            </Button>
          )}
        </TableCell>
        <TableCell>
          {isUserStaff(user) &&
          doesStaffOwnPlan({ ...agreement.plan, agreement }, user) &&
          agreement.plan?.extensionStatus === 1 ? (
            agreement.plan?.extensionReceivedVotes ===
            agreement.plan?.extensionRequiredVotes ? (
              <PrimaryButton
                loading={loading}
                onClick={() => extendPlan(agreement.plan.id)}>
                Extend Plan
              </PrimaryButton>
            ) : (
              <div>
                {agreement.plan?.extensionReceivedVotes}/
                {agreement.plan?.extensionRequiredVotes}
              </div>
            )
          ) : isUserAgreementHolder(user) &&
            agreement.plan?.extensionStatus === 1 ? (
            agreement.plan?.requestedExtension === null ? (
              voting === true ? (
                <CircularProgress />
              ) : (
                <>
                  <Tooltip title="approve">
                    <IconButton
                      onClick={() => handleApprove(agreement.plan.id)}>
                      <ThumbUp />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="reject">
                    <IconButton onClick={() => handleReject(agreement.plan.id)}>
                      <ThumbDown />
                    </IconButton>
                  </Tooltip>
                </>
              )
            ) : agreement.plan?.requestedExtension === true ? (
              <>Requested</>
            ) : (
              <>Rejected</>
            )
          ) : (
            <div>-</div>
          )}
        </TableCell>
      </TableRow>
      {agreement.plan?.id && (
        <VersionsDropdown open={open} planId={agreement.plan.id} />
      )}
    </>
  )
}

export default PlanRow
