import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { NOT_PROVIDED } from '../../../constants/strings';
import MinisterIssueBox from './MinisterIssueBox';

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
