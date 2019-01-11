import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid-v4';
import { Button, Icon } from 'semantic-ui-react';
import { NOT_PROVIDED, ACTION_NOTE } from '../../../constants/strings';
import { REFERENCE_KEY } from '../../../constants/variables';

class EditableMinisterIssueActions extends Component {
  static propTypes = {
    ministerIssue: PropTypes.shape({
      ministerIssueActions: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,
    references: PropTypes.shape({}).isRequired,
  };

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

  onAddActionBtnClicked = () => {
    // const { schedule, updateGrazingSchedule } = this.props;
    // const grazingSchedule = { ...schedule };
    const action = {
      key: uuid(),
      detail: '',
      actionTypeId: null,
    };
    // grazingSchedule.grazingScheduleEntries.push(entry);
    // updateGrazingSchedule({ grazingSchedule });
  }

  render() {
    const { ministerIssue } = this.props;
    const ministerIssueActions = (ministerIssue && ministerIssue.ministerIssueActions) || [];

    if (ministerIssueActions.length === 0) {
      return (
        <div className="rup__missue__action__not-found">{NOT_PROVIDED}</div>
      );
    }

    return (
      <Fragment>
        <div className="rup__missue__action__note">{ACTION_NOTE}</div>
        {ministerIssueActions.map(this.renderMinisterIssueAction)}
        <Button primary onClick={this.onAddActionBtnClicked}>
          <Icon name="add circle" />
          Add Action
        </Button>
      </Fragment>
    );
  }
}

export default EditableMinisterIssueActions;
