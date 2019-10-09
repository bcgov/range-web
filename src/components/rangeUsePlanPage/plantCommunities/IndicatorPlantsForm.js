import React, { useState } from 'react'
import PropTypes from 'prop-types'
import uuid from 'uuid-v4'
import { NOT_PROVIDED } from '../../../constants/strings'
import PermissionsField, { IfEditable } from '../../common/PermissionsField'
import { STUBBLE_HEIGHT } from '../../../constants/fields'
import { Button, Confirm, Dropdown, Icon } from 'semantic-ui-react'
import { useReferences } from '../../../providers/ReferencesProvider'
import { REFERENCE_KEY } from '../../../constants/variables'
import { Input, Dropdown as FormikDropdown, Form } from 'formik-semantic-ui'
import { FieldArray, connect } from 'formik'

const IndicatorPlantsForm = ({
  indicatorPlants,
  valueLabel,
  valueType,
  criteria,
  namespace,
  formik
}) => {
  const references = useReferences()

  const species = references[REFERENCE_KEY.PLANT_SPECIES] || []

  const options = species.map(species => ({
    key: species.id,
    value: species.id,
    text: species.name
  }))

  const [toRemove, setToRemove] = useState()
  const [removeDialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <div className="rup__plant-community__i-plant__header">
        <div className="rup__plant-community__sh__label">Indicator Plant</div>
        <div className="rup__plant-community__sh__label">{valueLabel}</div>
      </div>

      <FieldArray
        name={`${namespace}.indicatorPlants`}
        render={({ push, remove }) => (
          <>
            {indicatorPlants.length === 0 && (
              <IfEditable invert permission={STUBBLE_HEIGHT.INDICATOR_PLANTS}>
                <div className="rup__plant-community__i-plants__not-provided">
                  {NOT_PROVIDED}
                </div>
              </IfEditable>
            )}

            {indicatorPlants.map(
              (plant, index) =>
                plant.criteria === criteria && (
                  <Form.Group widths="equal" key={plant.id}>
                    <PermissionsField
                      permission={STUBBLE_HEIGHT.INDICATOR_PLANTS}
                      name={`${namespace}.indicatorPlants.${index}.plantSpeciesId`}
                      component={FormikDropdown}
                      placeholder="Indicator Plant"
                      options={options}
                      displayValue={
                        plant.plantSpeciesId
                          ? options.find(o => o.key === plant.plantSpeciesId)
                              .text
                          : ''
                      }
                      inputProps={{
                        onChange: (e, { value }) => {
                          const plantValue = species.find(s => s.id === value)[
                            valueType
                          ]
                          if (plantValue) {
                            formik.setFieldValue(
                              `${namespace}.indicatorPlants.${index}.value`,
                              plantValue
                            )
                          }
                        }
                      }}
                    />

                    <PermissionsField
                      permission={STUBBLE_HEIGHT.INDICATOR_PLANTS}
                      name={`${namespace}.indicatorPlants.${index}.value`}
                      component={Input}
                      displayValue={plant.value}
                      inputProps={{
                        type: 'number'
                      }}
                    />
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
                              setToRemove(index)
                              setDialogOpen(true)
                            }
                          }}
                          selectOnBlur={false}
                        />
                      </IfEditable>
                    )}
                  </Form.Group>
                )
            )}

            <IfEditable permission={STUBBLE_HEIGHT.INDICATOR_PLANTS}>
              <Button
                type="button"
                primary
                onClick={() => {
                  push({
                    plantSpeciesId: null,
                    value: 0,
                    criteria,
                    id: uuid()
                  })
                }}>
                <i className="add circle icon" />
                Add Indicator Plant
              </Button>
            </IfEditable>

            <Confirm
              open={removeDialogOpen}
              onCancel={() => {
                setToRemove()
                setDialogOpen(false)
              }}
              onConfirm={() => {
                setToRemove()
                setDialogOpen(false)
                remove(toRemove)
              }}
            />
          </>
        )}
      />
    </>
  )
}

IndicatorPlantsForm.propTypes = {
  indicatorPlants: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      plantSpeciesId: PropTypes.number.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      criteria: PropTypes.string.isRequired
    })
  ),
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  valueLabel: PropTypes.string.isRequired,
  valueType: PropTypes.string.isRequired,
  criteria: PropTypes.string.isRequired,
  namespace: PropTypes.string.isRequired,
  errors: PropTypes.object
}

export default connect(IndicatorPlantsForm)
