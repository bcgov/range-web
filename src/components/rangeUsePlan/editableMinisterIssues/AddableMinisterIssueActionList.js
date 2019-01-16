import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import uuid from 'uuid-v4';
import { Button, Icon } from 'semantic-ui-react';
import { ACTION_NOTE } from '../../../constants/strings';
import EditableMinisterIssueActionBox from './EditableMinisterIssueActionBox';
import { updateMinisterIssue, openInputModal, closeConfirmationModal, openConfirmationModal } from '../../../actions';
import { deleteRUPMinisterIssueAction } from '../../../actionCreators';

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

  onAddActionBtnClicked = () => {
    const { ministerIssue: mi, updateMinisterIssue } = this.props;
    const ministerIssue = { ...mi };
    const action = {
      key: uuid(),
      detail: '',
      actionTypeId: null,
    };
    ministerIssue.ministerIssueActions.push(action);
    updateMinisterIssue({ ministerIssue });
  }

  render() {
    const { ministerIssue } = this.props;
    const ministerIssueActions = (ministerIssue && ministerIssue.ministerIssueActions) || [];

    return (
      <Fragment>
        {ministerIssueActions.length === 0 &&
          <div className="rup__missue__action__not-found">No actions</div>
        }

        {ministerIssueActions.length > 0 &&
          ministerIssueActions.map(this.renderMinisterIssueAction)
        }

        <div className="rup__missue__action__note">{ACTION_NOTE}</div>
        <Button
          primary
          onClick={this.onAddActionBtnClicked}
          style={{ marginTop: '10px' }}
        >
          <Icon name="add circle" />
          Add Action
        </Button>
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
