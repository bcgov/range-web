import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Confirm } from 'semantic-ui-react';
import classnames from 'classnames';
import { FieldArray } from 'formik';
import uuid from 'uuid-v4';
import { InfoTip } from '../../common';
import { YEARLY_SCHEDULES, YEARLY_SCHEDULES_TIP } from '../../../constants/strings';
import { SCHEDULE } from '../../../constants/fields';
import * as utils from '../../../utils';
import GrazingScheduleBox from './grazingSchedules/GrazingScheduleBox';
import HayCuttingScheduleBox from './hayCuttingSchedules/HayCuttingScheduleBox';
import { useReferences } from '../../../providers/ReferencesProvider';
import { REFERENCE_KEY } from '../../../constants/variables';
import moment from 'moment';
import { deleteSchedule } from '../../../api';
import { populateGrazingScheduleFields, populateHayCuttingScheduleFields } from '../../../utils/helper/schedule';
import { IfEditable } from '../../common/PermissionsField';

const sortYears = (a, b) => a.year - b.year;

const Schedules = ({ plan }) => {
  const [yearOptions, setYearOptions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [indexToRemove, setIndexToRemove] = useState(null);

  const references = useReferences();
  const livestockTypes = references[REFERENCE_KEY.LIVESTOCK_TYPE];
  const schedules = plan.schedules || [];
  const isEmpty = schedules.length === 0;

  useEffect(() => {
    const { planStartDate, planEndDate, schedules } = plan || {};
    if (planStartDate && planEndDate) {
      const start = new Date(planStartDate).getFullYear();
      const end = new Date(planEndDate).getFullYear();

      const options = Array.from({ length: end - start + 1 }, (_, i) => ({
        key: start + i,
        text: start + i,
        value: start + i,
      })).filter(({ value }) => !schedules.some((s) => s.year === value));

      setYearOptions(options);
    }
  }, [plan.planStartDate, plan.planEndDate, plan.schedules]);

  const isGrazing = plan.agreement.agreementTypeId === 1 || plan.agreement.agreementTypeId === 2;
  const fieldName = 'schedules';
  const scheduleTitle = YEARLY_SCHEDULES;
  const scheduleTip = YEARLY_SCHEDULES_TIP;

  return (
    <FieldArray
      name={fieldName}
      validateOnChange={false}
      render={({ push, remove }) => (
        <>
          <div className="rup__grazing-schedules">
            <div className="rup__content-title--editable">
              <div className="rup__popup-header">
                <div className="rup__content-title">{scheduleTitle}</div>
                <InfoTip header={scheduleTitle} content={scheduleTip} />
              </div>
              <IfEditable permission={SCHEDULE.TYPE}>
                <Dropdown
                  className="icon rup__grazing-schedules__add-dropdown"
                  text={`Add Schedule`}
                  header="Years"
                  icon="add circle"
                  basic
                  labeled
                  button
                  item
                  options={yearOptions}
                  value={null}
                  disabled={yearOptions.length === 0}
                  onChange={(e, { value }) => {
                    console.log('Push called');
                    push({
                      id: uuid(),
                      year: value,
                      narative: '',
                      scheduleEntries: [],
                    });
                  }}
                  selectOnBlur={false}
                  pointing
                  compact
                />
              </IfEditable>
            </div>

            <div className="rup__divider" />

            {isEmpty ? (
              <div className="rup__section-not-found">No schedule provided.</div>
            ) : (
              <ul className={classnames('collaspible-boxes', { 'collaspible-boxes--empty': isEmpty })}>
                {schedules.sort(sortYears).map((schedule, index) => {
                  const yearUsage = plan.agreement.usage.find((u) => u.year === schedule.year);
                  const authorizedAUMs = yearUsage?.totalAnnualUse || 0;
                  const crownTotalAUMs = utils.calcCrownTotalAUMs(
                    schedule.scheduleEntries,
                    plan.pastures,
                    livestockTypes,
                  );

                  // For hay cutting schedules, calculate total tonnes
                  const authorizedTonnes = yearUsage?.authorizedAum || 0; // Using authorizedAum as the baseline for tonnes
                  const totalTonnes = utils.calcTotalTonnes(schedule.scheduleEntries);

                  const commonProps = {
                    key: schedule.id,
                    yearOptions,
                    index,
                    schedule: isGrazing
                      ? populateGrazingScheduleFields(schedule, plan, references)
                      : populateHayCuttingScheduleFields(schedule, plan),
                    activeIndex,
                    namespace: `${fieldName}.${index}`,
                    onScheduleClicked: () => setActiveIndex(index !== activeIndex ? index : -1),
                    onScheduleDelete: () => setIndexToRemove(index),
                  };

                  return isGrazing ? (
                    <GrazingScheduleBox
                      {...commonProps}
                      livestockTypes={livestockTypes}
                      authorizedAUMs={authorizedAUMs}
                      crownTotalAUMs={crownTotalAUMs}
                      onScheduleCopy={(year) => {
                        push({
                          ...schedule,
                          id: uuid(),
                          year,
                          scheduleEntries: schedule.scheduleEntries.map((entry) => ({
                            ...entry,
                            id: uuid(),
                            dateIn: moment(entry.dateIn).set('year', year).toISOString(),
                            dateOut: moment(entry.dateOut).set('year', year).toISOString(),
                          })),
                        });
                      }}
                    />
                  ) : (
                    <HayCuttingScheduleBox
                      {...commonProps}
                      authorizedTonnes={authorizedTonnes}
                      totalTonnes={parseFloat(totalTonnes)}
                      onScheduleCopy={(year) => {
                        push({
                          ...schedule,
                          id: uuid(),
                          year,
                          scheduleEntries: schedule.scheduleEntries.map((entry) => ({
                            ...entry,
                            id: uuid(),
                            dateIn: moment(entry.dateIn).set('year', year).toISOString(),
                            dateOut: moment(entry.dateOut).set('year', year).toISOString(),
                          })),
                        });
                      }}
                    />
                  );
                })}
              </ul>
            )}
          </div>

          <Confirm
            open={indexToRemove !== null}
            onCancel={() => setIndexToRemove(null)}
            content={`Are you sure you want to delete this ${isGrazing ? 'grazing' : 'hay cutting'} schedule?`}
            onConfirm={async () => {
              const schedule = schedules[indexToRemove];
              if (!uuid.isUUID(schedule.id)) await deleteSchedule(plan.id, schedule.id);
              remove(indexToRemove);
              setIndexToRemove(null);
            }}
          />
        </>
      )}
    />
  );
};

Schedules.propTypes = {
  plan: PropTypes.object.isRequired,
};

export default Schedules;
