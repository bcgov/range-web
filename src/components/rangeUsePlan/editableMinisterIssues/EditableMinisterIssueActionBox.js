import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, TextArea, Dropdown, Form } from 'semantic-ui-react';
import { REFERENCE_KEY, CONFIRMATION_MODAL_ID } from '../../../constants/variables';

class EditableMinisterIssueActionBox extends Component {
  static propTypes = {
    action: PropTypes.shape({}).isRequired,
    actionIndex: PropTypes.number.isRequired,
    references: PropTypes.shape({}).isRequired,
    openInputModal: PropTypes.func.isRequired,
    openConfirmationModal: PropTypes.func.isRequired,
    closeConfirmationModal: PropTypes.func.isRequired,
    handleActionChange: PropTypes.func.isRequired,
    handleActionDelete: PropTypes.func.isRequired,
  };

  onOtherSubmited = (value) => {
    console.log(value);
  }

  onActionFieldChanged = (e, { value, name }) => {
    const {
      action,
      actionIndex,
      handleActionChange,
      openInputModal,
      references,
    } = this.props;
    const newAction = {
      ...action,
      [name]: value,
    };

    handleActionChange(newAction, actionIndex);

    if (name === 'actionTypeId') {
      const actionTypes = references[REFERENCE_KEY.MINISTER_ISSUE_ACTION_TYPE] || [];
      const otherActionType = actionTypes.find(t => t.name === 'Other');

      // open a modal when the option 'other' is selected
      if (otherActionType && (value === otherActionType.id)) {
        openInputModal({
          id: 'hello',
          title: 'Other',
          onSubmit: this.onOtherSubmited,
        });
      }
    }
  }

  onDeleteActionClicked = () => {
    const { closeConfirmationModal, handleActionDelete, actionIndex } = this.props;
    closeConfirmationModal({ modalId: CONFIRMATION_MODAL_ID.DELETE_MINISTER_ISSUE_ACTION });
    handleActionDelete(actionIndex);
  }

  openDeleteActionConfirmationModal = () => {
    this.props.openConfirmationModal({
      id: CONFIRMATION_MODAL_ID.DELETE_MINISTER_ISSUE_ACTION,
      // header: strings.DELETE_SCHEDULE_FOR_AH_HEADER,
      // content: strings.DELETE_SCHEDULE_FOR_AH_CONTENT,
      onYesBtnClicked: this.onDeleteActionClicked,
    });
  }

  render() {
    const { action, references } = this.props;
    const { detail, actionTypeId } = action;
    const actionTypes = references[REFERENCE_KEY.MINISTER_ISSUE_ACTION_TYPE] || [];
    const actionTypesMap = {};
    const actionTypeOptions = actionTypes.map((miat) => {
      actionTypesMap[miat.id] = miat;

      return {
        key: miat.id,
        value: miat.id,
        text: miat.name,
      };
    });
    const currActionType = actionTypesMap[actionTypeId];
    const detailPlaceholder = currActionType && currActionType.placeholder;
    const ellipsisOptions = [
      { key: 'delete', text: 'Delete', onClick: this.openDeleteActionConfirmationModal },
    ];

    return (
      <div className="rup__missue__action">
        <Dropdown
          name="actionTypeId"
          options={actionTypeOptions}
          value={actionTypeId}
          onChange={this.onActionFieldChanged}
          error={actionTypeId === null}
          selection
          selectOnBlur={false}
        />
        <Form>
          <Form.Group inline>
            <TextArea
              name="detail"
              rows={3}
              placeholder={detailPlaceholder}
              onChange={this.onActionFieldChanged}
              value={detail}
              style={{ marginTop: '10px' }}
            />
            <div className="rup__missue__action__ellipsis-action">
              <Dropdown
                trigger={<Icon name="ellipsis vertical" style={{ margin: '0' }} />}
                options={ellipsisOptions}
                icon={null}
                pointing="right"
                style={{ marginLeft: '9px' }}
              />
            </div>
          </Form.Group>
        </Form>
      </div>
    );
  }
}

export default EditableMinisterIssueActionBox;
