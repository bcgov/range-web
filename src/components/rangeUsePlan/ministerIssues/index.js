import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Icon } from 'semantic-ui-react';
import { TextField } from '../../common';
import { NOT_PROVIDED, ACTION_NOTE } from '../../../constants/strings';
import { REFERENCE_KEY } from '../../../constants/variables';
import { getPastureNames } from '../../../utils';

class MinisterIssues extends Component {
  static propTypes = {
    elementId: PropTypes.string.isRequired,
    plan: PropTypes.shape({}).isRequired,
    className: PropTypes.string.isRequired,
    pasturesMap: PropTypes.shape({}).isRequired,
    ministerIssuesMap: PropTypes.shape({}).isRequired,
    references: PropTypes.shape({}).isRequired,
  };

  state = {
    activeMinisterIssueIndex: 0,
  }

  onMinisterIssueClicked = ministerIssueIndex => () => {
    this.setState((prevState) => {
      const newIndex = prevState.activeMinisterIssueIndex === ministerIssueIndex ? -1 : ministerIssueIndex;
      return {
        activeMinisterIssueIndex: newIndex,
      };
    });
  }

  renderMinisterIssues = (ministerIssues = []) => (
    ministerIssues.length === 0 ? (
      <div className="rup__section-not-found">{NOT_PROVIDED}</div>
    ) : (
      <ul className={classnames('rup__missues', { 'rup__missues--empty': ministerIssues.length === 0 })}>
        {ministerIssues.map(this.renderMinisterIssue)}
      </ul>
    )
  )

  renderMinisterIssueActions = (ministerIssueActions = []) => (
    ministerIssueActions.length === 0 ? (
      <div className="rup__missue__action__not-found">{NOT_PROVIDED}</div>
    ) : (
      <Fragment>
        <div className="rup__missue__action__note">{ACTION_NOTE}</div>
        {ministerIssueActions.map(this.renderMinisterIssueAction)}
      </Fragment>
    )
  );

  renderMinisterIssueAction = (ministerIssueAction) => {
    const { id, detail, actionTypeId } = ministerIssueAction;
    const miActionTypes = this.props.references[REFERENCE_KEY.MINISTER_ISSUE_ACTION_TYPE] || [];
    const miActionType = miActionTypes.find(t => t.id === actionTypeId);
    const miActionTypeName = miActionType && miActionType.name;

    return (
      <div className="rup__missue__action" key={id}>
        <div className="rup__missue__action__type">{miActionTypeName}</div>
        <div className="rup__missue__action__detail">{detail}</div>
      </div>
    );
  }

  renderMinisterIssue = (ministerIssue, ministerIssueIndex) => {
    const { pasturesMap, references } = this.props;
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
    const isThisActive = this.state.activeMinisterIssueIndex === ministerIssueIndex;
    const pastureNames = getPastureNames(pastureIds, pasturesMap);

    return (
      <li key={id} className="rup__missue">
        <div className="rup__missue__header">
          <button
            className="rup__missue__header__title"
            onClick={this.onMinisterIssueClicked(ministerIssueIndex)}
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
          {this.renderMinisterIssueActions(ministerIssueActions)}
        </div>
      </li>
    );
  }

  render() {
    const { elementId, plan, ministerIssuesMap, className } = this.props;
    const ministerIssueIds = plan && plan.ministerIssues;
    const ministerIssues = ministerIssueIds && ministerIssueIds.map(id => ministerIssuesMap[id]);

    return (
      <div id={elementId} className={className}>
        <div className="rup__content-title">{'Minister\'s Issues and Actions'}</div>
        <div className="rup__divider" />
        {this.renderMinisterIssues(ministerIssues)}
      </div>
    );
  }
}

export default MinisterIssues;
