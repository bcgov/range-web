import React, { useState } from 'react'
import PropTypes from 'prop-types'
import uuid from 'uuid-v4'
import { Icon, Confirm } from 'semantic-ui-react'
import { CollapsibleBox } from '../../common'
import { NOT_PROVIDED, ACTION_NOTE } from '../../../constants/strings'
import { oxfordComma } from '../../../utils'
import MinisterIssueAction from './MinisterIssueAction'
import PermissionsField, { IfEditable } from '../../common/PermissionsField'
import { MINISTER_ISSUES } from '../../../constants/fields'
import { Checkbox, Dropdown, TextArea } from 'formik-semantic-ui'
import { connect, getIn, FieldArray } from 'formik'
import { useReferences } from '../../../providers/ReferencesProvider'
import { REFERENCE_KEY } from '../../../constants/variables'
import AddMinisterIssueActionButton from './AddMinisterIssueActionButton'
import moment from 'moment'

const MinisterIssueBox = ({
  issue,
  ministerIssueIndex,
  activeMinisterIssueIndex,
  onMinisterIssueClicked,
  namespace,
  formik
}) => {
  const [toRemove, setToRemove] = useState(null)

  const allPastures = getIn(formik.values, 'pastures') || []
  const pasturesOptions = allPastures.map((pasture, index) => ({
    value: pasture.id,
    text: pasture.name || `Unnamed pasture ${index + 1}`,
    key: pasture.id
  }))

  const types = useReferences()[REFERENCE_KEY.MINISTER_ISSUE_TYPE] || []
  const typeOptions = types.map(type => ({
    key: type.id,
    value: type.id,
    text: type.name,
    id: type.id
  }))

  const {
    detail,
    objective,
    pastures = [],
    identified,
    ministerIssueActions = [],
    issueTypeId
  } = issue
  const isError = !!getIn(formik.errors, namespace)
  return (
    <CollapsibleBox
      contentIndex={ministerIssueIndex}
      activeContentIndex={activeMinisterIssueIndex}
      onContentClicked={onMinisterIssueClicked}
      error={isError}
      header={
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}>
          <Icon name="warning sign" style={{ marginRight: '7px' }} />
          <span style={{ marginRight: 10 }}>Issue Type:</span>
          <PermissionsField
            permission={
              ministerIssueIndex !== activeMinisterIssueIndex
                ? ''
                : MINISTER_ISSUES.TYPE
            }
            name={`${namespace}.issueTypeId`}
            component={Dropdown}
            options={typeOptions}
            displayValue={
              types.find(t => t.id === issueTypeId)
                ? types.find(t => t.id === issueTypeId).name
                : ''
            }
            fast
          />
        </div>
      }
      headerRight={
        <div className="rup__missue__identified">
          {'Identified: '}
          {identified ? (
            <Icon name="check circle" color="green" />
          ) : (
            <Icon name="remove circle" color="red" />
          )}
        </div>
      }
      collapsibleContent={
        <>
          <PermissionsField
            name={`${namespace}.identified`}
            permission={MINISTER_ISSUES.IDENTIFIED}
            component={Checkbox}
            displayValue={identified}
            label="Identified by Minister"
            inputProps={{
              toggle: true
            }}
            fast
          />
          <PermissionsField
            name={`${namespace}.pastures`}
            permission={MINISTER_ISSUES.PASTURES}
            component={Dropdown}
            options={pasturesOptions}
            displayValue={oxfordComma(
              pastures.map(pasture =>
                allPastures.find(p => p.id === pasture)
                  ? allPastures.find(p => p.id === pasture).name
                  : ''
              )
            )}
            label="Pastures"
            inputProps={{
              multiple: true,
              search: true
            }}
            fast
          />
          <PermissionsField
            permission={MINISTER_ISSUES.DETAIL}
            name={`${namespace}.detail`}
            label="Details"
            component={TextArea}
            displayValue={detail}
            fast
          />
          <PermissionsField
            permission={MINISTER_ISSUES.OBJECTIVE}
            name={`${namespace}.objective`}
            label="Objective"
            component={TextArea}
            displayValue={objective}
            fast
          />

          <FieldArray
            name={`${namespace}.ministerIssueActions`}
            render={({ push, remove }) => (
              <>
                <div className="text-field__label" style={{ marginBottom: 10 }}>
                  Actions
                </div>

                <IfEditable permission={MINISTER_ISSUES.ACTIONS.NAME}>
                  <AddMinisterIssueActionButton
                    onSubmit={action =>
                      push({
                        actionTypeId: action.id,
                        detail: '',
                        other: action,
                        noGrazeStartMonth: moment().month() + 1,
                        noGrazeStartDay: moment().date(),
                        noGrazeEndMonth: moment().month() + 1,
                        noGrazeEndDay: moment().date(),
                        id: uuid()
                      })
                    }
                  />
                </IfEditable>
                {ministerIssueActions.map((action, i) => (
                  <MinisterIssueAction
                    key={action.id}
                    namespace={`${namespace}.ministerIssueActions.${i}`}
                    onDelete={() => setToRemove(i)}
                    {...action}
                  />
                ))}
                <div className="text-field__text">
                  {ministerIssueActions.length === 0
                    ? NOT_PROVIDED
                    : ACTION_NOTE}
                </div>
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
              </>
            )}
          />
        </>
      }
    />
  )
}

MinisterIssueBox.propTypes = {
  issue: PropTypes.object.isRequired,
  ministerIssueIndex: PropTypes.number.isRequired,
  activeMinisterIssueIndex: PropTypes.number.isRequired,
  onMinisterIssueClicked: PropTypes.func.isRequired,
  namespace: PropTypes.string.isRequired,
  formik: PropTypes.object.isRequired
}

export default connect(MinisterIssueBox)
