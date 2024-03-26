import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import PropTypes from 'prop-types';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useUser } from '../../providers/UserProvider';
import PlanRow from './PlanRow';

const headCells = [
  {
    id: 'agreement.forest_file_id',
    numeric: false,
    disablePadding: false,
    label: 'RAN #',
    sortable: true,
    filterable: true
  },
  {
    id: 'plan.range_name',
    numeric: false,
    disablePadding: false,
    label: 'Range Name',
    sortable: true,
    filterable: true
  },
  {
    id: 'agreement_holder.name',
    numeric: false,
    disablePadding: false,
    label: 'Primary Agreement Holder',
    sortable: true,
    filterable: true
  },
  {
    id: 'plan_creator.given_name',
    numeric: false,
    disablePadding: false,
    label: 'Staff Contact',
    sortable: true,
    filterable: true
  },
  {
    id: 'plan.plan_end_date',
    numeric: false,
    disablePadding: false,
    label: 'Plan End Date',
    sortable: true,
    filterable: true
  },
  {
    id: 'ref_district.code',
    numeric: false,
    disablePadding: false,
    label: 'District',
    sortable: true,
    filterable: true
  },
  {
    id: 'plan.status_id',
    numeric: false,
    disablePadding: false,
    label: 'Status Code',
    sortable: true,
    filterable: true
  },
  {
    id: 'plan.status',
    numeric: false,
    disablePadding: false,
    label: 'Status',
    filterable: true
  },
  { id: 'actions', disablePadding: true },
  { id: 'extension', label: 'Extension Requests', disablePadding: false },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort, onRequestFilter } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const filterHandler = (event, property) => {
    onRequestFilter(event, property);
  }

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
            className={classes.headerCell}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={headCell.sortable && createSortHandler(headCell.id)}
              hideSortIcon={!headCell.sortable}
              disabled={!headCell.sortable}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
            {headCell.filterable && <input type="text" onChange={e => filterHandler(e, headCell.id)}/>}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

export const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(2),
    '& > *': {
      borderBottom: 'unset',
    },
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
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
    width: 1,
  },
  skeletonRow: {
    height: 20,
    width: '100%',
  },
  skeletonButton: {
    width: '130px',
    height: 33.4,
  },
  skeletonRowContainer: {
    padding: 0,
  },
  headerCell: {
    borderBottomColor: theme.palette.secondary.main,
    borderBottomWidth: 2,
  },
}));

export default function SortableAgreementTable({
  agreements = [],
  currentPage,
  onPageChange,
  onLimitChange,
  loading,
  totalAgreements,
  perPage,
  onOrderChange,
  onFilterChange,
  orderBy,
  order,
}) {
  const classes = useStyles();
  const user = useUser();
  const location = useLocation();

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';

    onOrderChange(property, isAsc ? 'desc' : 'asc');
  };

  const handleFilterChange = (event, property) => {
    onFilterChange(property, event.target.value);
  }

  const handleChangePage = (event, newPage) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    onLimitChange(parseInt(event.target.value, 10));
    onPageChange(0);
  };

  const getNumberOfRows = () => {
    let rowCount = 0;
    agreements.forEach((agreement) => {
      rowCount = rowCount + agreement.plans?.length;
    });
    return rowCount;
  };
  const emptyRows = Math.abs(getNumberOfRows() - perPage);

  return (
    <div className={classes.root}>
      <div className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              onRequestFilter={handleFilterChange}
              rowCount={agreements.length}
            />
            <TableBody>
              {agreements.length === 0 &&
                loading &&
                Array.from({ length: perPage }).map((_, i) => (
                  <TableRow
                    key={`agreement_skeleton_${i}`}
                    className={classes.skeletonRowContainer}
                  >
                    <TableCell colSpan={10}>
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
                  );
                })}
              {agreements.length > 0 && emptyRows > 0 && (
                <TableRow style={{ height: 66.4 * emptyRows }}>
                  <TableCell colSpan={10} />
                </TableRow>
              )}

              {agreements.length === 0 && !loading && (
                <TableRow>
                  <TableCell align="center" colSpan={10}>
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
  );
}
