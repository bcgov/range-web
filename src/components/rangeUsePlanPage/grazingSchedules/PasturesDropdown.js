import React from 'react'
import PermissionsField from '../../common/PermissionsField'
import { SCHEDULE } from '../../../constants/fields'
import Select from '../../common/Select'
import { connect } from 'formik'
import MultiParagraphDisplay from '../../common/MultiParagraphDisplay'

const PasturesDropdown = ({ name, formik, pastureId, onChange }) => {
  const pastureOptions = formik.values.pastures.map(pasture => {
    const { id, name } = pasture || {}
    return {
      key: id,
      value: id,
      label: name
    }
  })

  return (
    <PermissionsField
      permission={SCHEDULE.PASTURE}
      name={name}
      component={Select}
      displayComponent={MultiParagraphDisplay}
      displayValue={
        pastureOptions.find(p => p.value === pastureId)
          ? pastureOptions.find(p => p.value === pastureId).text
          : ''
      }
      aria-label="pasture"
      options={pastureOptions}
      onChange={value => {
        if (onChange) {
          onChange({
            value,
            pasture: formik.values.pastures.find(p => p.id === value)
          })
        }
      }}
    />
  )
}

export default connect(PasturesDropdown)
