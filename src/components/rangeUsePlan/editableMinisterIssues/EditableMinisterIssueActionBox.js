import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Icon, TextArea, Dropdown, Form } from 'semantic-ui-react';
import { REFERENCE_KEY, CONFIRMATION_MODAL_ID } from '../../../constants/variables';
import { DELETE_MINISTER_ISSUE_ACTION_CONFIRM_CONTENT, DELETE_MINISTER_ISSUE_ACTION_CONFIRM_HEADER } from '../../../constants/strings';

class EditableMinisterIssueActionBox extends Component {
  static propTypes = {
    action: PropTypes.shape({}).isRequired,
    actionIndex: PropTypes.number.isRequired,
    references: PropTypes.shape({}).isRequired,
    openConfirmationModal: PropTypes.func.isRequired,
    closeConfirmationModal: PropTypes.func.isRequired,
    handleActionChange: PropTypes.func.isRequired,
    handleActionDelete: PropTypes.func.isRequired,
  };

  onActionFieldChanged = (e, { name, value }) => {
    const {
      action,
      actionIndex,
      handleActionChange,
      references,
    } = this.props;
    const newAction = {
      ...action,
      [name]: value,
    };

    if (name === 'actionTypeId') {
      const actionTypes = references[REFERENCE_KEY.MINISTER_ISSUE_ACTION_TYPE] || [];
      const otherActionType = actionTypes.find(t => t.name === 'Other');

      if (otherActionType && (value === otherActionType.id)) {
        newAction.other = null;
      }
    }

    handleActionChange(newAction, actionIndex);
  }

  onDeleteActionBtnClicked = () => {
    const { closeConfirmationModal, handleActionDelete, actionIndex } = this.props;
    closeConfirmationModal({ modalId: CONFIRMATION_MODAL_ID.DELETE_MINISTER_ISSUE_ACTION });
    handleActionDelete(actionIndex);
  }

  openDeleteActionConfirmationModal = () => {
    this.props.openConfirmationModal({
      id: CONFIRMATION_MODAL_ID.DELETE_MINISTER_ISSUE_ACTION,
      header: DELETE_MINISTER_ISSUE_ACTION_CONFIRM_HEADER,
      content: DELETE_MINISTER_ISSUE_ACTION_CONFIRM_CONTENT,
      onYesBtnClicked: this.onDeleteActionBtnClicked,
    });
  }

  render() {
    const { action, references } = this.props;
    const { detail, actionTypeId, other } = action;
    const actionTypes = references[REFERENCE_KEY.MINISTER_ISSUE_ACTION_TYPE] || [];
    const actionTypesMap = {};
    const actionTypeOptions = actionTypes.map((at) => {
      actionTypesMap[at.id] = at;

      return {
        key: at.id,
        value: at.id,
        text: at.name,
      };
    });
    const currActionType = actionTypesMap[actionTypeId];
    const detailPlaceholder = currActionType && currActionType.placeholder;
    const ellipsisOptions = [
      { key: 'delete', text: 'Delete', onClick: this.openDeleteActionConfirmationModal },
    ];
    const otherActionType = actionTypes.find(t => t.name === 'Other');
    const isActionTypeOther = otherActionType && (actionTypeId === otherActionType.id);

    return (
      <div className="rup__missue__action">
        <div className="rup__missue__action__dropdown-ellipsis-container">
          <div className="rup__missue__action__type-dropdown">
            <Dropdown
              name="actionTypeId"
              options={actionTypeOptions}
              value={actionTypeId}
              onChange={this.onActionFieldChanged}
              error={actionTypeId === null}
              selection
              selectOnBlur={false}
            />
            {isActionTypeOther &&
              <Input
                name="other"
                icon="edit"
                value={other || ''}
                onChange={this.onActionFieldChanged}
                style={{ marginLeft: '5px' }}
                // label="Name"
              />
            }
          </div>
          <div className="rup__missue__action__ellipsis">
            <Dropdown
              trigger={<Icon name="ellipsis vertical" style={{ margin: '0' }} />}
              options={ellipsisOptions}
              icon={null}
              pointing="right"
              style={{ marginRight: '2px' }}
            />
          </div>
        </div>
        <Form style={{ position: 'relative' }}>
          <TextArea
            name="detail"
            rows={3}
            placeholder={detailPlaceholder}
            onChange={this.onActionFieldChanged}
            value={detail}
            style={{ marginTop: '10px' }}
          />
          <span className="rup__missue__action__detail-asterisk">
            *
          </span>
        </Form>
      </div>
    );
  }
}

export default EditableMinisterIssueActionBox;
