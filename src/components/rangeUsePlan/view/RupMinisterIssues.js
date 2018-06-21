import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Icon } from 'semantic-ui-react';
import { TextField } from '../../common';
import { NOT_PROVIDED } from '../../../constants/strings';

const propTypes = {
  plan: PropTypes.shape({}).isRequired,
  className: PropTypes.string.isRequired,
  ministerIssueTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  ministerIssueActionTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

class RupMinisterIssues extends Component {
  state = {
    activeMinisterIssueIndex: 0,
  }

  onMinisterIssueClicked = ministerIssueIndex => () => {
    const newIndex = this.state.activeMinisterIssueIndex
      === ministerIssueIndex ? -1 : ministerIssueIndex;
    this.setState({ activeMinisterIssueIndex: newIndex });
  }

  renderMinisterIssues = (ministerIssues = []) => (
    ministerIssues.length === 0 ? (
      <div className="rup__section-not-found">{NOT_PROVIDED}</div>
    ) : (
      ministerIssues.map(this.renderMinisterIssue)
    )
  )

  renderMinisterIssueActions = (ministerIssueActions = []) => (
    ministerIssueActions.length === 0 ? (
      <div className="rup__section-not-found">{NOT_PROVIDED}</div>
    ) : (
      ministerIssueActions.map(this.renderMinisterIssueAction)
    )
  );

  renderMinisterIssueAction = (ministerIssueAction) => {
    const { id, detail, actionTypeId } = ministerIssueAction;
    const ministerIssueActionType = this.props.ministerIssueActionTypes
      .find(t => t.id === actionTypeId);
    const ministerIssueActionTypeName = ministerIssueActionType && ministerIssueActionType.name;

    return (
      <div className="rup__missue__action" key={id}>
        <div className="rup__missue__action__type">{ministerIssueActionTypeName}</div>
        <div className="rup__missue__action__detail">{detail}</div>
      </div>
    );
  }

  renderMinisterIssue = (ministerIssue, ministerIssueIndex) => {
    const { plan, ministerIssueTypes } = this.props;
    const pastures = plan && plan.pastures;
    const {
      id,
      detail,
      identified,
      description,
      ministerIssueActions,
      issueTypeId,
      objective,
      pastures: pastureIds,
    } = ministerIssue || {};
    const ministerIssueType = ministerIssueTypes.find(i => i.id === issueTypeId);
    const ministerIssueTypeName = ministerIssueType && ministerIssueType.name;
    const isThisActive = this.state.activeMinisterIssueIndex === ministerIssueIndex;
    const pastureNames = pastureIds.map((pId) => {
      const pasture = pastures.find(p => p.id === pId);
      return pasture.name;
    });
    const listOfPastures = pastureNames.length
      ? pastureNames.join(', ') : NOT_PROVIDED;

    return (
      <li key={id} className="rup__missue">
        <div className="rup__missue__header">
          <button
            className="rup__missue__header__title"
            onClick={this.onMinisterIssueClicked(ministerIssueIndex)}
          >
            <div>
              <Icon name="exclamation triangle" style={{ marginRight: '10px' }} />
              Issue Type: {ministerIssueTypeName}
            </div>
            <div className="rup__missue__header__right">
              <div className="rup__missue__header__identified">
                {/* Identified: {identified ? 'Yes' : 'No'} */}
                Identified: {identified
                ? <Icon name="check circle outline" color="green" />
                : <Icon name="times circle outline" color="red" />}
              </div>
              {isThisActive &&
                <Icon name="chevron up" />
              }
              {!isThisActive &&
                <Icon name="chevron down" />
              }
            </div>
          </button>
        </div>
        <div className={classnames('rup__missue__content', { 'rup__missue__content__hidden': !isThisActive })} >
          <TextField
            label="Description"
            text={description}
          />
          <TextField
            label="Details"
            text={detail}
          />
          <TextField
            label="Pastures"
            text={listOfPastures}
          />
          <TextField
            label="Objective"
            text={objective}
          />
          <div className="rup__missue__actions__title">Actions</div>
          {this.renderMinisterIssueActions(ministerIssueActions)}
        </div>
      </li>
    );
  }

  render() {
    const { plan, className } = this.props;
    const ministerIssues = (plan && plan.ministerIssues) || [];

    return (
      <div className={className}>
        <div className="rup__title">Minister&apos;s Issues and Actions</div>
        <div className="rup__divider" />
        <div className="rup__missues__note">
          Note: Any action that would result in a range development cannot
          be conducted until an authorization (separate to this RUP) is obtained.
        </div>
        <ul className={classnames('rup__missues', { 'rup__missues--empty': ministerIssues.length === 0 })}>
          {this.renderMinisterIssues(ministerIssues)}
        </ul>
      </div>
    );
  }
}

RupMinisterIssues.propTypes = propTypes;
export default RupMinisterIssues;
