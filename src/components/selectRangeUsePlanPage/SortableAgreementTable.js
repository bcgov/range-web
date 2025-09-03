import { Checkbox, ListItemText, TablePagination } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { REFERENCE_KEY } from '../../constants/variables';
import { useReferences } from '../../providers/ReferencesProvider';
import { useUser } from '../../providers/UserProvider';
import { getCurrentYear } from '../../utils';
import StyledTooltip from '../../helper/StyledTooltip';
import PlanRow from './PlanRow';
import { Loading } from '../common';
import { TOOLTIP_TEXT_PERCENTAGE_USE, TOOLTIP_TEXT_USAGE_STATUS } from '../../constants/strings';

const headCells = [
  {
    id: 'actions',
    disablePadding: true,
  },
  {
    id: 'extension_status',
    label: 'Extension Requests',
    disablePadding: false,
    sortable: true,
    multiSelectable: false,
  },
  {
    id: 'agreement.forest_file_id',
    numeric: false,
    disablePadding: false,
    label: 'RAN #',
    sortable: true,
    filterable: true,
    align: 'left',
  },
  {
    id: 'plan.range_name',
    numeric: false,
    disablePadding: false,
    label: 'Range Name',
    sortable: true,
    filterable: true,
    align: 'left',
  },
  {
    id: 'agreement_holder.name',
    numeric: false,
    disablePadding: false,
    label: 'Primary Agreement Holder',
    sortable: true,
    filterable: true,
    align: 'left',
  },
  {
    id: 'user_account.family_name',
    numeric: false,
    disablePadding: false,
    label: 'Staff Contact',
    sortable: true,
    filterable: true,
    align: 'left',
  },
  {
    id: 'plan.plan_end_date',
    numeric: false,
    disablePadding: false,
    label: 'Plan End Date',
    sortable: true,
    filterable: true,
    align: 'left',
  },
  {
    id: 'ref_district.code',
    numeric: false,
    disablePadding: false,
    label: 'District',
    sortable: true,
    filterable: true,
    align: 'left',
  },
  {
    id: 'plan.status_id',
    numeric: false,
    disablePadding: false,
    label: 'Status',
    sortable: true,
    multiSelectable: true,
    align: 'left',
  },
  {
    id: 'agreement.usage_status',
    disablePadding: false,
    label: `Usage Status (${getCurrentYear()})`,
    sortable: true,
    multiSelectable: true,
    align: 'center',
  },
  {
    id: 'agreement.percentage_use',
    numeric: true,
    disablePadding: false,
    label: `%Use (${getCurrentYear()})`,
    sortable: true,
    filterable: true,
    align: 'left',
  },
  {
    id: 'agreement.has_current_schedule',
    disablePadding: true,
    label: `Schedule (${getCurrentYear()})`,
    sortable: true,
    filterable: true,
    align: 'center',
  },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort, onColumnFilterChange, columnFilters } = props;

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            className={classes.headerCell}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={(event) => {
                headCell.sortable && onRequestSort(event, headCell.id);
              }}
              hideSortIcon={!headCell.sortable}
              disabled={!headCell.sortable}
            >
              {headCell.id === 'agreement.percentage_use' ? (
                <StyledTooltip title={TOOLTIP_TEXT_PERCENTAGE_USE}>
                  <span>{headCell.label}</span>
                </StyledTooltip>
              ) : headCell.id === 'agreement.usage_status' ? (
                <StyledTooltip title={TOOLTIP_TEXT_USAGE_STATUS}>
                  <span>{headCell.label}</span>
                </StyledTooltip>
              ) : (
                headCell.label
              )}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
            {headCell.filterable && (
              <input
                type="text"
                onChange={(e) => onColumnFilterChange(e, headCell.id)}
                value={Object.hasOwn(columnFilters, headCell.id) ? columnFilters[headCell.id] : ''}
                style={
                  headCell.id === 'agreement.percentage_use'
                    ? { width: '60px' }
                    : headCell.id === 'ref_district.code'
                      ? { width: '80px' }
                      : headCell.id === 'agreement.forest_file_id'
                        ? { width: '90px' }
                        : headCell.id === 'plan.plan_end_date'
                          ? { width: '100px' }
                          : headCell.id === 'agreement.has_current_schedule'
                            ? { width: '85px' }
                            : {}
                }
              />
            )}
            {headCell.id == 'plan.status_id' && (
              <StatusMultiSelect
                onStatusCodeChange={(newStatusCodes) =>
                  onColumnFilterChange({ target: { value: newStatusCodes } }, headCell.id)
                }
                selectedStatusCodes={columnFilters[headCell.id] || []}
              />
            )}
            {headCell.id == 'agreement.usage_status' && (
              <UsageStatusMultiSelect
                onUsageStatusChange={(newUsageStatuses) =>
                  onColumnFilterChange({ target: { value: newUsageStatuses } }, headCell.id)
                }
                selectedUsageStatuses={columnFilters[headCell.id] || []}
              />
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const StatusMultiSelect = ({ onStatusCodeChange, selectedStatusCodes }) => {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const references = useReferences();
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 400,
      },
    },
  };
  const statusObjects = references[REFERENCE_KEY.PLAN_STATUS].sort((a, b) => a.name.localeCompare(b.name));
  const [selectedStatusName, setSelectedStatusName] = React.useState([]);

  const handleChange = (event) => {
    setSelectedStatusName(event.target.value);
    const selectedStatusCodes = event.target.value.map((statusName) => {
      const match = statusObjects.find((st) => st.name === statusName);
      return match.code;
    });
    onStatusCodeChange(selectedStatusCodes);
  };

  useEffect(() => {
    setSelectedStatusName(
      selectedStatusCodes.map((code) => {
        const match = statusObjects.find((st) => st.code === code);
        return match.name;
      }),
    );
  }, [selectedStatusCodes]);

  return (
    <FormControl sx={{ width: 125 }}>
      <Select
        multiple
        value={selectedStatusName}
        onChange={handleChange}
        renderValue={(selected) => selected.join(', ')}
        MenuProps={MenuProps}
      >
        {statusObjects.map((statusObject) => (
          <MenuItem key={statusObject.id} value={statusObject.name}>
            <Checkbox checked={selectedStatusName.findIndex((statusName) => statusName === statusObject.name) !== -1} />
            <ListItemText primary={statusObject.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const UsageStatusMultiSelect = ({ onUsageStatusChange, selectedUsageStatuses }) => {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 400,
      },
    },
  };

  // Define usage status options based on numeric values
  const usageStatusOptions = [
    { id: 1, name: 'No Use', value: 0 },
    { id: 2, name: 'Over Use', value: 1 },
  ];

  const [selectedUsageStatusNames, setSelectedUsageStatusNames] = React.useState([]);

  const handleChange = (event) => {
    setSelectedUsageStatusNames(event.target.value);
    const selectedUsageStatusValues = event.target.value.map((statusName) => {
      const match = usageStatusOptions.find((st) => st.name === statusName);
      return match.value;
    });
    onUsageStatusChange(selectedUsageStatusValues);
  };

  useEffect(() => {
    setSelectedUsageStatusNames(
      selectedUsageStatuses
        .map((value) => {
          const match = usageStatusOptions.find((st) => st.value === value);
          return match ? match.name : '';
        })
        .filter(Boolean),
    );
  }, [selectedUsageStatuses]);

  return (
    <FormControl sx={{ width: 110 }}>
      <Select
        multiple
        value={selectedUsageStatusNames}
        onChange={handleChange}
        renderValue={(selected) => selected.join(', ')}
        MenuProps={MenuProps}
      >
        {usageStatusOptions.map((statusOption) => (
          <MenuItem key={statusOption.id} value={statusOption.name}>
            <Checkbox checked={selectedUsageStatusNames.indexOf(statusOption.name) !== -1} />
            <ListItemText primary={statusOption.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

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
  onColumnFilterChange,
  orderBy,
  order,
  columnFilters,
}) {
  const classes = useStyles();
  const user = useUser();
  const location = useLocation();

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';

    onOrderChange(property, isAsc ? 'desc' : 'asc');
  };

  const handleColumnFilterChange = (event, property) => {
    onColumnFilterChange(property, event.target.value);
  };

  return (
    <div className={classes.root}>
      <div className={classes.paper}>
        {loading && <Loading onlySpinner />}
        <TableContainer>
          <Table className={classes.table} aria-labelledby="tableTitle" size="medium" aria-label="enhanced table">
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              onColumnFilterChange={handleColumnFilterChange}
              columnFilters={columnFilters}
              rowCount={agreements.length}
            />
            <TableBody>
              {agreements.length > 0 &&
                !loading &&
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
              {agreements.length === 0 && !loading && (
                <TableRow>
                  <TableCell align="center" colSpan={12}>
                    <Typography color="textSecondary">No matching agreements</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {!loading && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalAgreements ?? -1}
            rowsPerPage={perPage}
            page={currentPage}
            onPageChange={(event, newPage) => onPageChange(event, newPage)}
            onRowsPerPageChange={(event) => {
              onLimitChange(parseInt(event.target.value, 10));
            }}
          />
        )}
      </div>
    </div>
  );
}
