import React, { useState } from 'react'
import PropTypes from 'prop-types'
import uuid from 'uuid-v4'
import MonitoringAreaRow from './MonitoringAreaBox'
import { FieldArray } from 'formik'
import AddMonitoringAreaButton from './AddMonitoringAreaButton'
import InputModal from '../../../common/InputModal'
import { IfEditable } from '../../../common/PermissionsField'
import { MONITORING_AREAS } from '../../../../constants/fields'

const MonitoringAreaList = ({ monitoringAreas, namespace }) => {
  const [areaToCopy, setAreaToCopy] = useState()

  return (
    <div className="rup__plant-community__m-areas">
      <FieldArray
        name={namespace}
        render={({ push, remove }) => (
          <>
            <IfEditable permission={MONITORING_AREAS.NAME}>
              <AddMonitoringAreaButton
                onClick={() => {
                  setAreaToCopy({
                    rangelandHealth: 0,
                    purposeTypeIds: [],
                    location: '',
                    latitute: 0,
                    longtitude: 0,
                    transect_azimuth: 0,
                    other_purpose: '',
                    id: uuid()
                  })
                }}
              />
            </IfEditable>
            <IfEditable permission={MONITORING_AREAS.NAME} invert>
              {monitoringAreas.length === 0 && <div>No monitoring areas</div>}
            </IfEditable>
            {monitoringAreas.map((monitoringArea, index) => (
              <MonitoringAreaRow
                key={monitoringArea.id}
                monitoringArea={monitoringArea}
                namespace={`${namespace}.${index}`}
                onRemove={() => remove(index)}
                onCopy={() => setAreaToCopy(monitoringArea)}
              />
            ))}

            <InputModal
              open={!!areaToCopy}
              onSubmit={name => {
                setAreaToCopy()
                push({
                  ...areaToCopy,
                  name
                })
              }}
              onClose={() => setAreaToCopy()}
              title="Monitoring Area Name"
            />
          </>
        )}
      />
    </div>
  )
}

MonitoringAreaList.propTypes = {
  monitoringAreas: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  namespace: PropTypes.string.isRequired
}

export default MonitoringAreaList
