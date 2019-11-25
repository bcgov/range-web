import React from 'react'
import PropTypes from 'prop-types'
import { Input } from 'formik-semantic-ui'
import { RANGE_READINESS } from '../../../../constants/fields'
import PermissionsField from '../../../common/PermissionsField'

const ShrubUseBox = ({ plantCommunity, namespace }) => {
  return (
    <div className="rup__plant-community__su">
      <div className="rup__plant-community__su__title">
        {/* <img src={IMAGE_SRC.INFO_ICON} alt="info icon" /> */}
        Shrub Use
      </div>
      <div>
        Unless otherwise indicated the allowable browse level is 25% of current
        annual growth.
      </div>

      <PermissionsField
        name={`${namespace}.shrubUse`}
        permission={RANGE_READINESS.NOTE}
        component={Input}
        displayValue={plantCommunity.shrubUse}
        label="% of Current Annual Growth"
      />
    </div>
  )
}

ShrubUseBox.propTypes = {
  plantCommunity: PropTypes.shape({
    indicatorPlants: PropTypes.arrayOf(PropTypes.object)
  }),
  namespace: PropTypes.string.isRequired
}

export default ShrubUseBox
