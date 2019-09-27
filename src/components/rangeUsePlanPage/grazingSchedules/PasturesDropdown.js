import React from 'react'
import PermissionsField from '../../common/PermissionsField'
import { SCHEDULE } from '../../../constants/fields'
import { connect } from 'formik'
import { Dropdown } from 'formik-semantic-ui'

const PasturesDropdown = ({ name, formik, pastureId }) => {
  const pastureOptions = formik.values.pastures.map(pasture => {
    const { id, name } = pasture || {}
    return {
      key: id,
      value: id,
      text: name
    }
  })
  return (
    <PermissionsField
      permission={SCHEDULE.PASTURE}
      name={name}
      options={pastureOptions}
      component={Dropdown}
      displayValue={
        pastureOptions.find(p => p.value === pastureId)
          ? pastureOptions.find(p => p.value === pastureId).text
          : ''
      }
      fluid
      inputProps={{
        fluid: true,
        search: true
      }}
      fast
    />
  )
}

export default connect(PasturesDropdown)
