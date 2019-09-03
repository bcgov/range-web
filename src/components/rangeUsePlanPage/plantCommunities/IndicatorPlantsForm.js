import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { NOT_PROVIDED } from '../../../constants/strings'
import PermissionsField, { IfEditable } from '../../common/PermissionsField'
import { STUBBLE_HEIGHT } from '../../../constants/fields'
import { Button, Confirm, Dropdown, Icon } from 'semantic-ui-react'
import { useReferences } from '../../../providers/ReferencesProvider'
import { REFERENCE_KEY } from '../../../constants/variables'
import { Input, Dropdown as FormikDropdown, Form } from 'formik-semantic-ui'
import { FieldArray, getIn } from 'formik'
import Effect from '../../common/form/Effect'
import * as Yup from 'yup'

const IndicatorPlantsSchema = Yup.object().shape({
  indicatorPlants: Yup.array().of(
    Yup.object().shape({
      value: Yup.number()
        .positive('Please choose a number greater than 0')
        .required('Value required!'),
      plantSpeciesId: Yup.number()
        .moreThan(0, 'Please select a species')
        .required('Please select a species')
    })
  )
})

const IndicatorPlantsForm = ({
  indicatorPlants,
  onSubmit,
  onChange,
  valueLabel,
  criteria
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
    <Form
      initialValues={{ indicatorPlants }}
      onSubmit={onSubmit}
      validationSchema={IndicatorPlantsSchema}
      validateOnChange={true}
      render={({ values, errors }) => (
        <>
          <Effect onChange={onChange} />

          <div className="rup__plant-community__i-plant__header">
            <div className="rup__plant-community__sh__label">
              Indicator Plant
            </div>
            <div className="rup__plant-community__sh__label">{valueLabel}</div>
          </div>

          <FieldArray
            name="indicatorPlants"
            render={({ push, remove }) => (
              <>
                {values.indicatorPlants.length === 0 && (
                  <IfEditable
                    invert
                    permission={STUBBLE_HEIGHT.INDICATOR_PLANTS}>
                    <div className="rup__plant-community__i-plants__not-provided">
                      {NOT_PROVIDED}
                    </div>
                  </IfEditable>
                )}

                {values.indicatorPlants.map((plant, index) => (
                  <Form.Group widths="equal" key={plant.id}>
                    <PermissionsField
                      permission={STUBBLE_HEIGHT.INDICATOR_PLANTS}
                      name={`indicatorPlants.${index}.plantSpeciesId`}
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
                        error: !!getIn(
                          errors,
                          `indicatorPlants.${index}.plantSpeciesId`
                        )
                      }}
                    />

                    <PermissionsField
                      permission={STUBBLE_HEIGHT.INDICATOR_PLANTS}
                      name={`indicatorPlants.${index}.value`}
                      component={Input}
                      placeholder="Height"
                      displayValue={plant.value}
                      inputProps={{
                        type: 'number'
                      }}
                    />

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
                  </Form.Group>
                ))}

                <IfEditable permission={STUBBLE_HEIGHT.INDICATOR_PLANTS}>
                  <Button
                    type="button"
                    primary
                    onClick={() => {
                      push({
                        plantSpeciesId: 0,
                        value: 0,
                        criteria
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
      )}
    />
  )
}

IndicatorPlantsForm.propTypes = {
  indicatorPlants: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      plantSpeciesId: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired,
      criteria: PropTypes.string.isRequired
    })
  ),
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  valueLabel: PropTypes.string.isRequired,
  criteria: PropTypes.string.isRequired
}

export default IndicatorPlantsForm
