import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Dropdown, Icon, Table, Confirm } from 'semantic-ui-react'
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
  const { id, year } = schedule
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
      return strings.EMPTY_GRAZING_SCHEDULE_ENTRIES
    }
    if (isCrownTotalAUMsError) {
      return strings.TOTAL_AUMS_EXCEEDS
    }
  }

  const scheduleError = getScheduleError()

  return (
    <FieldArray
      name={`${namespace}.grazingScheduleEntries`}
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
              <Dropdown
                trigger={<Icon name="ellipsis vertical" />}
                icon={null}
                pointing="right"
                loading={false}
                disabled={false}>
                <Dropdown.Menu>
                  <Dropdown
                    header="Years"
                    text="Copy"
                    pointing="left"
                    className="link item"
                    options={copyOptions}
                    disabled={copyOptions.length === 0}
                    data-testid={`copy-button-${schedule.year}`}
                  />
                  <Dropdown.Item
                    onClick={() => onScheduleDelete()}
                    data-testid={`delete-button-${schedule.year}`}>
                    Delete
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            }
            collapsibleContent={
              <>
                {(isError || scheduleError) && (
                  <ErrorMessage
                    message={
                      scheduleError || strings.INVALID_GRAZING_SCHEDULE_ENTRY
                    }
                    visible
                    attached
                  />
                )}
                <Table
                  unstackable
                  attached={isError || scheduleError ? 'bottom' : false}>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>
                        <div className="rup__grazing-schedule__pasture">
                          {strings.PASTURE}
                        </div>
                      </Table.HeaderCell>
                      <Table.HeaderCell>
                        <div className="rup__grazing-schedule__l-type">
                          {strings.LIVESTOCK_TYPE}
                        </div>
                      </Table.HeaderCell>
                      <Table.HeaderCell>
                        {strings.NUM_OF_ANIMALS}
                      </Table.HeaderCell>
                      <Table.HeaderCell>
                        <div className="rup__grazing-schedule__dates">
                          {strings.DATE_IN}
                        </div>
                      </Table.HeaderCell>
                      <Table.HeaderCell>
                        <div className="rup__grazing-schedule__dates">
                          {strings.DATE_OUT}
                        </div>
                      </Table.HeaderCell>
                      <Table.HeaderCell>{strings.DAYS}</Table.HeaderCell>
                      <Table.HeaderCell>
                        <div className="rup__grazing-schedule__grace-days">
                          {strings.GRACE_DAYS}
                        </div>
                      </Table.HeaderCell>
                      <Table.HeaderCell>{strings.PLD}</Table.HeaderCell>
                      <Table.HeaderCell>{strings.CROWN_AUMS}</Table.HeaderCell>
                      <Table.HeaderCell />
                    </Table.Row>
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
                          onCopy={() => push({ ...entry, id: uuid() })}
                        />
                      )
                    )}
                  </Table.Header>
                </Table>
                <IfEditable permission={SCHEDULE.TYPE}>
                  <PrimaryButton
                    style={{ margin: '10px 0' }}
                    inverted
                    compact
                    onClick={() => {
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
                    Authorized AUMs
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
