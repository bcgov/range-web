import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Dropdown, Icon, Table, Confirm } from 'semantic-ui-react'
import * as _ from 'lodash/fp'
import GrazingScheduleEntryRow from './GrazingScheduleEntryRow'
import { roundTo1Decimal } from '../../../utils'
import * as strings from '../../../constants/strings'
import { CollapsibleBox, PrimaryButton, ErrorMessage } from '../../common'
import { IMAGE_SRC } from '../../../constants/variables'
import { FieldArray, connect, getIn } from 'formik'
import uuid from 'uuid-v4'
import { TextArea } from 'formik-semantic-ui'
import PermissionsField, { IfEditable } from '../../common/PermissionsField'
import { SCHEDULE } from '../../../constants/fields'
import { deleteGrazingScheduleEntry } from '../../../api'
import MultiParagraphDisplay from '../../common/MultiParagraphDisplay'
import { useUser } from '../../../providers/UserProvider'
import SortableTableHeaderCell from '../../common/SortableTableHeaderCell'
import { resetGrazingScheduleEntryId } from '../../../utils/helper/grazingSchedule'

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
  formik
}) => {
  const { id, year, sortBy, sortOrder } = schedule
  const user = useUser()
  const narative = (schedule && schedule.narative) || ''
  const roundedCrownTotalAUMs = roundTo1Decimal(crownTotalAUMs)
  const copyOptions =
    yearOptions.map(o => ({
      ...o,
      onClick: () => onScheduleCopy(o.value, schedule.id)
    })) || []
  const isCrownTotalAUMsError = crownTotalAUMs > authorizedAUMs

  const [toRemove, setToRemove] = useState(null)

  const isError = !!getIn(formik.errors, namespace)

  const getScheduleError = () => {
    if (schedule.grazingScheduleEntries.length === 0) {
      if (user.roles.includes('myra_range_officer'))
        return {
          message: 'This schedule has no associated rows.',
          type: 'warning'
        }
      return { message: strings.EMPTY_GRAZING_SCHEDULE_ENTRIES, type: 'error' }
    }
    if (isCrownTotalAUMsError) {
      return {
        message:
          strings.TOTAL_AUMS_EXCEEDS +
          ' Over by: ' +
          (crownTotalAUMs - authorizedAUMs).toFixed(1).toString(),
        type: 'error'
      }
    }
  }

  const scheduleError = getScheduleError()

  const setSortBy = column =>
    formik.setFieldValue(`${namespace}.sortBy`, column)
  const setSortOrder = order =>
    formik.setFieldValue(`${namespace}.sortOrder`, order)

  const handleHeaderClick = column => {
    console.log('sorting by ' + column);
    const orderByColumn = _.orderBy([column, 'id'])

    if (column !== sortBy) {
      setSortBy(column)
      setSortOrder('asc')

      formik.setFieldValue(
        `${namespace}.grazingScheduleEntries`,
        orderByColumn('asc', schedule.grazingScheduleEntries)
      )
    } else {
      if (sortOrder === 'asc') {
        setSortOrder('desc')

        formik.setFieldValue(
          `${namespace}.grazingScheduleEntries`,
          orderByColumn('desc', schedule.grazingScheduleEntries)
        )
      } else {
        setSortOrder(null)
        setSortBy(null)
        formik.setFieldValue(
          `${namespace}.grazingScheduleEntries`,
          _.orderBy('id', 'asc', schedule.grazingScheduleEntries)
        )
      }
    }
  }

  const headerCellProps = {
    currentSortBy: sortBy,
    currentSortOrder: sortOrder === 'asc' ? 'ascending' : 'descending',
    onClick: handleHeaderClick
  }

  return (
    <FieldArray
      name={`${namespace}.grazingScheduleEntries`}
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
                    <Icon name="warning sign" />
                  ) : (
                    <img src={IMAGE_SRC.SCHEDULES_ICON} alt="schedule icon" />
                  )}
                </div>
                {year} Grazing Schedule
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
                  disabled={false}>
                  <Dropdown.Menu>
                    <IfEditable permission={SCHEDULE.COPY}>
                      <Dropdown
                        header="Years"
                        text="Copy"
                        pointing="left"
                        className="link item"
                        options={copyOptions}
                        disabled={copyOptions.length === 0}
                        data-testid={`copy-button-${schedule.year}`}
                      />
                    </IfEditable>
                    <IfEditable permission={SCHEDULE.DELETE}>
                      <Dropdown.Item
                        onClick={() => onScheduleDelete()}
                        data-testid={`delete-button-${schedule.year}`}>
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
                    message={
                      (scheduleError && scheduleError.message) ||
                      strings.INVALID_GRAZING_SCHEDULE_ENTRY
                    }
                    warning={scheduleError && scheduleError.type === 'warning'}
                    visible
                    attached
                  />
                )}
                <div style={{ overflowX: 'scroll' }}>
                  <Table
                    sortable
                    unstackable
                    columns={10}
                    attached={isError || scheduleError ? 'bottom' : false}>
                    <Table.Header>
                      <Table.Row>
                        <SortableTableHeaderCell
                          column="pasture.name"
                          {...headerCellProps}>
                          <div className="rup__grazing-schedule__pasture">
                            {strings.PASTURE}
                          </div>
                        </SortableTableHeaderCell>
                        <SortableTableHeaderCell
                          column="livestockType.name"
                          {...headerCellProps}>
                          <div className="rup__grazing-schedule__l-type">
                            {strings.LIVESTOCK_TYPE}
                          </div>
                        </SortableTableHeaderCell>
                        <SortableTableHeaderCell
                          column="livestockCount"
                          {...headerCellProps}>
                          {strings.NUM_OF_ANIMALS}
                        </SortableTableHeaderCell>
                        <SortableTableHeaderCell
                          column="dateIn"
                          {...headerCellProps}>
                          <div className="rup__grazing-schedule__dates">
                            {strings.DATE_IN}
                          </div>
                        </SortableTableHeaderCell>
                        <SortableTableHeaderCell
                          column="dateOut"
                          {...headerCellProps}>
                          <div className="rup__grazing-schedule__dates">
                            {strings.DATE_OUT}
                          </div>
                        </SortableTableHeaderCell>
                        <SortableTableHeaderCell   {...headerCellProps} column="days">
                          {strings.DAYS}
                        </SortableTableHeaderCell>
                        <SortableTableHeaderCell
                          column="graceDays"
                          {...headerCellProps}>
                          <div className="rup__grazing-schedule__grace-days">
                            {strings.GRACE_DAYS}
                          </div>
                        </SortableTableHeaderCell>
                        <SortableTableHeaderCell {...headerCellProps} column="pldAUMs">
                          {strings.PLD}
                        </SortableTableHeaderCell>
                        <SortableTableHeaderCell {...headerCellProps} column="crownAUMs">
                          {strings.CROWN_AUMS}
                        </SortableTableHeaderCell>
                        <SortableTableHeaderCell />
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {schedule.grazingScheduleEntries.map(
                        (entry, entryIndex) => (
                          <GrazingScheduleEntryRow
                            key={entry.id || entry.key}
                            schedule={schedule}
                            entry={entry}
                            entryIndex={entryIndex}
                            scheduleIndex={index}
                            namespace={`${namespace}.grazingScheduleEntries.${entryIndex}`}
                            onDelete={() => setToRemove(entryIndex)}
                            onCopy={() => {
                              setSortOrder(null)
                              setSortBy(null)
                              push(resetGrazingScheduleEntryId(entry))
                            }}
                            onChange={() => {
                              setSortBy(null)
                            }}
                          />
                        )
                      )}
                    </Table.Body>
                  </Table>
                </div>

                <IfEditable permission={SCHEDULE.TYPE}>
                  <PrimaryButton
                    style={{ margin: '10px 0' }}
                    inverted
                    compact
                    onClick={() => {
                      setSortOrder(null)
                      setSortBy(null)
                      push({
                        dateIn: '',
                        dateOut: '',
                        graceDays: '',
                        livestockCount: '',
                        livestockTypeId: '',
                        id: uuid()
                      })

                      // Touch fields to ensure error status is shown for new entries
                      const lastIndex = schedule.grazingScheduleEntries.length
                      formik.setFieldTouched(
                        `${namespace}.grazingScheduleEntries.${lastIndex}.livestockCount`,
                        true
                      )
                      formik.setFieldTouched(
                        `${namespace}.grazingScheduleEntries.${lastIndex}.livestockTypeId`,
                        true
                      )
                      formik.setFieldTouched(
                        `${namespace}.grazingScheduleEntries.${lastIndex}.pastureId`,
                        true
                      )
                    }}>
                    <Icon name="add circle" />
                    Add Row
                  </PrimaryButton>
                </IfEditable>
                <div className="rup__grazing-schedule__AUMs">
                  <div className="rup__grazing-schedule__AUM-label">
                    Annual Authorized AUMs
                  </div>
                  <div className="rup__grazing-schedule__AUM-number">
                    {authorizedAUMs}
                  </div>
                  <div className="rup__grazing-schedule__AUM-label">
                    Total AUMs
                  </div>
                  <div
                    className={classnames('rup__grazing-schedule__AUM-number', {
                      'rup__grazing-schedule__AUM-number--invalid': isCrownTotalAUMsError
                    })}>
                    {roundedCrownTotalAUMs}
                  </div>
                </div>
                <div className="rup__grazing-schedule__narrative__title">
                  Schedule Description
                </div>
                <div>
                  Schedule description is optional but if included is legal
                  content
                </div>
                <div>
                  <PermissionsField
                    permission={SCHEDULE.DESCRIPTION}
                    name={`${namespace}.narative`}
                    component={TextArea}
                    inputProps={{
                      placeholder: `Description of movement of livestock through agreement area. May include WHEN, WHERE and HOW management tools are used to create that flow. May be of particular value when an agreement consists of a single pasture or multiple unfenced pastures.`,
                      rows: 3,
                      style: { marginTop: '5px' }
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
              setToRemove(null)
            }}
            onConfirm={async () => {
              const entry = schedule.grazingScheduleEntries[toRemove]

              if (!uuid.isUUID(entry.id)) {
                await deleteGrazingScheduleEntry(
                  schedule.planId,
                  schedule.id,
                  entry.id
                )
              }
              remove(toRemove)
              setToRemove(null)
            }}
          />
        </>
      )}
    />
  )
}

GrazingScheduleBox.propTypes = {
  schedule: PropTypes.object.isRequired,
  activeIndex: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  namespace: PropTypes.string.isRequired,
  crownTotalAUMs: PropTypes.number.isRequired,
  yearOptions: PropTypes.array.isRequired,
  onScheduleClicked: PropTypes.func.isRequired,
  authorizedAUMs: PropTypes.number.isRequired,
  onScheduleCopy: PropTypes.func.isRequired,
  onScheduleDelete: PropTypes.func.isRequired
}

export default connect(GrazingScheduleBox)
