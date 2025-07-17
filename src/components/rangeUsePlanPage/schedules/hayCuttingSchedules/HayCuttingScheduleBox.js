import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Dropdown, Icon, Table, Confirm } from 'semantic-ui-react';
import HayCuttingScheduleEntryRow from './HayCuttingScheduleEntryRow';
import { roundTo1Decimal, isUserAgrologist } from '../../../../utils';
import * as strings from '../../../../constants/strings';
import { CollapsibleBox, PrimaryButton, ErrorMessage } from '../../../common';
import { IMAGE_SRC } from '../../../../constants/variables';
import { FieldArray, connect, getIn } from 'formik';
import uuid from 'uuid-v4';
import { TextArea } from 'formik-semantic-ui';
import PermissionsField, { IfEditable } from '../../../common/PermissionsField';
import { SCHEDULE } from '../../../../constants/fields';
import { deleteScheduleEntry, updateSortOrder } from '../../../../api';
import MultiParagraphDisplay from '../../../common/MultiParagraphDisplay';
import { useUser } from '../../../../providers/UserProvider';
import SortableTableHeaderCell from '../../../common/SortableTableHeaderCell';
import { resetScheduleEntryId } from '../../../../utils/helper/schedule';
const _ = require('lodash');

const HayCuttingScheduleBox = ({
  schedule,
  activeIndex,
  index,
  namespace,
  yearOptions,
  onScheduleClicked,
  onScheduleCopy,
  onScheduleDelete,
  authorizedTonnes,
  totalTonnes,
  formik,
}) => {
  const { id, year, sortBy, sortOrder } = schedule;
  const user = useUser();
  const narative = (schedule && schedule.narative) || '';
  const roundedTotalTonnes = roundTo1Decimal(totalTonnes);
  const copyOptions =
    yearOptions.map((o) => ({
      ...o,
      onClick: () => onScheduleCopy(o.value, schedule.id),
    })) || [];
  const isTotalTonnesError = totalTonnes > authorizedTonnes;

  const [toRemove, setToRemove] = useState(null);

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
    if (isTotalTonnesError) {
      return {
        message:
          'Total tonnes exceeds authorized amount. Over by: ' + (totalTonnes - authorizedTonnes).toFixed(1).toString(),
        type: 'error',
      };
    }
    const aggregatedTonnes = schedule.scheduleEntries.reduce((acc, entry) => {
      if (entry.pasture && entry.pasture.id !== undefined) {
        const pastureId = entry.pasture.id;
        const entryTonnes = parseFloat(entry.tonnes) || 0;
        acc[pastureId] = roundTo1Decimal((acc[pastureId] || 0) + entryTonnes);
      }
      return acc;
    }, {});
    const warningEntries = schedule.scheduleEntries.reduce((acc, entry) => {
      if (entry.pasture && entry.pasture.id !== undefined) {
        const pastureId = entry.pasture.id;
        const pastureName = entry.pasture.name;
        const allowableTonnes = entry.pasture.allowableTonnes;
        if (allowableTonnes && aggregatedTonnes[pastureId] > allowableTonnes) {
          acc.push({
            id: entry.id,
            message: `Total Tonnes: ${aggregatedTonnes[pastureId]} of schedule entries of pasture "${pastureName}" have exceeded recommended tonnes value: ${allowableTonnes}.`,
            type: 'warning',
          });
        }
      }
      return acc;
    }, []);
    const uniqueWarnings = Array.from(new Set(warningEntries.map((w) => w.id))).map((id) =>
      warningEntries.find((w) => w.id === id),
    );
    return uniqueWarnings[0];
  };

  const scheduleError = getScheduleError();

  const setSortBy = (column) => formik.setFieldValue(`${namespace}.sortBy`, column);
  const setSortOrder = (order) => formik.setFieldValue(`${namespace}.sortOrder`, order);

  const handleHeaderClick = (column) => {
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
        updateSortOrder(schedule.planId, schedule.id, null, null);
        formik.setFieldValue(`${namespace}.scheduleEntries`, _.orderBy(schedule.scheduleEntries, ['id'], ['asc']));
      }
    }
  };

  const headerCellProps = {
    currentSortBy: sortBy,
    currentSortOrder: sortOrder === 'asc' ? 'ascending' : 'descending',
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
                  {isError ? <Icon name="warning sign" /> : <img src={IMAGE_SRC.SCHEDULES_ICON} alt="schedule icon" />}
                </div>
                {year} Schedule
              </div>
            }
            shouldHideHeaderRightWhenNotActive
            headerRight={
              <IfEditable permission={[SCHEDULE.COPY, SCHEDULE.DELETE]} any>
                <Dropdown
                  trigger={<Icon name="ellipsis vertical" />}
                  icon={null}
                  pointing="right"
                  loading={false}
                  disabled={false}
                >
                  <Dropdown.Menu>
                    <IfEditable permission={SCHEDULE.COPY}>
                      <Dropdown
                        header="Years"
                        text="Copy To"
                        pointing="left"
                        className="link item"
                        options={copyOptions}
                        disabled={copyOptions.length === 0}
                        data-testid={`copy-button-${schedule.year}`}
                      />
                    </IfEditable>
                    <IfEditable permission={SCHEDULE.DELETE}>
                      <Dropdown.Item onClick={() => onScheduleDelete()} data-testid={`delete-button-${schedule.year}`}>
                        Delete
                      </Dropdown.Item>
                    </IfEditable>
                  </Dropdown.Menu>
                </Dropdown>
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
                  <Table sortable unstackable columns={10} attached={isError || scheduleError ? 'bottom' : false}>
                    <Table.Header>
                      <Table.Row>
                        <SortableTableHeaderCell column="area" {...headerCellProps}>
                          <div className="rup__grazing-schedule__pasture">{strings.AREA}</div>
                        </SortableTableHeaderCell>
                        <SortableTableHeaderCell column="avgHeight" {...headerCellProps}>
                          {strings.AVERAGE_HEIGHT}
                        </SortableTableHeaderCell>
                        <SortableTableHeaderCell column="periodStart" {...headerCellProps}>
                          <div className="rup__grazing-schedule__dates">{strings.PRRIOD_START}</div>
                        </SortableTableHeaderCell>
                        <SortableTableHeaderCell column="periodEnd" {...headerCellProps}>
                          <div className="rup__grazing-schedule__dates">{strings.PERIOD_END}</div>
                        </SortableTableHeaderCell>
                        <SortableTableHeaderCell column="tonnes" {...headerCellProps}>
                          <div className="rup__grazing-schedule__grace-days">{strings.TONNES}</div>
                        </SortableTableHeaderCell>
                        <SortableTableHeaderCell />
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {schedule.scheduleEntries.map((entry, entryIndex) => (
                        <HayCuttingScheduleEntryRow
                          key={entry.id || entry.key}
                          schedule={schedule}
                          entry={entry}
                          entryIndex={entryIndex}
                          scheduleIndex={index}
                          namespace={`${namespace}.scheduleEntries.${entryIndex}`}
                          onDelete={() => setToRemove(entryIndex)}
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
                    </Table.Body>
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
                        pastureId: '',
                        dateIn: '',
                        dateOut: '',
                        stubbleHeight: '',
                        tonnes: '',
                        id: uuid(),
                      });

                      // Touch fields to ensure error status is shown for new entries
                      const lastIndex = schedule.scheduleEntries.length;
                      formik.setFieldTouched(`${namespace}.scheduleEntries.${lastIndex}.stubbleHeight`, true);
                      formik.setFieldTouched(`${namespace}.scheduleEntries.${lastIndex}.tonnes`, true);
                      formik.setFieldTouched(`${namespace}.scheduleEntries.${lastIndex}.pastureId`, true);
                    }}
                  >
                    <Icon name="add circle" />
                    Add Row
                  </PrimaryButton>
                </IfEditable>
                <div className="rup__grazing-schedule__AUMs">
                  <div className="rup__grazing-schedule__AUM-label">Annual Authorized Tonnes</div>
                  <div className="rup__grazing-schedule__AUM-number">{authorizedTonnes}</div>
                  <div className="rup__grazing-schedule__AUM-label">Total Tonnes</div>
                  <div
                    className={classnames('rup__grazing-schedule__AUM-number', {
                      'rup__grazing-schedule__AUM-number--invalid': isTotalTonnesError,
                    })}
                  >
                    {roundedTotalTonnes}
                  </div>
                  <div className="rup__grazing-schedule__AUM-label">% Used</div>
                  <div className="rup__grazing-schedule__AUM-number">
                    {authorizedTonnes > 0 ? ((roundedTotalTonnes / authorizedTonnes) * 100).toFixed(2) : '0.00'}
                  </div>
                </div>
                <div className="rup__grazing-schedule__narrative__title">Schedule Description</div>
                <div>Schedule description is optional but if included is legal content</div>
                <div>
                  <PermissionsField
                    permission={SCHEDULE.DESCRIPTION}
                    name={`${namespace}.narative`}
                    component={TextArea}
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

          <Confirm
            open={toRemove !== null}
            onCancel={() => {
              setToRemove(null);
            }}
            onConfirm={async () => {
              const entry = schedule.scheduleEntries[toRemove];

              if (!uuid.isUUID(entry.id)) {
                await deleteScheduleEntry(schedule.planId, schedule.id, entry.id);
              }
              remove(toRemove);
              setToRemove(null);
            }}
          />
        </>
      )}
    />
  );
};

HayCuttingScheduleBox.propTypes = {
  schedule: PropTypes.object.isRequired,
  activeIndex: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  namespace: PropTypes.string.isRequired,
  yearOptions: PropTypes.array.isRequired,
  onScheduleClicked: PropTypes.func.isRequired,
  authorizedTonnes: PropTypes.number.isRequired,
  totalTonnes: PropTypes.number.isRequired,
  onScheduleCopy: PropTypes.func.isRequired,
  onScheduleDelete: PropTypes.func.isRequired,
};

export default connect(HayCuttingScheduleBox);
