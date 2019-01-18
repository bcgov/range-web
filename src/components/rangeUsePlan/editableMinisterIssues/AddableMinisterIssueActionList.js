import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import uuid from 'uuid-v4';
import { Button, Icon, Dropdown } from 'semantic-ui-react';
import { ACTION_NOTE } from '../../../constants/strings';
import EditableMinisterIssueActionBox from './EditableMinisterIssueActionBox';
import { updateMinisterIssue, openInputModal, closeConfirmationModal, openConfirmationModal } from '../../../actions';
import { deleteRUPMinisterIssueAction } from '../../../actionCreators';
import { REFERENCE_KEY } from '../../../constants/variables';

class AddableMinisterIssueActionList extends Component {
  static propTypes = {
    ministerIssue: PropTypes.shape({
      ministerIssueActions: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,
    references: PropTypes.shape({}).isRequired,
    updateMinisterIssue: PropTypes.func.isRequired,
    openInputModal: PropTypes.func.isRequired,
  };

  renderMinisterIssueAction = (action, actionIndex) => {
    const { id, key } = action;

    return (
      <EditableMinisterIssueActionBox
        key={id || key}
        action={action}
        actionIndex={actionIndex}
        handleActionChange={this.handleMIActionChange}
        handleActionDelete={this.handleMIActionDelete}
        {...this.props}
      />
    );
  }

  handleMIActionChange = (action, actionIndex) => {
    const { ministerIssue: mi, updateMinisterIssue } = this.props;
    const ministerIssue = { ...mi };
    ministerIssue.ministerIssueActions[actionIndex] = action;

    updateMinisterIssue({ ministerIssue });
  }

  handleMIActionDelete = (actionIndex) => {
    const {
      ministerIssue: mi,
      updateMinisterIssue,
      deleteRUPMinisterIssueAction,
    } = this.props;
    const ministerIssue = { ...mi };
    const [deletedAction] = ministerIssue.ministerIssueActions.splice(actionIndex, 1);
    const planId = ministerIssue && ministerIssue.planId;
    const issueId = ministerIssue && ministerIssue.id;
    const actionId = deletedAction && deletedAction.id;
    const onDeleted = () => {
      updateMinisterIssue({ ministerIssue });
    };

    // delete the action saved in server
    if (planId && issueId && actionId && !uuid.isUUID(actionId)) {
      deleteRUPMinisterIssueAction(planId, issueId, actionId).then(onDeleted);
    } else { // or delete the action saved only in Redux
      onDeleted();
    }
  }

  onActionTypeOptionClicked = (e, { value: actionTypeId }) => {
    const { ministerIssue: mi, updateMinisterIssue } = this.props;
    const ministerIssue = { ...mi };
    const action = {
      key: uuid(),
      detail: '',
      actionTypeId,
    };
    ministerIssue.ministerIssueActions.push(action);
    updateMinisterIssue({ ministerIssue });

    this.openInputModalWhenOtherTypeSelected(actionTypeId);
  }

  openInputModalWhenOtherTypeSelected = (actionTypeId) => {
    const { openInputModal, references } = this.props;
    const actionTypes = references[REFERENCE_KEY.MINISTER_ISSUE_ACTION_TYPE] || [];
    const otherActionType = actionTypes.find(t => t.name === 'Other');

    // open a modal when the option 'other' is selected
    if (otherActionType && (actionTypeId === otherActionType.id)) {
      openInputModal({
        id: 'minister_issue_action_other',
        title: 'Other Name',
        onSubmit: this.onOtherSubmited,
      });
    }
  }

  render() {
    const { ministerIssue, references } = this.props;
    const ministerIssueActions = (ministerIssue && ministerIssue.ministerIssueActions) || [];
    const actionTypes = references[REFERENCE_KEY.MINISTER_ISSUE_ACTION_TYPE] || [];
    const actionTypeOptions = actionTypes.map((miat) => {
      return {
        key: miat.id,
        value: miat.id,
        text: miat.name,
      };
    });

    return (
      <Fragment>
        {ministerIssueActions.length === 0 &&
          <div className="rup__missue__action__not-found">No actions</div>
        }

        {ministerIssueActions.length > 0 &&
          ministerIssueActions.map(this.renderMinisterIssueAction)
        }

        <div className="rup__missue__action__note">{ACTION_NOTE}</div>

        <Dropdown
          trigger={
            <Button
              primary
              style={{ marginTop: '10px' }}
            >
              <Icon name="add circle" />
              Add Action
            </Button>
          }
          options={actionTypeOptions}
          icon={null}
          pointing="left"
          onChange={this.onActionTypeOptionClicked}
        />
      </Fragment>
    );
  }
}

export default connect(null, {
  updateMinisterIssue,
  openInputModal,
  closeConfirmationModal,
  openConfirmationModal,
  deleteRUPMinisterIssueAction,
})(AddableMinisterIssueActionList);
