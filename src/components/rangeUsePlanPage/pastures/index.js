import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import _ from 'lodash'
import { Button, Confirm } from 'semantic-ui-react'
import { FieldArray, connect } from 'formik'
import uuid from 'uuid-v4'
import PastureBox from './PastureBox'
import { IfEditable } from '../../common/PermissionsField'
import * as strings from '../../../constants/strings'
import { PASTURES } from '../../../constants/fields'
import { InfoTip, InputModal } from '../../common'
import { deletePasture } from '../../../api'

const Pastures = ({ pastures, formik }) => {
  const [isModalOpen, setModalOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [indexToRemove, setIndexToRemove] = useState(null)
  const handlePastureClick = useCallback(index => {
    setActiveIndex(activeIndex === index ? -1 : index)
  })
  const handlePastureCopy = useCallback(index => {
    console.log('copy', index)
  })

  return (
    <FieldArray
      name="pastures"
      render={({ push, remove }) => (
        <div className="rup__pastures">
          <div className="rup__content-title--editable">
            <div className="rup__popup-header">
              <div className="rup__content-title">{strings.PASTURES}</div>
              <InfoTip
                header={strings.PASTURES}
                content={strings.PASTURES_TIP}
              />
            </div>
            <IfEditable permission={PASTURES.NAME}>
              <Button
                type="button"
                basic
                primary
                onClick={() => {
                  setModalOpen(true)
                }}
                className="icon labeled rup__pastures__add-button">
                <i className="add circle icon" />
                Add Pasture
              </Button>
            </IfEditable>
          </div>

          <InputModal
            open={isModalOpen}
            onClose={() => setModalOpen(false)}
            onSubmit={name => {
              push({
                name,
                allowableAum: '',
                graceDays: 1,
                pldPercent: 0,
                notes: '',
                plantCommunities: [],
                id: uuid()
              })
              setModalOpen(false)
            }}
            title="Add pasture"
            placeholder="Pasture name"
          />

          <Confirm
            header={`Delete pasture '${pastures[indexToRemove] &&
              pastures[indexToRemove].name}'`}
            content="Are you sure? All related plant communities, monitoring areas and criteria, as well as any associated grazing schedule rows, will be deleted"
            open={indexToRemove !== null}
            onCancel={() => {
              setIndexToRemove(null)
            }}
            onConfirm={async () => {
              const pasture = pastures[indexToRemove]

              const schedules = _.flatten(
                formik.values.grazingSchedules.map(schedule => ({
                  ...schedule,
                  grazingScheduleEntries: schedule.grazingScheduleEntries.filter(
                    entry => entry.pastureId !== pasture.id
                  )
                }))
              )
              formik.setFieldValue('grazingSchedules', schedules)

              if (!uuid.isUUID(pasture.id)) {
                await deletePasture(pasture.planId, pasture.id)
              }

              remove(indexToRemove)
              setIndexToRemove(null)
            }}
          />

          <div className="rup__divider" />
          {pastures.length === 0 ? (
            <div className="rup__section-not-found">No pasture provided.</div>
          ) : (
            <ul
              className={classnames('collaspible-boxes', {
                'collaspible-boxes--empty': pastures.length === 0
              })}>
              {pastures.map((pasture, index) => (
                <PastureBox
                  key={pasture.id}
                  pasture={pasture}
                  index={index}
                  activeIndex={activeIndex}
                  onClick={handlePastureClick}
                  onCopy={handlePastureCopy}
                  onDelete={() => setIndexToRemove(index)}
                  namespace={`pastures.${index}`}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    />
  )
}

Pastures.propTypes = {
  pastures: PropTypes.array.isRequired
}

export default connect(Pastures)
