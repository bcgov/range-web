import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { FieldArray, connect } from 'formik'
import uuid from 'uuid-v4'
import {
  Button,
  Form,
  Confirm,
  Icon,
  Dropdown as PlainDropdown,
  Grid
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
            <Grid key={action.id || `action${index}`}>
              <Grid.Column width="4">
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
                    required: true
                  }}
                  inputProps={{
                    allowAdditions: true,
                    search: true,
                    fluid: true,
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

                {actionOptions.find(
                  option => option.value === action.actionTypeId
                ) &&
                  actionOptions.find(
                    option => option.value === action.actionTypeId
                  ).text === 'Other' && (
                    <PermissionsField
                      name={`${namespace}.plantCommunityActions.${index}.name`}
                      permission={PLANT_COMMUNITY.ACTIONS.NAME}
                      displayValue={action.name}
                      label="Other name"
                      fieldProps={{
                        style: { marginTop: '-4px' },
                        required: true
                      }}
                      inputProps={{
                        fluid: true
                      }}
                    />
                  )}
              </Grid.Column>

              <Grid.Column width="11">
                <PermissionsField
                  name={`${namespace}.plantCommunityActions.${index}.details`}
                  permission={PLANT_COMMUNITY.ACTIONS.DETAIL}
                  displayValue={action.details}
                  component={TextArea}
                  label="Details"
                  fieldProps={{
                    required: true
                  }}
                  inputProps={{
                    rows: 5
                  }}
                />

                {actionOptions.find(
                  option => option.value === action.actionTypeId
                ) &&
                  actionOptions.find(
                    option => option.value === action.actionTypeId
                  ).text === 'Timing' && (
                    <Form.Group widths="equal">
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
                        fluid
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
                        fluid
                      />
                    </Form.Group>
                  )}
              </Grid.Column>

              <IfEditable permission={PLANT_COMMUNITY.ACTIONS.NAME}>
                <Grid.Column width="1" verticalAlign="middle">
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
                </Grid.Column>
              </IfEditable>
            </Grid>
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
