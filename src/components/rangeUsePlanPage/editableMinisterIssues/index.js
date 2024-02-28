import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import MinisterIssueBox from './MinisterIssueBox';

class EditableMinisterIssues extends Component {
  static propTypes = {
    plan: PropTypes.shape({}).isRequired,
    pasturesMap: PropTypes.shape({}).isRequired,
    ministerIssuesMap: PropTypes.shape({}).isRequired,
    references: PropTypes.shape({}).isRequired,
  };

  state = {
    activeMinisterIssueIndex: 0,
  };

  onMinisterIssueClicked = (ministerIssueIndex) => () => {
    this.setState((prevState) => {
      const newIndex =
        prevState.activeMinisterIssueIndex === ministerIssueIndex
          ? -1
          : ministerIssueIndex;
      return {
        activeMinisterIssueIndex: newIndex,
      };
    });
  };

  renderMinisterIssues = (ministerIssues = []) => {
    const isEmpty = ministerIssues.length === 0;
    return isEmpty ? (
      <div className="rup__section-not-found">None identified.</div>
    ) : (
      <ul
        className={classnames('collaspible-boxes', {
          'collaspible-boxes--empty': isEmpty,
        })}
      >
        {ministerIssues.map(this.renderMinisterIssue)}
      </ul>
    );
  };

  renderMinisterIssue = (ministerIssue, ministerIssueIndex) => {
    return (
      <MinisterIssueBox
        key={ministerIssue.id}
        ministerIssue={ministerIssue}
        ministerIssueIndex={ministerIssueIndex}
        activeMinisterIssueIndex={this.state.activeMinisterIssueIndex}
        onMinisterIssueClicked={this.onMinisterIssueClicked}
        {...this.props}
      />
    );
  };

  render() {
    const { plan, ministerIssuesMap } = this.props;
    const ministerIssueIds = plan && plan.ministerIssues;
    const ministerIssues =
      ministerIssueIds && ministerIssueIds.map((id) => ministerIssuesMap[id]);

    return (
      <div className="rup__missues">
        <div className="rup__content-title">
          {"Minister's Issues and Actions"}
        </div>
        <div className="rup__divider" />
        {this.renderMinisterIssues(ministerIssues)}
      </div>
    );
  }
}

export default EditableMinisterIssues;
