import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Dropdown, Confirm } from 'semantic-ui-react'
import classnames from 'classnames'
import { FieldArray } from 'formik'
import uuid from 'uuid-v4'
import { InfoTip } from '../../common'
import { IfEditable } from '../../common/PermissionsField'
import {
  YEARLY_SCHEDULES,
  YEARLY_SCHEDULES_TIP
} from '../../../constants/strings'
import { SCHEDULE } from '../../../constants/fields'
import * as utils from '../../../utils'
import GrazingScheduleBox from './GrazingScheduleBox'
import { useReferences } from '../../../providers/ReferencesProvider'
import { REFERENCE_KEY } from '../../../constants/variables'
import moment from 'moment'
import { deleteGrazingSchedule } from '../../../api'
import { populateGrazingScheduleFields } from '../../../utils/helper/grazingSchedule'

const sortYears = (a, b) => {
  if (a.year > b.year) return 1
  if (a.year < b.year) return -1
  return 0
}

const GrazingSchedules = ({ plan }) => {
  const [yearOptions, setYearOptions] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [indexToRemove, setIndexToRemove] = useState(null)

  const references = useReferences()
  const livestockTypes = references[REFERENCE_KEY.LIVESTOCK_TYPE]

  const { grazingSchedules } = plan
  const isEmpty = grazingSchedules.length === 0

  useEffect(() => {
    const { planStartDate, planEndDate } = plan || {}
    if (planStartDate && planEndDate) {
      // set up year options
      const planStartYear = new Date(planStartDate).getFullYear()
      const planEndYear = new Date(planEndDate).getFullYear()
      const length = planEndYear - planStartYear + 1
      const options = utils
        .createEmptyArray(length)
        .map((v, i) => ({
          key: planStartYear + i,
          text: planStartYear + i,
          value: planStartYear + i
        }))
        .filter(option => {
          // give year options that hasn't been added yet in schedules
          const grazingSchedules = plan.grazingSchedules
          const years = grazingSchedules.map(s => s.year)
          return !(years.indexOf(option.value) >= 0)
        })
      setYearOptions(options)
    }
  }, [grazingSchedules.length, plan.planStartDate, plan.planEndDate])

  return (
    <FieldArray
      name="grazingSchedules"
      render={({ push, remove }) => (
        <>
          <div className="rup__grazing-schedules">
            <div className="rup__content-title--editable">
              <div className="rup__popup-header">
                <div className="rup__content-title">{YEARLY_SCHEDULES}</div>
                <InfoTip
                  header={YEARLY_SCHEDULES}
                  content={YEARLY_SCHEDULES_TIP}
                />
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
                      grazingScheduleEntries: [],
                      narative: '',
                      year: value,
                      id: uuid()
                    })
                  }}
                  selectOnBlur={false}
                  pointing
                  compact
                />
              </IfEditable>
            </div>
            <div className="rup__divider" />
            {isEmpty ? (
              <div className="rup__section-not-found">
                No schedule provided.
              </div>
            ) : (
              <ul
                className={classnames('collaspible-boxes', {
                  'collaspible-boxes--empty': isEmpty
                })}>
                {grazingSchedules.sort(sortYears).map((schedule, index) => {
                  const yearUsage = plan.agreement.usage.find(
                    u => u.year === schedule.year
                  )
                  const authorizedAUMs =
                    (yearUsage && yearUsage.totalAnnualUse) || 0
                  const crownTotalAUMs = utils.calcCrownTotalAUMs(
                    schedule.grazingScheduleEntries,
                    plan.pastures,
                    livestockTypes
                  )

                  return (
                    <GrazingScheduleBox
                      key={schedule.id}
                      yearOptions={yearOptions}
                      schedule={populateGrazingScheduleFields(
                        schedule,
                        plan,
                        references
                      )}
                      index={index}
                      onScheduleClicked={() =>
                        setActiveIndex(index !== activeIndex ? index : -1)
                      }
                      activeIndex={activeIndex}
                      livestockTypes={livestockTypes}
                      namespace={`grazingSchedules.${index}`}
                      authorizedAUMs={authorizedAUMs}
                      crownTotalAUMs={crownTotalAUMs}
                      onScheduleCopy={year => {
                        push({
                          ...schedule,
                          id: uuid(),
                          year,
                          grazingScheduleEntries: schedule.grazingScheduleEntries.map(
                            entry => ({
                              ...entry,
                              id: uuid(),
                              dateIn: moment(entry.dateIn)
                                .set('year', year)
                                .toISOString(),
                              dateOut: moment(entry.dateOut)
                                .set('year', year)
                                .toISOString()
                            })
                          )
                        })
                      }}
                      onScheduleDelete={() => setIndexToRemove(index)}
                    />
                  )
                })}
              </ul>
            )}
          </div>
          <Confirm
            open={indexToRemove !== null}
            onCancel={() => {
              setIndexToRemove(null)
            }}
            onConfirm={async () => {
              const schedule = grazingSchedules[indexToRemove]

              if (!uuid.isUUID(schedule.id)) {
                await deleteGrazingSchedule(plan.id, schedule.id)
              }
              remove(indexToRemove)
              setIndexToRemove(null)
            }}
          />
        </>
      )}
    />
  )
}

GrazingSchedules.propTypes = {
  plan: PropTypes.object.isRequired
}

export default GrazingSchedules
