import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import { connect } from 'formik';
import PermissionsField, { IfEditable } from '../../../common/PermissionsField';
import { SCHEDULE } from '../../../../constants/fields';
import DateInputField from '../../../common/form/DateInputField';
import moment from 'moment';
import AreasDropdown from './AreasDropdown';
import RowMenu from './RowMenu';
import './HayCuttingScheduleEntryRow.css';

const HayCuttingScheduleEntryRow = ({ entry, namespace, onDelete, onCopy, schedule }) => {
  const { areaId, dateIn, dateOut, stubbleHeight, tonnes } = entry || {};
  const initialDate = moment().set('year', schedule.year).set('month', 0).set('date', 1);
  const maxDate = moment().set('year', schedule.year).set('month', 11).set('date', 31);

  return (
    <Table.Row className="rup__haycuttring-schedule__row">
      <Table.Cell>
        <AreasDropdown name={`${namespace}.pastureId`} areaId={areaId} />
      </Table.Cell>
      <Table.Cell>
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
      </Table.Cell>
      <Table.Cell collapsing>
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
      </Table.Cell>
      <Table.Cell collapsing>
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
      </Table.Cell>
      <Table.Cell collapsing>
        <PermissionsField
          permission={SCHEDULE.TONNES}
          name={`${namespace}.tonnes`}
          displayValue={tonnes}
          inputProps={{
            type: 'number',
            'aria-label': 'tonnes',
            // onChange,
          }}
          fast
        />
      </Table.Cell>
      <IfEditable permission={SCHEDULE.TYPE}>
        <Table.Cell collapsing textAlign="center">
          <RowMenu onCopy={onCopy} onDelete={onDelete} />
        </Table.Cell>
      </IfEditable>
    </Table.Row>
  );
};

HayCuttingScheduleEntryRow.propTypes = {
  entry: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  namespace: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCopy: PropTypes.func.isRequired,
};

export default connect(HayCuttingScheduleEntryRow);
