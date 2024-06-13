import React, { useEffect } from 'react';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Checkbox, ListItemText } from '@material-ui/core';

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const headCells = [
  {
    id: 'agreement.forest_file_id',
    numeric: false,
    disablePadding: false,
    label: 'RAN #',
    sortable: true,
    filterable: true,
  },
  {
    id: 'plan.range_name',
    numeric: false,
    disablePadding: false,
    label: 'Range Name',
    sortable: true,
    filterable: true,
  },
  {
    id: 'agreement_holder.name',
    numeric: false,
    disablePadding: false,
    label: 'Primary Agreement Holder',
    sortable: true,
    filterable: true,
  },
  {
    id: 'user_account.family_name',
    numeric: false,
    disablePadding: false,
    label: 'Staff Contact',
    sortable: true,
    filterable: true,
  },
  {
    id: 'plan.plan_end_date',
    numeric: false,
    disablePadding: false,
    label: 'Plan End Date',
    sortable: true,
    filterable: true,
  },
  {
    id: 'ref_district.code',
    numeric: false,
    disablePadding: false,
    label: 'District',
    sortable: true,
    filterable: true,
  },
  {
    id: 'plan.status_id',
    numeric: false,
    disablePadding: false,
    label: 'Status Code',
    sortable: true,
    multiSelectable: true,
  },
  {
    id: 'plan.status',
    numeric: false,
    disablePadding: false,
    label: 'Status',
  },
  { id: 'actions', disablePadding: true },
  { id: 'extension', label: 'Extension Requests', disablePadding: false },
];

function StatusCodesMultiSelect(props) {
  const { onStatusCodeChange, filters, headCellID } = props;
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  const status_codes = [
    'C',
    'O',
    'P',
    'D',
    'R',
    'SD',
    'WM',
    'SW',
    'S',
    'NF',
    'NA',
    'A',
    'SR',
    'SFD',
    'RR',
    'RNR',
    'RFD',
    'AC',
    'RFS',
    'MSR',
    'SNR',
    'APS',
    'APA',
    'SAM',
  ];
  const [selectedCodes, setSelectedCodes] = React.useState([]);
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedCodes(typeof value === 'string' ? value.split(',') : value);
  };
  useEffect(() => {
    onStatusCodeChange(selectedCodes);
  }, [selectedCodes]);

  return (
    <FormControl sx={{ width: 125 }}>
      <Select
        multiple
        value={filters[headCellID] ? filters[headCellID].split(',') : []}
        onChange={handleChange}
        renderValue={(selected) => selected.join(', ')}
        MenuProps={MenuProps}
      >
        {status_codes.map((code) => (
          <MenuItem key={code} value={code}>
            <Checkbox checked={selectedCodes.indexOf(code) > -1} />
            <ListItemText primary={code} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default function EnhancedTableHead(props) {
  const {
    classes,
    order,
    orderBy,
    onRequestSort,
    onRequestFilter,
    filters,
    onStatusCodeChange,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  const filterHandler = (event, property) => {
    onRequestFilter(event, property);
  };

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
            {headCell.filterable && (
              <input
                type="text"
                onChange={(e) => filterHandler(e, headCell.id)}
                value={
                  Object.hasOwn(filters, headCell.id)
                    ? props.filters[headCell.id]
                    : ''
                }
              />
            )}
            {headCell.multiSelectable && (
              <StatusCodesMultiSelect
                onStatusCodeChange={onStatusCodeChange}
                filters={filters}
                headCellID={headCell.id}
              />
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}