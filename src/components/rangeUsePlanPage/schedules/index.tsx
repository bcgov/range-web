import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { FieldArray } from 'formik';
import uuid from 'uuid-v4';
import { InfoTip, MuiIcon } from '../../common';
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
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import useConfirm from '../../../providers/ConfrimationModalProvider';

const sortYears = (a: any, b: any) => a.year - b.year;

interface SchedulesProps {
  plan: any;
}

const Schedules = ({ plan }: SchedulesProps) => {
  const [yearOptions, setYearOptions] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const confirm = useConfirm()!;

  const references = useReferences();
  const livestockTypes = references[REFERENCE_KEY.LIVESTOCK_TYPE] as any[];
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
      })).filter(({ value }) => !schedules.some((s: any) => s.year === value));

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
                <>
                  <IconButton onClick={(e) => setMenuAnchorEl(e.currentTarget)} disabled={yearOptions.length === 0}>
                    <MuiIcon name="add circle" />
                  </IconButton>
                  <Menu anchorEl={menuAnchorEl} open={!!menuAnchorEl} onClose={() => setMenuAnchorEl(null)}>
                    {yearOptions.map((opt) => (
                      <MenuItem
                        key={opt.key}
                        onClick={() => {
                          setMenuAnchorEl(null);
                          push({
                            id: uuid(),
                            year: opt.value,
                            narative: '',
                            scheduleEntries: [],
                          });
                        }}
                      >
                        {opt.text}
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              </IfEditable>
            </div>

            <div className="rup__divider" />

            {isEmpty ? (
              <div className="rup__section-not-found">No schedule provided.</div>
            ) : (
              <ul className={classnames('collaspible-boxes', { 'collaspible-boxes--empty': isEmpty })}>
                {schedules.sort(sortYears).map((schedule: any, index: number) => {
                  const yearUsage = plan.agreement.usage.find((u: any) => u.year === schedule.year);
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
                    onScheduleDelete: async () => {
                      const choice = await confirm({
                        titleText: 'Delete Schedule',
                        contentText: `Are you sure you want to delete this ${isGrazing ? 'grazing' : 'hay cutting'} schedule?`,
                      });
                      if (!choice) return;
                      const sched = schedules[index];
                      if (!uuid.isUUID(sched.id)) await deleteSchedule(plan.id, sched.id);
                      remove(index);
                    },
                  };

                  return isGrazing ? (
                    <GrazingScheduleBox
                      {...commonProps}
                      livestockTypes={livestockTypes}
                      authorizedAUMs={authorizedAUMs}
                      crownTotalAUMs={crownTotalAUMs}
                      onScheduleCopy={(year: number) => {
                        push({
                          ...schedule,
                          id: uuid(),
                          year,
                          scheduleEntries: schedule.scheduleEntries.map((entry: any) => ({
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
                      onScheduleCopy={(year: number) => {
                        push({
                          ...schedule,
                          id: uuid(),
                          year,
                          scheduleEntries: schedule.scheduleEntries.map((entry: any) => ({
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
        </>
      )}
    />
  );
};

export default Schedules;
