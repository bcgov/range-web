import React from 'react'
import PermissionsField from '../../common/PermissionsField'
import { SCHEDULE } from '../../../constants/fields'
import { connect } from 'formik'
import { Dropdown } from 'formik-semantic-ui'
import MultiParagraphDisplay from '../../common/MultiParagraphDisplay'

const PasturesDropdown = ({ name, formik, pastureId, onChange }) => {
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
      displayComponent={MultiParagraphDisplay}
      displayValue={
        pastureOptions.find(p => p.value === pastureId)
          ? pastureOptions.find(p => p.value === pastureId).text
          : ''
      }
      fluid
      inputProps={{
        floating: true,
        fluid: true,
        search: true,
        'aria-label': 'pasture',
        onChange: (e, { value }) => {
          if (onChange)
            onChange(e, {
              value,
              pasture: formik.values.pastures.find(p => p.id === value)
            })
        }
      }}
      fast
    />
  )
}

export default connect(PasturesDropdown)
