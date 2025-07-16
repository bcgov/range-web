import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import { connect } from 'formik';
import * as utils from '../../../../utils';
import { useReferences } from '../../../../providers/ReferencesProvider';
import { REFERENCE_KEY } from '../../../../constants/variables';
import PermissionsField, { IfEditable } from '../../../common/PermissionsField';
import { SCHEDULE } from '../../../../constants/fields';
import DateInputField from '../../../common/form/DateInputField';
import moment from 'moment';
import PasturesDropdown from './PasturesDropdown';
import Select from '../../../common/Select';
import RowMenu from './RowMenu';
import './GrazingScheduleEntryRow.css';

const GrazingScheduleEntryRow = ({ entry, formik, namespace, onDelete, onCopy, schedule, onChange }) => {
  const { pastureId, livestockCount, dateIn, dateOut, graceDays, days, pasture, pldAUMs, crownAUMs } = entry || {};

  const references = useReferences();
  const livestockTypes = references[REFERENCE_KEY.LIVESTOCK_TYPE];

  const livestockTypeOptions = livestockTypes.map((lt) => {
    const { id, name } = lt || {};
    return {
      key: id,
      value: id,
      label: name,
    };
  });

  const initialDate = moment().set('year', schedule.year).set('month', 0).set('date', 1);

  const maxDate = moment().set('year', schedule.year).set('month', 11).set('date', 31);

  return (
    <Table.Row className="rup__grazing-schedule__row">
      <Table.Cell>
        <PasturesDropdown
          name={`${namespace}.pastureId`}
          pastureId={pastureId}
          onChange={({ pasture }) => {
            formik.setFieldValue(`${namespace}.graceDays`, pasture.graceDays || 0);
            onChange();
          }}
        />
      </Table.Cell>
      <Table.Cell>
        <PermissionsField
          permission={SCHEDULE.TYPE}
          name={`${namespace}.livestockTypeId`}
          options={livestockTypeOptions}
          component={Select}
          displayValue={entry.livestockType && entry.livestockType.name}
          onChange={onChange}
          aria-label="livestock type"
          fast
        />
      </Table.Cell>
      <Table.Cell collapsing>
        <PermissionsField
          permission={SCHEDULE.TYPE}
          name={`${namespace}.livestockCount`}
          displayValue={livestockCount}
          inputProps={{
            'aria-label': 'livestock count',
            onChange,
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
          aria-label="date in"
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
          aria-label="date out"
          onChange
        />
      </Table.Cell>
      <Table.Cell collapsing>{utils.handleNullValue(days, false)}</Table.Cell>
      <Table.Cell collapsing>
        <PermissionsField
          permission={SCHEDULE.GRACE_DAYS}
          name={`${namespace}.graceDays`}
          displayValue={graceDays || (pasture && pasture.graceDays) || 0}
          inputProps={{
            type: 'number',
            'aria-label': 'grace days',
            onChange,
          }}
          fieldProps={{
            onBlur: (e) => {
              if (e.target.value.trim() === '') {
                formik.setFieldValue(`${namespace}.graceDays`, 0);
              }
            },
          }}
          fast
        />
      </Table.Cell>
      <Table.Cell collapsing>{utils.handleNullValue(pldAUMs, false)}</Table.Cell>
      <Table.Cell collapsing>{utils.handleNullValue(crownAUMs, false)}</Table.Cell>
      <IfEditable permission={SCHEDULE.TYPE}>
        <Table.Cell collapsing textAlign="center">
          <RowMenu onCopy={onCopy} onDelete={onDelete} />
        </Table.Cell>
      </IfEditable>
    </Table.Row>
  );
};

GrazingScheduleEntryRow.propTypes = {
  entry: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  namespace: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCopy: PropTypes.func.isRequired,
};

export default connect(GrazingScheduleEntryRow);
