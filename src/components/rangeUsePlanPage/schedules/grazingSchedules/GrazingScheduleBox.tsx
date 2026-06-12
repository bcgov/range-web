import React, { useState } from 'react';
import classnames from 'classnames';
import MenuIcon from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import GrazingScheduleEntryRow from './GrazingScheduleEntryRow';
import { round, isUserAgrologist } from '../../../../utils';
import * as strings from '../../../../constants/strings';
import { CollapsibleBox, PrimaryButton, ErrorMessage, InfoTip, MuiIcon } from '../../../common';
import { IMAGE_SRC } from '../../../../constants/variables';
import { FieldArray, useFormikContext, getIn } from 'formik';
import uuid from 'uuid-v4';
import TextFieldMui from '@mui/material/TextField';
import PermissionsField, { IfEditable } from '../../../common/PermissionsField';
import { SCHEDULE } from '../../../../constants/fields';
import { deleteScheduleEntry, updateSortOrder } from '../../../../api';
import MultiParagraphDisplay from '../../../common/MultiParagraphDisplay';
import { useUser } from '../../../../providers/UserProvider';
import SortableTableHeaderCell from '../../../common/SortableTableHeaderCell';
import { resetScheduleEntryId } from '../../../../utils/helper/schedule';
import _ from 'lodash';
import useConfirm from '../../../../providers/ConfrimationModalProvider';

const formatPercentUse = (percentUse: number) => {
  if (percentUse === undefined || percentUse === null || isNaN(percentUse)) {
    return 0;
  }
  const value = parseFloat(String(percentUse));
  if (value > 0 && value < 1) {
    return 1;
  }
  return Math.ceil(value);
};

interface GrazingScheduleBoxProps {
  schedule: any;
  activeIndex: number;
  index: number;
  namespace: string;
  crownTotalAUMs: number;
  yearOptions: any[];
  onScheduleClicked: () => void;
  authorizedAUMs: number;
  onScheduleCopy: (year: number, scheduleId?: any) => void;
  onScheduleDelete: () => void;
  livestockTypes?: any[];
}

function TextAreaField(props: any) {
  const { name, inputProps, label, displayValue } = props;
  const [field, meta] = require('formik').useField(name);
  const showReadOnly = !!displayValue && !meta.value;
  if (showReadOnly) {
    return <TextFieldMui label={label} value={displayValue} fullWidth disabled multiline minRows={3} />;
  }
  return (
    <TextFieldMui
      {...field}
      {...inputProps}
      label={label}
      error={meta.touched && !!meta.error}
      helperText={meta.touched ? meta.error : undefined}
      fullWidth
      multiline
      minRows={3}
    />
  );
}

const GrazingScheduleBox = ({
  schedule,
  activeIndex,
  index,
  namespace,
  crownTotalAUMs,
  yearOptions,
  onScheduleClicked,
  authorizedAUMs,
  onScheduleCopy,
  onScheduleDelete,
}: GrazingScheduleBoxProps) => {
  const { id, year, sortBy, sortOrder } = schedule;
  const user = useUser();
  const formik = useFormikContext<any>();
  const narative = (schedule && schedule.narative) || '';
  const roundedCrownTotalAUMs = round(crownTotalAUMs, 1);
  const isCrownTotalAUMsError = crownTotalAUMs > authorizedAUMs;

  const confirm = useConfirm()!;
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const isError = !!getIn(formik.errors, namespace);

  const getScheduleError = () => {
    if (schedule.scheduleEntries.length === 0) {
      if (isUserAgrologist(user))
        return {
          message: 'This schedule has no associated rows.',
          type: 'warning',
        };
      return { message: strings.EMPTY_SCHEDULE_ENTRIES, type: 'error' };
    }
    if (isCrownTotalAUMsError) {
      return {
        message: strings.TOTAL_AUMS_EXCEEDS + ' Over by: ' + (crownTotalAUMs - authorizedAUMs).toFixed(1).toString(),
        type: 'error',
      };
    }
    const aggregatedCrownAUMs = schedule.scheduleEntries.reduce((acc: any, entry: any) => {
      if (entry.pasture && entry.pasture.id !== undefined) {
        const pastureId = entry.pasture.id;
        acc[pastureId] = round((acc[pastureId] || 0) + entry.crownAUMs, 1);
      }
      return acc;
    }, {});
    const warningEntries = schedule.scheduleEntries.reduce((acc: any[], entry: any) => {
      if (entry.pasture && entry.pasture.id !== undefined) {
        const pastureId = entry.pasture.id;
        const pastureName = entry.pasture.name;
        const allowableAum = entry.pasture.allowableAum;
        if (allowableAum && aggregatedCrownAUMs[pastureId] > allowableAum) {
          acc.push({
            id: entry.id,
            message: `Total Crown AUMs: ${aggregatedCrownAUMs[pastureId]} of schedule entries of pasture "${pastureName}" have exceeded recommended AUMs value: ${allowableAum}.`,
            type: 'warning',
          });
        }
      }
      return acc;
    }, []);
    const uniqueWarnings = Array.from(new Set(warningEntries.map((w: any) => w.id))).map((wId) =>
      warningEntries.find((w: any) => w.id === wId),
    );
    return uniqueWarnings[0];
  };

  const scheduleError = getScheduleError();

  const setSortBy = (column: string | null) => formik.setFieldValue(`${namespace}.sortBy`, column);
  const setSortOrder = (order: string | null) => formik.setFieldValue(`${namespace}.sortOrder`, order);

  const handleHeaderClick = (column: string) => {
    if (column !== sortBy) {
      setSortBy(column);
      setSortOrder('asc');
      updateSortOrder(schedule.planId, schedule.id, column, 'asc');

      formik.setFieldValue(
        `${namespace}.scheduleEntries`,
        _.orderBy(schedule.scheduleEntries, [column, 'id'], ['asc', 'asc']),
      );
    } else {
      if (sortOrder === 'asc') {
        setSortOrder('desc');

        updateSortOrder(schedule.planId, schedule.id, column, 'desc');
        formik.setFieldValue(
          `${namespace}.scheduleEntries`,
          _.orderBy(schedule.scheduleEntries, [column, 'id'], ['desc', 'asc']),
        );
      } else {
        setSortOrder(null);
        setSortBy(null);
        updateSortOrder(schedule.planId, schedule.id, null as any, null as any);
        formik.setFieldValue(`${namespace}.scheduleEntries`, _.orderBy(schedule.scheduleEntries, ['id'], ['asc']));
      }
    }
  };

  const headerCellProps = {
    currentSortBy: sortBy,
    currentSortOrder: (sortOrder === 'asc' ? 'ascending' : sortOrder === 'desc' ? 'descending' : undefined) as
      | 'ascending'
      | 'descending'
      | undefined,
    onClick: handleHeaderClick,
  };

  return (
    <FieldArray
      name={`${namespace}.scheduleEntries`}
      validateOnChange={false}
      render={({ push, remove }) => (
        <>
          <CollapsibleBox
            key={id}
            contentIndex={index}
            activeContentIndex={activeIndex}
            onContentClick={onScheduleClicked}
            error={isError}
            header={
              <div className="rup__grazing-schedule__title">
                <div style={{ width: '30px' }}>
                  {isError ? (
                    <MuiIcon name="warning sign" />
                  ) : (
                    <img src={IMAGE_SRC.SCHEDULES_ICON} alt="schedule icon" />
                  )}
                </div>
                {year} Schedule
              </div>
            }
            shouldHideHeaderRightWhenNotActive
            headerRight={
              <IfEditable permission={[SCHEDULE.COPY, SCHEDULE.DELETE]} any>
                <>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuAnchorEl(e.currentTarget);
                    }}
                  >
                    <MuiIcon name="ellipsis vertical" />
                  </IconButton>
                  <MenuIcon anchorEl={menuAnchorEl} open={!!menuAnchorEl} onClose={() => setMenuAnchorEl(null)}>
                    <IfEditable permission={SCHEDULE.COPY}>
                      {yearOptions.map((opt: any) => (
                        <MenuItem
                          key={opt.key}
                          onClick={() => {
                            setMenuAnchorEl(null);
                            onScheduleCopy(opt.value, schedule.id);
                          }}
                          data-testid={`copy-button-${schedule.year}`}
                        >
                          Copy To {opt.text}
                        </MenuItem>
                      ))}
                    </IfEditable>
                    <IfEditable permission={SCHEDULE.DELETE}>
                      <MenuItem
                        onClick={() => {
                          setMenuAnchorEl(null);
                          onScheduleDelete();
                        }}
                        data-testid={`delete-button-${schedule.year}`}
                      >
                        Delete
                      </MenuItem>
                    </IfEditable>
                  </MenuIcon>
                </>
              </IfEditable>
            }
            collapsibleContent={
              <>
                {(isError || scheduleError) && (
                  <ErrorMessage
                    message={(scheduleError && scheduleError.message) || strings.INVALID_SCHEDULE_ENTRY}
                    warning={scheduleError && scheduleError.type === 'warning'}
                    visible
                    attached
                  />
                )}
                <div style={{ overflowX: 'scroll' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <SortableTableHeaderCell column="pasture.name" {...headerCellProps}>
                          <div className="rup__grazing-schedule__pasture">{strings.PASTURE}</div>
                        </SortableTableHeaderCell>
                        <SortableTableHeaderCell column="livestockType.name" {...headerCellProps}>
                          <div className="rup__grazing-schedule__l-type">{strings.LIVESTOCK_TYPE}</div>
                        </SortableTableHeaderCell>
                        <SortableTableHeaderCell column="livestockCount" {...headerCellProps}>
                          {strings.NUM_OF_ANIMALS}
                        </SortableTableHeaderCell>
                        <SortableTableHeaderCell column="dateIn" {...headerCellProps}>
                          <div className="rup__grazing-schedule__dates">{strings.DATE_IN}</div>
                        </SortableTableHeaderCell>
                        <SortableTableHeaderCell column="dateOut" {...headerCellProps}>
                          <div className="rup__grazing-schedule__dates">{strings.DATE_OUT}</div>
                        </SortableTableHeaderCell>
                        <SortableTableHeaderCell {...headerCellProps} column="days">
                          {strings.DAYS}
                        </SortableTableHeaderCell>
                        <SortableTableHeaderCell column="graceDays" {...headerCellProps}>
                          <div className="rup__grazing-schedule__grace-days">{strings.GRACE_DAYS}</div>
                        </SortableTableHeaderCell>
                        <SortableTableHeaderCell {...headerCellProps} column="pldAUMs">
                          {strings.PLD}
                        </SortableTableHeaderCell>
                        <SortableTableHeaderCell {...headerCellProps} column="crownAUMs">
                          {strings.CROWN_AUMS}
                        </SortableTableHeaderCell>
                        <SortableTableHeaderCell
                          column=""
                          currentSortBy=""
                          currentSortOrder={undefined}
                          onClick={() => undefined}
                          noSort
                        />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {schedule.scheduleEntries.map((entry: any, entryIndex: number) => (
                        <GrazingScheduleEntryRow
                          key={entry.id || entry.key}
                          schedule={schedule}
                          entry={entry}
                          entryIndex={entryIndex}
                          scheduleIndex={index}
                          namespace={`${namespace}.scheduleEntries.${entryIndex}`}
                          onDelete={async () => {
                            const choice = await confirm({
                              titleText: 'Delete Schedule Entry',
                              contentText: 'Are you sure you want to delete this schedule entry?',
                            });
                            if (!choice) return;
                            if (!uuid.isUUID(entry.id)) {
                              await deleteScheduleEntry(schedule.planId, schedule.id, entry.id);
                            }
                            remove(entryIndex);
                          }}
                          onCopy={() => {
                            setSortOrder(null);
                            setSortBy(null);
                            push(resetScheduleEntryId(entry));
                          }}
                          onChange={() => {
                            setSortBy(null);
                          }}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <IfEditable permission={SCHEDULE.TYPE}>
                  <PrimaryButton
                    style={{ margin: '10px 0' }}
                    inverted
                    compact
                    onClick={() => {
                      setSortOrder(null);
                      setSortBy(null);
                      push({
                        dateIn: '',
                        dateOut: '',
                        graceDays: '',
                        livestockCount: '',
                        livestockTypeId: '',
                        id: uuid(),
                      });

                      const lastIndex = schedule.scheduleEntries.length;
                      formik.setFieldTouched(`${namespace}.scheduleEntries.${lastIndex}.livestockCount`, true);
                      formik.setFieldTouched(`${namespace}.scheduleEntries.${lastIndex}.livestockTypeId`, true);
                      formik.setFieldTouched(`${namespace}.scheduleEntries.${lastIndex}.pastureId`, true);
                    }}
                  >
                    <MuiIcon name="add circle" />
                    Add Row
                  </PrimaryButton>
                </IfEditable>
                <div className="rup__grazing-schedule__AUMs">
                  <div className="rup__grazing-schedule__AUM-label">Annual Authorized AUM/Tonne</div>
                  <div className="rup__grazing-schedule__AUM-number">{authorizedAUMs}</div>
                  <div className="rup__grazing-schedule__AUM-label">Total AUM/Tonne</div>
                  <div
                    className={classnames('rup__grazing-schedule__AUM-number', {
                      'rup__grazing-schedule__AUM-number--invalid': isCrownTotalAUMsError,
                    })}
                  >
                    {roundedCrownTotalAUMs}
                  </div>
                  <div className="rup__grazing-schedule__AUM-label">% Used</div>
                  <div className="rup__grazing-schedule__AUM-number">
                    {formatPercentUse((roundedCrownTotalAUMs / authorizedAUMs) * 100)}
                  </div>
                </div>
                <div className="rup__grazing-schedule__narrative__title rup__popup-header">
                  Schedule/Amendment Description
                  <InfoTip
                    header="Schedule/Amendment Description"
                    content={strings.SCHEDULE_AMENDMENT_DESCRIPTION_TIP}
                  />
                </div>
                <div>
                  Schedule description may contain legacy Livestock Distribution Detail which will eventually be moved
                  to the appropriate section
                </div>
                <div>
                  <PermissionsField
                    permission={SCHEDULE.DESCRIPTION}
                    name={`${namespace}.narative`}
                    component={TextAreaField}
                    inputProps={{
                      placeholder: `Description of movement of livestock through agreement area. May include WHEN, WHERE and HOW management tools are used to create that flow. May be of particular value when an agreement consists of a single pasture or multiple unfenced pastures.`,
                      rows: 3,
                      style: { marginTop: '5px' },
                    }}
                    displayValue={narative}
                    displayComponent={MultiParagraphDisplay}
                    fast
                  />
                </div>
              </>
            }
          />
        </>
      )}
    />
  );
};

export default GrazingScheduleBox;
