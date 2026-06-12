import React from 'react';
import { useField } from 'formik';
import TextField from '@mui/material/TextField';

import IndicatorPlantsForm from '../IndicatorPlantsForm';
import { PLANT_CRITERIA } from '../../../../constants/variables';
import { RANGE_READINESS } from '../../../../constants/fields';
import { RANGE_READINESS_OTHER_TIP } from '../../../../constants/strings';
import PermissionsField from '../../../common/PermissionsField';
import DayMonthPicker from '../../../common/form/DayMonthPicker';
import moment from 'moment';

function TextAreaField(props: any) {
  const { name, label, displayValue } = props;
  const [field, meta] = useField(name);
  const showReadOnly = !!displayValue && !meta.value;
  if (showReadOnly) {
    return <TextField label={label} value={displayValue} fullWidth disabled multiline minRows={3} />;
  }
  return (
    <TextField
      {...field}
      label={label}
      error={meta.touched && !!meta.error}
      helperText={meta.touched ? meta.error : undefined}
      fullWidth
      multiline
      minRows={3}
    />
  );
}

interface RangeReadinessBoxProps {
  plantCommunity: any;
  planId: any;
  pastureId: any;
  namespace: string;
}

function RangeReadinessBox({ plantCommunity, planId, pastureId, namespace }: RangeReadinessBoxProps) {
  const { rangeReadinessMonth, rangeReadinessDay, rangeReadinessNote } = plantCommunity;

  return (
    <div className="rup__plant-community__sh">
      <div className="rup__plant-community__rr__title">Range Readiness Criteria</div>
      <div>
        If more than one readiness criteria is provided, all such criteria must be met before grazing may occur.
      </div>
      <PermissionsField
        monthName={`${namespace}.rangeReadinessMonth`}
        dayName={`${namespace}.rangeReadinessDay`}
        permission={RANGE_READINESS.DATE}
        component={DayMonthPicker}
        displayValue={moment(`${rangeReadinessMonth} ${rangeReadinessDay}`, 'MM DD').format('MMMM DD')}
        label="Readiness Date"
        dateFormat="MMMM DD"
      />
      <PermissionsField
        name={`${namespace}.rangeReadinessNote`}
        permission={RANGE_READINESS.NOTE}
        tip={RANGE_READINESS_OTHER_TIP}
        component={TextAreaField}
        displayValue={rangeReadinessNote}
        label="Other"
        fast
      />
      <IndicatorPlantsForm
        indicatorPlants={plantCommunity.indicatorPlants}
        namespace={namespace}
        valueLabel="Criteria (Leaf Stage)"
        valueType="leafStage"
        criteria={PLANT_CRITERIA.RANGE_READINESS}
        planId={planId}
        pastureId={pastureId}
        communityId={plantCommunity.id}
        fast
      />
    </div>
  );
}

export default RangeReadinessBox;
