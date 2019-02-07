import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { NOT_PROVIDED, ACTION_NOTE } from '../../../constants/strings';
import { REFERENCE_KEY } from '../../../constants/variables';

class MinisterIssueActions extends Component {
  static propTypes = {
    ministerIssueActions: PropTypes.arrayOf(PropTypes.object).isRequired,
    references: PropTypes.shape({}).isRequired,
  };

  renderMinisterIssueAction = (ministerIssueAction) => {
    const { id, detail, actionTypeId, other } = ministerIssueAction;
    const miActionTypes = this.props.references[REFERENCE_KEY.MINISTER_ISSUE_ACTION_TYPE] || [];
    const otherActionType = miActionTypes.find(t => t.name === 'Other');
    const miActionType = miActionTypes.find(t => t.id === actionTypeId);
    const miActionTypeName = miActionType && miActionType.name;
    const isOtherType = otherActionType && (actionTypeId === otherActionType.id);

    return (
      <div className="rup__missue__action" key={id}>
        <div className="rup__missue__action__type">
          {miActionTypeName}
          {isOtherType &&
            ` - ${other}`
          }
        </div>
        <div className="rup__missue__action__detail">{detail}</div>
      </div>
    );
  }

  render() {
    const { ministerIssueActions } = this.props;

    if (ministerIssueActions.length === 0) {
      return (
        <div className="rup__missue__action__not-found">{NOT_PROVIDED}</div>
      );
    }

    return (
      <Fragment>
        {ministerIssueActions.map(this.renderMinisterIssueAction)}
        <div className="rup__missue__action__note">{ACTION_NOTE}</div>
      </Fragment>
    );
  }
}

export default MinisterIssueActions;
