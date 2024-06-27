import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useLocation } from 'react-router-dom';
import { useUser } from '../../providers/UserProvider';
import PlanRow from './PlanRow';
import EnhancedTableHead from './EnhancedTableHead';

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
  checkboxBorder: {
    border: '1px solid black',
    padding: '4px',
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
  filters,
  onStatusCodeChange,
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
  };

  const handleStatusFilterChange = (codes) => {
    onStatusCodeChange('plan.status_id', codes);
  };

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
              filters={filters}
              rowCount={agreements.length}
              onStatusCodeChange={handleStatusFilterChange}
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
