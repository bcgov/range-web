import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { NOT_PROVIDED, ACTION_NOTE } from '../../../constants/strings';
import { REFERENCE_KEY } from '../../../constants/variables';
import { formatDateFromServer, handleNullValue, createDateWithMoment } from '../../../utils';

class MinisterIssueActions extends Component {
  static propTypes = {
    ministerIssueActions: PropTypes.arrayOf(PropTypes.object).isRequired,
    references: PropTypes.shape({}).isRequired,
  };

  renderMinisterIssueAction = (ministerIssueAction) => {
    const {
      id,
      detail,
      actionTypeId,
      other,
      noGrazeEndDay: ngEndDay,
      noGrazeEndMonth: ngEndMonth,
      noGrazeStartDay: ngStartDay,
      noGrazeStartMonth: ngStartMonth,
    } = ministerIssueAction;
    const miActionTypes = this.props.references[REFERENCE_KEY.MINISTER_ISSUE_ACTION_TYPE] || [];
    const otherActionType = miActionTypes.find(t => t.name === 'Other');
    const miActionType = miActionTypes.find(t => t.id === actionTypeId);
    const miActionTypeName = miActionType && miActionType.name;
    const isOtherType = otherActionType && (actionTypeId === otherActionType.id);
    const timingActionType = miActionTypes.find(type => type.name === 'Timing');
    const isActionTypeTiming = timingActionType && (actionTypeId === timingActionType.id);
    const noGrazeStartDate = createDateWithMoment(ngStartDay, ngStartMonth);
    const noGrazeEndDate = createDateWithMoment(ngEndDay, ngEndMonth);
    const formatedNoGrazeStartDate = formatDateFromServer(noGrazeStartDate, false);
    const formatedNoGrazeEndDate = formatDateFromServer(noGrazeEndDate, false);

    return (
      <div className="rup__missue__action" key={id}>
        <span className="rup__missue__action__type">
          {miActionTypeName}
          {isOtherType &&
            ` (${other})`
          }
        </span>
        <span>
          {isActionTypeTiming &&
            ' - No Graze Period'
            + ` (${formatedNoGrazeStartDate} - ${formatedNoGrazeEndDate})`
          }
        </span>
        <div className="rup__missue__action__detail">
          {handleNullValue(detail)}
        </div>
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
