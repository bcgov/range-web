import React, { useState, useRef } from 'react'
import PermissionsField, { IfEditable } from '../../common/PermissionsField'
import { STUBBLE_HEIGHT } from '../../../constants/fields'
import { Dropdown, Icon, Grid } from 'semantic-ui-react'
import { useReferences } from '../../../providers/ReferencesProvider'
import { REFERENCE_KEY } from '../../../constants/variables'
import { Dropdown as FormikDropdown, Form } from 'formik-semantic-ui'
import DecimalField from '../../common/form/DecimalField'

const IndicatorPlant = ({ plant, namespace, valueType, onDelete, formik }) => {
  const references = useReferences()

  const species =
    references[REFERENCE_KEY.PLANT_SPECIES].filter(s => !s.isShrubUse) || []

  const otherSpecies = species.find(s => s.name === 'Other')
  const [otherType, setOtherType] = useState({
    key: otherSpecies.id,
    value: otherSpecies.id,
    text: plant.name || otherSpecies.name
  })

  const options = species
    .map(species => ({
      key: species.id,
      value: species.id,
      text: species.name
    }))
    .concat(otherType)
    .filter(o => o.text !== 'Other')

  const onAddItem = (e, { value }) => {
    setOtherType({
      ...otherType,
      text: value
    })

    formik.setFieldValue(`${namespace}.plantSpeciesId`, otherType.value)
    formik.setFieldValue(`${namespace}.name`, value)
  }

  const valueInputRef = useRef(null)

  return (
    <Grid key={plant.id}>
      <Grid.Column mobile="15">
        <Form.Group widths="equal" style={{ margin: 0 }}>
          <PermissionsField
            permission={STUBBLE_HEIGHT.INDICATOR_PLANTS}
            name={`${namespace}.plantSpeciesId`}
            component={FormikDropdown}
            placeholder="Indicator Plant"
            options={options}
            displayValue={
              options.find(o => o.key === plant.plantSpeciesId)
                ? options.find(o => o.key === plant.plantSpeciesId).text
                : ''
            }
            inputProps={{
              search: true,
              allowAdditions: true,
              additionLabel: 'Other: ',
              onAddItem,
              selectOnBlur: true,
              onKeyDown: e => {
                if (e.keyCode === 13) {
                  valueInputRef.current.focus()
                }
              },
              onChange: (e, { value }) => {
                if (typeof value !== 'string') {
                  const plantValue = species.find(s => s.id === value)[
                    valueType
                  ]
                  if (plantValue) {
                    formik.setFieldValue(`${namespace}.value`, plantValue)
                  }
                }
              },
              fluid: true
            }}
          />

          <PermissionsField
            permission={STUBBLE_HEIGHT.INDICATOR_PLANTS}
            name={`${namespace}.value`}
            component={DecimalField}
            displayValue={plant.value}
            inputProps={{
              ref: valueInputRef
            }}
          />
        </Form.Group>
      </Grid.Column>

      <Grid.Column mobile="1" verticalAlign="middle">
        {!Number.isInteger(plant.id) && (
          <IfEditable permission={STUBBLE_HEIGHT.INDICATOR_PLANTS}>
            <Dropdown
              trigger={<Icon name="ellipsis vertical" />}
              options={[
                {
                  key: 'delete',
                  value: 'delete',
                  text: 'Delete'
                }
              ]}
              style={{ display: 'flex', alignItems: 'center' }}
              icon={null}
              pointing="right"
              onClick={e => e.stopPropagation()}
              onChange={(e, { value }) => {
                if (value === 'delete') {
                  onDelete()
                }
              }}
              selectOnBlur={false}
            />
          </IfEditable>
        )}
      </Grid.Column>
    </Grid>
  )
}

export default IndicatorPlant
