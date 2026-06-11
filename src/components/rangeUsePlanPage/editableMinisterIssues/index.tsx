import React, { useState } from 'react';
import classnames from 'classnames';
import MinisterIssueBox from './MinisterIssueBox';

interface EditableMinisterIssuesProps {
  plan: any;
  pasturesMap: any;
  ministerIssuesMap: any;
  references: any;
}

const EditableMinisterIssues = ({ plan, pasturesMap, ministerIssuesMap, references }: EditableMinisterIssuesProps) => {
  const [activeMinisterIssueIndex, setActiveMinisterIssueIndex] = useState(0);

  const onMinisterIssueClicked = (ministerIssueIndex: number) => () => {
    setActiveMinisterIssueIndex((prev) => {
      return prev === ministerIssueIndex ? -1 : ministerIssueIndex;
    });
  };

  const renderMinisterIssues = (ministerIssues: any[] = []) => {
    const isEmpty = ministerIssues.length === 0;
    return isEmpty ? (
      <div className="rup__section-not-found">None identified.</div>
    ) : (
      <ul
        className={classnames('collaspible-boxes', {
          'collaspible-boxes--empty': isEmpty,
        })}
      >
        {ministerIssues.map((ministerIssue: any, ministerIssueIndex: number) => (
          <MinisterIssueBox
            key={ministerIssue.id}
            ministerIssue={ministerIssue}
            ministerIssueIndex={ministerIssueIndex}
            activeMinisterIssueIndex={activeMinisterIssueIndex}
            onMinisterIssueClicked={onMinisterIssueClicked}
            pasturesMap={pasturesMap}
            references={references}
          />
        ))}
      </ul>
    );
  };

  const ministerIssueIds = plan && plan.ministerIssues;
  const ministerIssues = ministerIssueIds && ministerIssueIds.map((id: any) => ministerIssuesMap[id]);

  return (
    <div className="rup__missues">
      <div className="rup__content-title">{"Minister's Issues and Actions"}</div>
      <div className="rup__divider" />
      {renderMinisterIssues(ministerIssues)}
    </div>
  );
};

export default EditableMinisterIssues;
