import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Confirm } from 'semantic-ui-react';
import classnames from 'classnames';
import { FieldArray } from 'formik';
import uuid from 'uuid-v4';
import { InfoTip } from '../../common';
import { IfEditable } from '../../common/PermissionsField';
import { YEARLY_SCHEDULES, YEARLY_SCHEDULES_TIP } from '../../../constants/strings';
import { SCHEDULE } from '../../../constants/fields';
import * as utils from '../../../utils';
import HayCuttingScheduleBox from './HayCuttingScheduleBox';
import moment from 'moment';
import { deleteSchedule } from '../../../api';

const sortYears = (a, b) => {
  if (a.year > b.year) return 1;
  if (a.year < b.year) return -1;
  return 0;
};

const HayCuttingSchedules = ({ plan }) => {
  const [yearOptions, setYearOptions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [indexToRemove, setIndexToRemove] = useState(null);
  const { schedules } = plan;
  const isEmpty = schedules.length === 0;

  useEffect(() => {
    const { planStartDate, planEndDate } = plan || {};
    if (planStartDate && planEndDate) {
      // set up year options
      const planStartYear = new Date(planStartDate).getFullYear();
      const planEndYear = new Date(planEndDate).getFullYear();
      const length = planEndYear - planStartYear + 1;
      const options = utils
        .createEmptyArray(length >= 0 ? length : 0)
        .map((v, i) => ({
          key: planStartYear + i,
          text: planStartYear + i,
          value: planStartYear + i,
        }))
        .filter((option) => {
          // give year options that hasn't been added yet in schedules
          const schedules = plan.schedules;
          const years = schedules.map((s) => s.year);
          return !(years.indexOf(option.value) >= 0);
        });

      setYearOptions(options);
    }
  }, [schedules.length, plan.planStartDate, plan.planEndDate]);

  return (
    <FieldArray
      name="schedules"
      validateOnChange={false}
      render={({ push, remove }) => (
        <>
          <div className="rup__grazing-schedules">
            <div className="rup__content-title--editable">
              <div className="rup__popup-header">
                <div className="rup__content-title">{YEARLY_SCHEDULES}</div>
                <InfoTip header={YEARLY_SCHEDULES} content={YEARLY_SCHEDULES_TIP} />
              </div>
              <IfEditable permission={SCHEDULE.TYPE}>
                <Dropdown
                  className="icon rup__grazing-schedules__add-dropdown"
                  text="Add Schedule"
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
                    push({
                      scheduleEntries: [],
                      narative: '',
                      year: value,
                      id: uuid(),
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
              <ul
                className={classnames('collaspible-boxes', {
                  'collaspible-boxes--empty': isEmpty,
                })}
              >
                {schedules.sort(sortYears).map((schedule, index) => {
                  const yearUsage = plan.agreement.usage.find((u) => u.year === schedule.year);
                  const authorizedAUMs = (yearUsage && yearUsage.totalAnnualUse) || 0;
                  // const crownTotalAUMs = utils.calcCrownTotalAUMs(
                  //   schedule.scheduleEntries,
                  //   plan.pastures,
                  //   livestockTypes,
                  // );

                  return (
                    <HayCuttingScheduleBox
                      key={schedule.id}
                      yearOptions={yearOptions}
                      index={index}
                      onScheduleClicked={() => setActiveIndex(index !== activeIndex ? index : -1)}
                      activeIndex={activeIndex}
                      namespace={`hayCuttingSchedules.${index}`}
                      authorizedAUMs={authorizedAUMs}
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
                      onScheduleDelete={() => setIndexToRemove(index)}
                    />
                  );
                })}
              </ul>
            )}
          </div>
          <Confirm
            open={indexToRemove !== null}
            onCancel={() => {
              setIndexToRemove(null);
            }}
            content="Are you sure you want delete the entire year from the schedule?  You will lose all the rows for this year."
            onConfirm={async () => {
              const schedule = schedules[indexToRemove];

              if (!uuid.isUUID(schedule.id)) {
                await deleteSchedule(plan.id, schedule.id);
              }
              remove(indexToRemove);
              setIndexToRemove(null);
            }}
          />
        </>
      )}
    />
  );
};

HayCuttingSchedules.propTypes = {
  plan: PropTypes.object.isRequired,
};

export default HayCuttingSchedules;
