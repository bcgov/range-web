import React, { useState } from 'react';
import uuid from 'uuid-v4';
import MinisterIssueBox from './MinisterIssueBox';
import { FieldArray } from 'formik';
import { InfoTip } from '../../common';
import { IfEditable } from '../../common/PermissionsField';
import { MINISTERS_ISSUES_AND_ACTIONS, MINISTERS_ISSUES_AND_ACTIONS_TIP } from '../../../constants/strings';
import { MINISTER_ISSUES } from '../../../constants/fields';
import AddMinisterIssueButton from './AddMinisterIssueButton';
import { Confirm } from 'semantic-ui-react';
import { deleteMinisterIssue } from '../../../api';

const MinisterIssues = ({ issues }) => {
  const [activeMinisterIssue, setActiveMinisterIssue] = useState(issues[0] ? issues[0].id : -1);
  const [indexToRemove, setIndexToRemove] = useState(null);

  return (
    <FieldArray
      name={'ministerIssues'}
      validateOnChange={false}
      render={({ push, remove }) => (
        <div className="rup__missues">
          <div className="rup__content-title--editable">
            <div className="rup__popup-header">
              <div className="rup__content-title">{MINISTERS_ISSUES_AND_ACTIONS}</div>
              <InfoTip header={MINISTERS_ISSUES_AND_ACTIONS} content={MINISTERS_ISSUES_AND_ACTIONS_TIP} />
            </div>
            <IfEditable permission={MINISTER_ISSUES.TYPE}>
              <AddMinisterIssueButton
                onSubmit={(ministerIssue) => {
                  push({
                    issueTypeId: ministerIssue.id,
                    detail: '',
                    objective: '',
                    identified: false,
                    pastures: [],
                    ministerIssueActions: [],
                    id: uuid(),
                  });
                }}
              />
            </IfEditable>
          </div>
          <div className="rup__divider" />

          <Confirm
            open={indexToRemove !== null}
            onCancel={() => {
              setIndexToRemove(null);
            }}
            onConfirm={async () => {
              const issue = issues[indexToRemove];

              if (!uuid.isUUID(issue.id)) {
                await deleteMinisterIssue(issue.planId, issue.id);
              }

              remove(indexToRemove);
              setIndexToRemove(null);
            }}
          />

          {issues.length > 0 ? (
            <ul className="collaspible-boxes">
              {issues.map((issue, index) => (
                <MinisterIssueBox
                  key={issue.id}
                  issue={issue}
                  ministerIssueIndex={index}
                  activeMinisterIssueIndex={activeMinisterIssue}
                  onMinisterIssueClicked={(index) => () =>
                    setActiveMinisterIssue(index === activeMinisterIssue ? -1 : index)
                  }
                  namespace={`ministerIssues.${index}`}
                  onDelete={() => setIndexToRemove(index)}
                />
              ))}
            </ul>
          ) : (
            <div className="rup__section-not-found">None identified.</div>
          )}
        </div>
      )}
    />
  );
};

export default MinisterIssues;
