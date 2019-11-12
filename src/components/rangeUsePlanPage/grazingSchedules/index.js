import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Dropdown } from 'semantic-ui-react'
import classnames from 'classnames'
import { FieldArray } from 'formik'
import uuid from 'uuid-v4'
import { IfEditable } from '../../common/PermissionsField'
import { SCHEDULE } from '../../../constants/fields'
import * as utils from '../../../utils'
import GrazingScheduleBox from './GrazingScheduleBox'
import { useReferences } from '../../../providers/ReferencesProvider'
import { REFERENCE_KEY } from '../../../constants/variables'

const GrazingSchedules = ({ plan }) => {
  const [yearOptions, setYearOptions] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)

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
  }, [])

  const handleScheduleCopy = () => {}
  const handleScheduleDelete = () => {}

  return (
    <FieldArray
      name="grazingSchedules"
      render={({ push }) => (
        <div className="rup__grazing-schedules">
          <div className="rup__content-title--editable">
            Yearly Schedules
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
            <div className="rup__section-not-found">No schedule provided.</div>
          ) : (
            <ul
              className={classnames('collaspible-boxes', {
                'collaspible-boxes--empty': isEmpty
              })}>
              {grazingSchedules.map((schedule, index) => {
                const yearUsage = plan.agreement.usage.find(
                  u => u.year === schedule.year
                )
                const authorizedAUMs =
                  (yearUsage && yearUsage.authorizedAum) || 0
                const crownTotalAUMs = utils.calcCrownTotalAUMs(
                  schedule.grazingScheduleEntries,
                  plan.pastures,
                  livestockTypes
                )

                return (
                  <GrazingScheduleBox
                    key={schedule.id}
                    yearOptions={yearOptions}
                    schedule={schedule}
                    index={index}
                    onScheduleClicked={() => setActiveIndex(index)}
                    activeIndex={activeIndex}
                    livestockTypes={livestockTypes}
                    namespace={`grazingSchedules.${index}`}
                    authorizedAUMs={authorizedAUMs}
                    crownTotalAUMs={crownTotalAUMs}
                    onScheduleCopy={handleScheduleCopy}
                    onScheduleDelete={handleScheduleDelete}
                  />
                )
              })}
            </ul>
          )}
        </div>
      )}
    />
  )
}

GrazingSchedules.propTypes = {
  plan: PropTypes.object.isRequired
}

export default GrazingSchedules
