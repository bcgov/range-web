import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { FieldArray, connect } from 'formik'
import uuid from 'uuid-v4'
import {
  Button,
  Form,
  Confirm,
  Icon,
  Dropdown as PlainDropdown
} from 'semantic-ui-react'
import { useReferences } from '../../../providers/ReferencesProvider'
import { REFERENCE_KEY } from '../../../constants/variables'
import PermissionsField, { IfEditable } from '../../common/PermissionsField'
import { PLANT_COMMUNITY } from '../../../constants/fields'
import { Dropdown, TextArea } from 'formik-semantic-ui'
import DayMonthPicker from '../../common/form/DayMonthPicker'
import moment from 'moment'

const PlantCommunityActionsBox = ({ actions, namespace }) => {
  const [otherOptions, setOtherOptions] = useState([])
  const [toRemove, setToRemove] = useState(null)

  const references = useReferences()
  const actionTypes = references[REFERENCE_KEY.PLANT_COMMUNITY_ACTION_TYPE]

  const actionOptions = actionTypes
    .map(type => ({
      key: type.id,
      value: type.id,
      text: type.name
    }))
    .concat(otherOptions)

  return (
    <FieldArray
      name={`${namespace}.plantCommunityActions`}
      render={({ push, remove }) => (
        <>
          {actions.map((action, index) => (
            <div key={action.id || `action${index}`}>
              <Form.Group widths="equal">
                <PermissionsField
                  name={`${namespace}.plantCommunityActions.${index}.actionTypeId`}
                  permission={PLANT_COMMUNITY.ACTIONS.NAME}
                  component={Dropdown}
                  options={actionOptions}
                  displayValue={
                    actionOptions.find(
                      option => option.value === action.actionTypeId
                    )
                      ? actionOptions.find(
                          option => option.value === action.actionTypeId
                        ).text
                      : ''
                  }
                  label="Action"
                  fieldProps={{
                    width: 3,
                    required: true
                  }}
                  inputProps={{
                    allowAdditions: true,
                    search: true,
                    onAddItem: (e, { value }) => {
                      setOtherOptions([
                        ...otherOptions,
                        {
                          key: value,
                          value: value,
                          text: value
                        }
                      ])
                    }
                  }}
                />

                <PermissionsField
                  name={`${namespace}.plantCommunityActions.${index}.details`}
                  permission={PLANT_COMMUNITY.ACTIONS.DETAIL}
                  displayValue={action.details}
                  component={TextArea}
                  label="Details"
                  fieldProps={{
                    width: 9,
                    required: true
                  }}
                />

                <IfEditable permission={PLANT_COMMUNITY.ACTIONS.NAME}>
                  <PlainDropdown
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
                      }
                    }}
                    selectOnBlur={false}
                  />
                </IfEditable>
              </Form.Group>
              {actionOptions.find(
                option => option.value === action.actionTypeId
              ) &&
                actionOptions.find(
                  option => option.value === action.actionTypeId
                ).text === 'Timing' && (
                  <Form.Group width="equal">
                    <Form.Field width="5" />
                    <PermissionsField
                      monthName={`${namespace}.plantCommunityActions.${index}.noGrazeStartMonth`}
                      dayName={`${namespace}.plantCommunityActions.${index}.noGrazeStartDay`}
                      permission={PLANT_COMMUNITY.ACTIONS.NO_GRAZING_PERIOD}
                      displayValue={moment(
                        `${action.noGrazeStartMonth} ${action.noGrazeStartDay}`,
                        'MM DD'
                      ).format('MMMM Do')}
                      component={DayMonthPicker}
                      label="No Graze Start"
                    />

                    <PermissionsField
                      monthName={`${namespace}.plantCommunityActions.${index}.noGrazeEndMonth`}
                      dayName={`${namespace}.plantCommunityActions.${index}.noGrazeEndDay`}
                      permission={PLANT_COMMUNITY.ACTIONS.NO_GRAZING_PERIOD}
                      displayValue={moment(
                        `${action.noGrazeEndMonth} ${action.noGrazeEndDay}`,
                        'MM DD'
                      ).format('MMMM Do')}
                      component={DayMonthPicker}
                      label="No Graze End"
                    />
                  </Form.Group>
                )}
            </div>
          ))}
          <Confirm
            open={toRemove !== null}
            onCancel={() => {
              setToRemove(null)
            }}
            onConfirm={() => {
              remove(toRemove)
              setToRemove(null)
            }}
          />
          <Button
            primary
            type="button"
            className="icon labeled rup__plant-communities__add-button"
            onClick={() =>
              push({ actionTypeId: null, details: '', id: uuid() })
            }>
            <i className="add circle icon" />
            Add Action
          </Button>
        </>
      )}
    />
  )
}

PlantCommunityActionsBox.propTypes = {
  actions: PropTypes.array.isRequired,
  namespace: PropTypes.string.isRequired
}

export default connect(PlantCommunityActionsBox)
