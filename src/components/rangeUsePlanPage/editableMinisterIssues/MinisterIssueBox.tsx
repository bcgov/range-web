import React, { Fragment } from 'react';
import { Icon } from 'semantic-ui-react';
import { TextField, CollapsibleBox } from '../../common';
import { REFERENCE_KEY } from '../../../constants/variables';
import { getPastureNames } from '../../../utils';
import AddableMinisterIssueActionList from './AddableMinisterIssueActionList';

interface MinisterIssueBoxProps {
  ministerIssue: any;
  ministerIssueIndex: number;
  activeMinisterIssueIndex: number;
  pasturesMap: any;
  references: any;
  onMinisterIssueClicked: (index: number) => () => void;
}

const MinisterIssueBox = ({
  pasturesMap,
  references,
  ministerIssue,
  ministerIssueIndex,
  activeMinisterIssueIndex,
  onMinisterIssueClicked,
}: MinisterIssueBoxProps) => {
  const { id, detail, identified, issueTypeId, objective, pastures: pastureIds } = ministerIssue || {};

  const miTypes = references[REFERENCE_KEY.MINISTER_ISSUE_TYPE] || [];
  const ministerIssueType = miTypes.find((i: any) => i.id === issueTypeId);
  const ministerIssueTypeName = ministerIssueType && ministerIssueType.name;
  const pastureNames = getPastureNames(pastureIds, pasturesMap);

  return (
    <CollapsibleBox
      key={id}
      contentIndex={ministerIssueIndex}
      activeContentIndex={activeMinisterIssueIndex}
      onContentClicked={onMinisterIssueClicked}
      header={
        <div>
          <Icon name="warning sign" style={{ marginRight: '7px' }} />
          Issue Type: {ministerIssueTypeName}
        </div>
      }
      headerRight={
        <div className="rup__missue__identified">
          {'Identified: '}
          {identified ? <Icon name="check circle" color="green" /> : <Icon name="remove circle" color="red" />}
        </div>
      }
      collapsibleContent={
        <Fragment>
          <TextField label="Details" text={detail} />
          <TextField label="Objective" text={objective} />
          <TextField label="Pastures" text={pastureNames} />

          <div className="rup__missue__actions__title">Actions</div>
          <AddableMinisterIssueActionList ministerIssue={ministerIssue} references={references} />
        </Fragment>
      }
    />
  );
};

export default MinisterIssueBox;
