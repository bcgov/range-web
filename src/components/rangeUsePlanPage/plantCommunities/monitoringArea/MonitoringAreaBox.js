import React from 'react'
import PropTypes from 'prop-types'
import { handleNullValue, oxfordComma } from '../../../../utils'
import { MONITORING_AREAS } from '../../../../constants/fields'
import { Input, Dropdown } from 'formik-semantic-ui'
import PermissionsField from '../../../common/PermissionsField'
import { REFERENCE_KEY } from '../../../../constants/variables'
import { connect } from 'formik'
import { useReferences } from '../../../../providers/ReferencesProvider'
import LocationButton from '../../../common/LocationButton'
import { Icon } from 'semantic-ui-react'

const MonitoringAreaBox = ({ monitoringArea, namespace, formik }) => {
  const {
    latitude,
    location,
    longitude,
    name,
    purposes,
    rangelandHealth
  } = monitoringArea

  const references = useReferences()

  const rangelandHealthTypes = references[REFERENCE_KEY.MONITORING_AREA_HEALTH]
  const rangelandHealthOptions = rangelandHealthTypes.map(type => ({
    key: type.id,
    value: type.id,
    text: type.name
  }))

  const purposeTypes = references[REFERENCE_KEY.MONITORING_AREA_PURPOSE_TYPE]
  const purposeOptions = purposeTypes.map(type => ({
    key: type.id,
    value: type.id,
    text: type.name
  }))

  return (
    <div className="rup__plant-community__m-area__box">
      <div className="rup__plant-community__m-area__header">
        {/* <Icon name="map marker alternate" /> */}
        Monitoring Area: {name}
      </div>
      <div className="rup__row">
        <div className="rup__cell-6">
          <div className="rup__plant-community__m-area__label">Location</div>
          <div>{handleNullValue(location)}</div>
        </div>
        <div className="rup__cell-6">
          <PermissionsField
            name={`${namespace}.rangelandHealth`}
            permission={MONITORING_AREAS.RANGELAND_HEALTH}
            component={Dropdown}
            options={rangelandHealthOptions}
            displayValue={
              rangelandHealthTypes.find(r => r.id === rangelandHealth)
                ? rangelandHealthTypes.find(r => r.id === rangelandHealth).name
                : ''
            }
            label="Rangeland Health"
          />
        </div>
      </div>
      <PermissionsField
        name={`${namespace}.purposes`}
        permission={MONITORING_AREAS.PURPOSE}
        component={Dropdown}
        options={purposeOptions}
        inputProps={{
          multiple: true
        }}
        displayValue={oxfordComma(
          purposes.map(purpose => purposeTypes.find(p => p.id === purpose).name)
        )}
        label="Purposes"
      />

      <div className="rup__row">
        <div className="rup__cell-4">
          <PermissionsField
            name={`${namespace}.latitude`}
            permission={MONITORING_AREAS.LATITUDE}
            component={Input}
            displayValue={latitude}
            label="Latitude"
            inputProps={{
              type: 'number'
            }}
          />
        </div>
        <div className="rup__cell-4">
          <PermissionsField
            name={`${namespace}.longitude`}
            permission={MONITORING_AREAS.LONGTITUDE}
            component={Input}
            displayValue={longitude}
            label="Longitude"
            inputProps={{
              type: 'number'
            }}
          />
        </div>
        <div className="rup__cell-4">
          <LocationButton
            onLocation={({ coords: { longitude, latitude } }) => {
              formik.setFieldValue(`${namespace}.longitude`, longitude)
              formik.setFieldValue(`${namespace}.latitude`, latitude)
            }}>
            <Icon name="compass" />
            Get Location
          </LocationButton>
        </div>
      </div>
    </div>
  )
}

MonitoringAreaBox.propTypes = {
  monitoringArea: PropTypes.shape({}).isRequired,
  namespace: PropTypes.string.isRequired,
  formik: PropTypes.shape({
    setFieldValue: PropTypes.func.isRequired
  })
}

export default connect(MonitoringAreaBox)
