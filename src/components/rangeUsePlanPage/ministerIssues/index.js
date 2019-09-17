import React, { useState } from 'react'
import uuid from 'uuid-v4'
import MinisterIssueBox from './MinisterIssueBox'
import { FieldArray } from 'formik'
import { IfEditable } from '../../common/PermissionsField'
import { MINISTER_ISSUES } from '../../../constants/fields'
import AddMinisterIssueButton from './AddMinisterIssueButton'

const MinisterIssues = ({ issues }) => {
  const [activeMinisterIssue, setActiveMinisterIssue] = useState(
    issues[0] ? issues[0].id : -1
  )

  return (
    <FieldArray
      name={'ministerIssues'}
      render={({ push }) => (
        <div className="rup__missues">
          <div className="rup__content-title--editable">
            {"Minister's Issues and Actions"}
            <IfEditable permission={MINISTER_ISSUES.TYPE}>
              <AddMinisterIssueButton
                onSubmit={ministerIssue => {
                  push({
                    issueTypeId: ministerIssue.id,
                    detail: '',
                    objective: '',
                    identified: false,
                    pastures: [],
                    actions: [],
                    id: uuid()
                  })
                }}
              />
            </IfEditable>
          </div>
          <div className="rup__divider" />

          {issues.length > 0 ? (
            <ul className="collaspible-boxes">
              {issues.map((issue, index) => (
                <MinisterIssueBox
                  key={issue.id}
                  issue={issue}
                  ministerIssueIndex={issue.id}
                  activeMinisterIssueIndex={activeMinisterIssue}
                  onMinisterIssueClicked={index => () =>
                    setActiveMinisterIssue(
                      index === activeMinisterIssue ? -1 : index
                    )}
                  namespace={`ministerIssues.${index}`}
                />
              ))}
            </ul>
          ) : (
            <div className="rup__section-not-found">None identified.</div>
          )}
        </div>
      )}
    />
  )
}

export default MinisterIssues
