import React from 'react'
import PropTypes from 'prop-types'
import uuid from 'uuid-v4'
import { Icon } from 'semantic-ui-react'
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

const MinisterIssueBox = ({
  issue,
  ministerIssueIndex,
  activeMinisterIssueIndex,
  onMinisterIssueClicked,
  namespace,
  formik
}) => {
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
  return (
    <CollapsibleBox
      contentIndex={ministerIssueIndex}
      activeContentIndex={activeMinisterIssueIndex}
      onContentClicked={onMinisterIssueClicked}
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
            displayValue={types.find(t => t.id === issueTypeId).name}
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
          />
          <PermissionsField
            name={`${namespace}.pastures`}
            permission={MINISTER_ISSUES.PASTURES}
            component={Dropdown}
            options={pasturesOptions}
            displayValue={oxfordComma(
              pastures.map(
                purpose => allPastures.find(p => p.id === purpose).name
              )
            )}
            label="Pastures"
            inputProps={{
              multiple: true,
              search: true
            }}
          />
          <PermissionsField
            permission={MINISTER_ISSUES.DETAIL}
            name={`${namespace}.detail`}
            label="Details"
            component={TextArea}
            displayValue={detail}
          />
          <PermissionsField
            permission={MINISTER_ISSUES.OBJECTIVE}
            name={`${namespace}.objective`}
            label="Objective"
            component={TextArea}
            displayValue={objective}
          />

          <FieldArray
            name={`${namespace}.ministerIssueActions`}
            render={({ push }) => (
              <>
                <div className="text-field__label">Actions</div>

                <IfEditable permission={MINISTER_ISSUES.ACTIONS.NAME}>
                  <AddMinisterIssueActionButton
                    onSubmit={action =>
                      push({
                        actionTypeId: action.id,
                        detail: '',
                        other: action,
                        noGrazeEndDate: new Date(),
                        noGrazeStartDate: new Date(),
                        id: uuid()
                      })
                    }
                  />
                </IfEditable>
                {ministerIssueActions.map((action, i) => (
                  <MinisterIssueAction
                    key={action.id}
                    namespace={`${namespace}.ministerIssueActions.${i}`}
                    {...action}
                  />
                ))}
                <div className="text-field__text">
                  {ministerIssueActions.length === 0
                    ? NOT_PROVIDED
                    : ACTION_NOTE}
                </div>
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
