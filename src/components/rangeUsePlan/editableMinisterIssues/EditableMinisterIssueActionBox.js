import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextArea, Dropdown, Form } from 'semantic-ui-react';
import { REFERENCE_KEY } from '../../../constants/variables';

class EditableMinisterIssueActionBox extends Component {
  static propTypes = {
    action: PropTypes.shape({}).isRequired,
    actionIndex: PropTypes.number.isRequired,
    references: PropTypes.shape({}).isRequired,
    handleActionChange: PropTypes.func.isRequired,
  };

  onActionFieldChanged = (e, { value, name }) => {
    const { action, actionIndex, handleActionChange } = this.props;
    const newAction = {
      ...action,
      [name]: value,
    };

    handleActionChange(newAction, actionIndex);
  }

  render() {
    const { action, references } = this.props;
    const { detail, actionTypeId } = action;
    const actionTypes = references[REFERENCE_KEY.MINISTER_ISSUE_ACTION_TYPE] || [];
    const actionTypesOption = actionTypes.map(miat => (
      {
        key: miat.id,
        value: miat.id,
        text: miat.name,
      }
    ));

    return (
      <div className="rup__missue__action">
        <Dropdown
          name="actionTypeId"
          options={actionTypesOption}
          value={actionTypeId}
          onChange={this.onActionFieldChanged}
          error={actionTypeId === null}
          search
          selection
          selectOnBlur={false}
        />
        <Form>
          <TextArea
            name="detail"
            rows={2}
            placeholder="Tell us more"
            onChange={this.onActionFieldChanged}
            value={detail}
            style={{ marginTop: '10px' }}
          />
        </Form>
      </div>
    );
  }
}

export default EditableMinisterIssueActionBox;
