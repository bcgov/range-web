import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Icon, Dropdown } from 'semantic-ui-react';
import { TextField } from '../../common';
import {
  NOT_PROVIDED,
} from '../../../constants/strings';

const propTypes = {
  plan: PropTypes.shape({}).isRequired,
  className: PropTypes.string.isRequired,
  ministerIssueTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
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
  renderMinisterIssues = (ministerIssues) => {
    return (
      ministerIssues.length === 0 ? (
        <div className="rup__section-not-found">{NOT_PROVIDED}</div>
      ) : (
        ministerIssues.map(this.renderMinisterIssue)
      )
    );
  }
  renderMinisterIssue = (ministerIssue, ministerIssueIndex) => {
    const {
      id,
      detail,
      identified,
      ministerIssueActions,
      issueTypeId,
      objective,
      pastures: pastureIds,
    } = ministerIssue || {};
    const ministerIssueType = this.props.ministerIssueTypes.find(i => i.id === issueTypeId);
    const ministerIssueTypeName = ministerIssueType && ministerIssueType.name;
    const isThisActive = this.state.activeMinisterIssueIndex === ministerIssueIndex;

    return (
      <li key={id} className="rup__missue">
        <div className="rup__missue__header">
          <button
            className="rup__missue__header__title"
            onClick={this.onMinisterIssueClicked(ministerIssueIndex)}
          >
            <div>
              <Icon name="exclamation triangle" style={{ marginRight: '5px' }} />
              Issue Type: {ministerIssueTypeName}
            </div>
            {isThisActive &&
              <Icon name="chevron up" />
            }
            {!isThisActive &&
              <Icon name="chevron down" />
            }
          </button>
        </div>
        <div className={classnames('rup__missue__content', { 'rup__missue__content__hidden': !isThisActive })} >
          {detail}
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
