import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Typography from '@material-ui/core/Typography'
import Skeleton from '@material-ui/lab/Skeleton'
import EditIcon from '@material-ui/icons/Edit'
import ViewIcon from '@material-ui/icons/Visibility'
import { Link, useLocation } from 'react-router-dom'
import { RANGE_USE_PLAN } from '../../constants/routes'
import * as strings from '../../constants/strings'
import { Status } from '../common'
import { Button } from '@material-ui/core'
import { useUser } from '../../providers/UserProvider'
import NewPlanButton from './NewPlanButton'
import { canUserEditThisPlan, doesStaffOwnPlan } from '../../utils'
import { canUserEdit } from '../common/PermissionsField'
import { PLAN } from '../../constants/fields'
import VersionsDropdown from '../rangeUsePlanPage/versionsList/VersionsDropdown'
import IconButton from '@material-ui/core/IconButton'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'

const headCells = [
  {
    id: 'agreement.forest_file_id',
    numeric: false,
    disablePadding: false,
    label: 'RAN #',
    sortable: true
  },
  {
    id: 'plan.range_name',
    numeric: false,
    disablePadding: false,
    label: 'Range Name',
    sortable: true
  },
  {
    id: 'agreement_holder.name',
    numeric: false,
    disablePadding: false,
    label: 'Primary Agreement Holder',
    sortable: true
  },
  {
    id: 'plan_creator.given_name',
    numeric: false,
    disablePadding: false,
    label: 'Staff Contact',
    sortable: true
  },
  {
    id: 'plan_status.code',
    disablePadding: false,
    label: 'Status Code',
    sortable: true
  },
  {
    id: 'plan.status',
    numeric: false,
    disablePadding: false,
    label: 'Status'
  },
  { id: 'actions', disablePadding: true }
]

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props
  const createSortHandler = property => event => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
            className={classes.headerCell}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={headCell.sortable && createSortHandler(headCell.id)}
              hideSortIcon={!headCell.sortable}
              disabled={!headCell.sortable}>
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(2),
    '& > *': {
      borderBottom: 'unset'
    }
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 750
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1
  },
  skeletonRow: {
    height: 20,
    width: '100%'
  },
  skeletonButton: {
    width: '130px',
    height: 33.4
  },
  skeletonRowContainer: {
    padding: 0
  },
  headerCell: {
    borderBottomColor: theme.palette.secondary.main,
    borderBottomWidth: 2
  }
}))

function PlanRow({ agreement, location, user, currentPage }) {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const canEdit = canUserEditThisPlan(
    { ...agreement.plans[0], agreement },
    user
  )
  return (
    <>
      <TableRow className={classes.root} hover tabIndex={-1} key={agreement.id}>
        <TableCell align="left" style={{ minWidth: 150 }}>
          {agreement.forestFileId}
          {agreement?.plans[0]?.id && (
            <IconButton
              aria-label="expand row"
              size="small"
              style={{ marginLeft: '3px' }}
              onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>

        <TableCell align="left">
          {agreement.plans[0]?.rangeName ?? '-'}
        </TableCell>
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
          {agreement.plans[0] ? (
            agreement.plans[0]?.status.code
          ) : (
            <span>-</span>
          )}
        </TableCell>
        <TableCell align="left">
          {agreement.plans[0] ? (
            <Status user={user} status={agreement.plans[0]?.status} />
          ) : (
            <span>-</span>
          )}
        </TableCell>
        <TableCell>
          {agreement.plans.length === 0 ? (
            canUserEdit(PLAN.ADD, user) &&
            doesStaffOwnPlan({ ...agreement.plans[0], agreement }, user) ? (
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
                pathname: `${RANGE_USE_PLAN}/${agreement.plans[0].id}`,
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
      </TableRow>
      {agreement?.plans.length > 0 && (
        <VersionsDropdown
          open={open}
          planId={agreement?.plans[0]?.id}></VersionsDropdown>
      )}
    </>
  )
}

export default function SortableAgreementTable({
  agreements = [],
  currentPage,
  onPageChange,
  onLimitChange,
  loading,
  totalAgreements,
  perPage,
  onOrderChange,
  orderBy,
  order
}) {
  const classes = useStyles()
  const user = useUser()
  const location = useLocation()

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'

    onOrderChange(property, isAsc ? 'desc' : 'asc')
  }

  const handleChangePage = (event, newPage) => {
    onPageChange(newPage)
  }

  const handleChangeRowsPerPage = event => {
    onLimitChange(parseInt(event.target.value, 10))
    onPageChange(0)
  }

  const emptyRows = Math.abs(agreements.length - perPage)

  return (
    <div className={classes.root}>
      <div className={classes.paper} variant="outlined">
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table">
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={agreements.length}
            />
            <TableBody>
              {agreements.length === 0 &&
                loading &&
                Array.from({ length: perPage }).map((_, i) => (
                  <TableRow
                    key={`agreement_skeleton_${i}`}
                    className={classes.skeletonRowContainer}>
                    <TableCell colSpan={6}>
                      <Skeleton
                        variant="text"
                        className={classes.skeletonRow}
                      />
                    </TableCell>
                    <TableCell>
                      <Skeleton
                        variant="text"
                        className={classes.skeletonButton}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              {agreements.length > 0 &&
                agreements.map((agreement, index) => {
                  return (
                    <PlanRow
                      key={index}
                      agreement={agreement}
                      location={location}
                      user={user}
                      currentPage={currentPage}
                    />
                  )
                })}
              {agreements.length > 0 && emptyRows > 0 && (
                <TableRow style={{ height: 66.4 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}

              {agreements.length === 0 && !loading && (
                <TableRow>
                  <TableCell align="center" colSpan={6}>
                    <Typography color="textSecondary">
                      No matching agreements
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalAgreements ?? -1}
          rowsPerPage={perPage}
          page={currentPage}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </div>
    </div>
  )
}
