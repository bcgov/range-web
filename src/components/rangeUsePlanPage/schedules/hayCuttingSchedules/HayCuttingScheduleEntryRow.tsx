import React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import PermissionsField, { IfEditable } from '../../../common/PermissionsField';
import { SCHEDULE } from '../../../../constants/fields';
import DateInputField from '../../../common/form/DateInputField';
import moment from 'moment';
import AreasDropdown from './AreasDropdown';
import RowMenu from './RowMenu';
import './HayCuttingScheduleEntryRow.css';

interface HayCuttingScheduleEntryRowProps {
  entry: any;
  namespace: string;
  onDelete: () => void;
  onCopy: () => void;
  schedule: any;
  onChange?: () => void;
  entryIndex?: number;
  scheduleIndex?: number;
}

const HayCuttingScheduleEntryRow = ({
  entry,
  namespace,
  onDelete,
  onCopy,
  schedule,
}: HayCuttingScheduleEntryRowProps) => {
  const { pastureId: areaId, dateIn, dateOut, stubbleHeight, tonnes } = entry || {};
  const initialDate = moment().set('year', schedule.year).set('month', 0).set('date', 1);
  const maxDate = moment().set('year', schedule.year).set('month', 11).set('date', 31);
  return (
    <TableRow className="rup__haycuttring-schedule__row">
      <TableCell>
        <AreasDropdown name={`${namespace}.pastureId`} areaId={areaId} />
      </TableCell>
      <TableCell>
        <PermissionsField
          permission={SCHEDULE.STUBBLE_HEIGHT}
          name={`${namespace}.stubbleHeight`}
          displayValue={stubbleHeight}
          inputProps={{
            type: 'number',
            'aria-label': 'stubble height',
          }}
          fast
        />
      </TableCell>
      <TableCell>
        <PermissionsField
          permission={SCHEDULE.DATE_IN}
          name={`${namespace}.dateIn`}
          component={DateInputField}
          displayValue={moment(dateIn).format('MMM D')}
          dateFormat="MMM D YYYY"
          icon={null}
          initialDate={initialDate}
          minDate={initialDate}
          maxDate={maxDate}
          aria-label="period start"
          onChange
        />
      </TableCell>
      <TableCell>
        <PermissionsField
          permission={SCHEDULE.DATE_OUT}
          name={`${namespace}.dateOut`}
          component={DateInputField}
          displayValue={moment(dateOut).format('MMM D')}
          dateFormat="MMM D YYYY"
          icon={null}
          initialDate={initialDate}
          minDate={initialDate}
          maxDate={maxDate}
          aria-label="period end"
          onChange
        />
      </TableCell>
      <TableCell>
        <PermissionsField
          permission={SCHEDULE.TONNES}
          name={`${namespace}.tonnes`}
          displayValue={tonnes}
          inputProps={{
            type: 'number',
            'aria-label': 'tonnes',
          }}
          fast
        />
      </TableCell>
      <IfEditable permission={SCHEDULE.TYPE}>
        <TableCell align="center">
          <RowMenu onCopy={onCopy} onDelete={onDelete} />
        </TableCell>
      </IfEditable>
    </TableRow>
  );
};

export default HayCuttingScheduleEntryRow;
