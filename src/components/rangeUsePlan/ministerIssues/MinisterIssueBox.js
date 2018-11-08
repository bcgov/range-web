import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Icon } from 'semantic-ui-react';
import { TextField } from '../../common';
import { REFERENCE_KEY } from '../../../constants/variables';
import { getPastureNames } from '../../../utils';
import MinisterIssueActions from './MinisterIssueActions';

class MinisterIssueBox extends Component {
  static propTypes = {
    ministerIssue: PropTypes.shape({}).isRequired,
    ministerIssueIndex: PropTypes.number.isRequired,
    activeMinisterIssueIndex: PropTypes.number.isRequired,
    pasturesMap: PropTypes.shape({}).isRequired,
    ministerIssuesMap: PropTypes.shape({}).isRequired,
    references: PropTypes.shape({}).isRequired,
    onMinisterIssueClicked: PropTypes.func.isRequired,
  };

  render() {
    const {
      pasturesMap,
      references,
      ministerIssue,
      ministerIssueIndex,
      activeMinisterIssueIndex,
      onMinisterIssueClicked,
    } = this.props;

    const {
      id,
      detail,
      identified,
      ministerIssueActions,
      issueTypeId,
      objective,
      pastures: pastureIds,
    } = ministerIssue || {};

    const miTypes = references[REFERENCE_KEY.MINISTER_ISSUE_TYPE] || [];
    const ministerIssueType = miTypes.find(i => i.id === issueTypeId);
    const ministerIssueTypeName = ministerIssueType && ministerIssueType.name;
    const isThisActive = activeMinisterIssueIndex === ministerIssueIndex;
    const pastureNames = getPastureNames(pastureIds, pasturesMap);

    return (
      <li key={id} className="rup__missue">
        <div className="rup__missue__header">
          <button
            className="rup__missue__header__title"
            onClick={onMinisterIssueClicked(ministerIssueIndex)}
          >
            <div>
              <Icon name="exclamation triangle" style={{ marginRight: '10px' }} />
              {`Issue Type: ${ministerIssueTypeName}`}
            </div>
            <div className="rup__missue__header__right">
              <div className="rup__missue__header__identified">
                {'Identified: '}
                {identified
                  ? <Icon name="check circle" color="green" />
                  : <Icon name="remove circle" color="red" />
                }
              </div>
              { isThisActive
                ? <Icon style={{ marginLeft: '10px' }} name="chevron up" />
                : <Icon style={{ marginLeft: '10px' }} name="chevron down" />
              }
            </div>
          </button>
        </div>

        <div className={classnames('rup__missue__content', { 'rup__missue__content__hidden': !isThisActive })}>
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
          <MinisterIssueActions
            ministerIssueActions={ministerIssueActions}
            references={references}
          />
        </div>
      </li>
    );
  }
}

export default MinisterIssueBox;
