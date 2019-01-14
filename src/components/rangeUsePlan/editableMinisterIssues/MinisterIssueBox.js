import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import { TextField, CollapsibleBox } from '../../common';
import { REFERENCE_KEY } from '../../../constants/variables';
import { getPastureNames } from '../../../utils';
import AddableMinisterIssueActionList from './AddableMinisterIssueActionList';

class MinisterIssueBox extends Component {
  static propTypes = {
    ministerIssue: PropTypes.shape({}).isRequired,
    ministerIssueIndex: PropTypes.number.isRequired,
    activeMinisterIssueIndex: PropTypes.number.isRequired,
    pasturesMap: PropTypes.shape({}).isRequired,
    ministerIssuesMap: PropTypes.shape({}).isRequired,
    references: PropTypes.shape({}).isRequired,
    onMinisterIssueClicked: PropTypes.func.isRequired,
    updateMinisterIssue: PropTypes.func.isRequired,
  };

  render() {
    const {
      pasturesMap,
      references,
      ministerIssue,
      ministerIssueIndex,
      activeMinisterIssueIndex,
      onMinisterIssueClicked,
      updateMinisterIssue,
    } = this.props;

    const {
      id,
      detail,
      identified,
      issueTypeId,
      objective,
      pastures: pastureIds,
    } = ministerIssue || {};

    const miTypes = references[REFERENCE_KEY.MINISTER_ISSUE_TYPE] || [];
    const ministerIssueType = miTypes.find(i => i.id === issueTypeId);
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
            {identified
              ? <Icon name="check circle" color="green" />
              : <Icon name="remove circle" color="red" />
            }
          </div>
        }
        collapsibleContent={
          <Fragment>
            <TextField
              label="Details"
              text={detail}
            />
            <TextField
              label="Objective"
              text={objective}
            />
            <TextField
              label="Pastures"
              text={pastureNames}
            />

            <div className="rup__missue__actions__title">Actions</div>
            <AddableMinisterIssueActionList
              ministerIssue={ministerIssue}
              references={references}
              updateMinisterIssue={updateMinisterIssue}
            />
          </Fragment>
        }
      />
    );
  }
}

export default MinisterIssueBox;
