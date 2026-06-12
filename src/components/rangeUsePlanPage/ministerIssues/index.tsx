import React, { useState } from 'react';
import uuid from 'uuid-v4';
import MinisterIssueBox from './MinisterIssueBox';
import { FieldArray } from 'formik';
import { InfoTip } from '../../common';
import { IfEditable } from '../../common/PermissionsField';
import { MINISTERS_ISSUES_AND_ACTIONS, MINISTERS_ISSUES_AND_ACTIONS_TIP } from '../../../constants/strings';
import { MINISTER_ISSUES } from '../../../constants/fields';
import AddMinisterIssueButton from './AddMinisterIssueButton';
import { deleteMinisterIssue } from '../../../api';
import useConfirm from '../../../providers/ConfrimationModalProvider';

interface MinisterIssuesProps {
  issues: any[];
}

function MinisterIssues({ issues }: MinisterIssuesProps) {
  const [activeMinisterIssue, setActiveMinisterIssue] = useState(issues[0] ? issues[0].id : -1);
  const confirm = useConfirm()!;

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
                onSubmit={(ministerIssue: any) => {
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

          {issues.length > 0 ? (
            <ul className="collaspible-boxes">
              {issues.map((issue: any, index: number) => (
                <MinisterIssueBox
                  key={issue.id}
                  issue={issue}
                  ministerIssueIndex={index}
                  activeMinisterIssueIndex={activeMinisterIssue}
                  onMinisterIssueClicked={(idx: number) => () =>
                    setActiveMinisterIssue(idx === activeMinisterIssue ? -1 : idx)
                  }
                  namespace={`ministerIssues.${index}`}
                  onDelete={async () => {
                    const choice = await confirm({
                      titleText: 'Delete Minister Issue',
                      contentText: 'Are you sure you want to delete this issue?',
                    });
                    if (!choice) return;
                    const iss = issues[index];
                    if (!uuid.isUUID(iss.id)) {
                      await deleteMinisterIssue(iss.planId, iss.id);
                    }
                    remove(index);
                  }}
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
}

export default MinisterIssues;
