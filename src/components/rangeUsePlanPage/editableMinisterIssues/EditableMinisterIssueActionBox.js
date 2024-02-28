import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Pikaday from 'pikaday';
import classnames from 'classnames';
import { Input, Icon, TextArea, Dropdown, Form } from 'semantic-ui-react';
import {
  REFERENCE_KEY,
  CONFIRMATION_MODAL_ID,
  DATE_FORMAT,
} from '../../../constants/variables';
import {
  DELETE_MINISTER_ISSUE_ACTION_CONFIRM_CONTENT,
  DELETE_MINISTER_ISSUE_ACTION_CONFIRM_HEADER,
} from '../../../constants/strings';
import { parseMonthAndDay, createDateWithMoment } from '../../../utils';

class EditableMinisterIssueActionBox extends Component {
  static propTypes = {
    action: PropTypes.shape({}).isRequired,
    actionIndex: PropTypes.number.isRequired,
    references: PropTypes.shape({}).isRequired,
    openConfirmationModal: PropTypes.func.isRequired,
    handleActionChange: PropTypes.func.isRequired,
    handleActionDelete: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { action } = this.props;
    const {
      noGrazeEndDay: ngEndDay,
      noGrazeEndMonth: ngEndMonth,
      noGrazeStartDay: ngStartDay,
      noGrazeStartMonth: ngStartMonth,
    } = action;

    const noGrazeStartDate = createDateWithMoment(ngStartDay, ngStartMonth);
    const noGrazeEndDate = createDateWithMoment(ngEndDay, ngEndMonth);
    const minDate = createDateWithMoment(1, 1);
    const maxDate = createDateWithMoment(31, 12);

    this.pikaDayDateIn = new Pikaday({
      field: this.startDateRef,
      format: DATE_FORMAT.CLIENT_SIDE_WITHOUT_YEAR,
      minDate,
      maxDate: noGrazeEndDate || maxDate,
      defaultDate: noGrazeStartDate || minDate, // the initial date to view when first opened
      setDefaultDate: noGrazeStartDate !== null,
      onSelect: this.handleDateChange('noGrazeStartDate'),
    });

    this.pikaDayDateOut = new Pikaday({
      field: this.endDateRef,
      format: DATE_FORMAT.CLIENT_SIDE_WITHOUT_YEAR,
      minDate: noGrazeStartDate || minDate,
      maxDate,
      defaultDate: noGrazeEndDate || minDate,
      setDefaultDate: noGrazeEndDate !== null,
      onSelect: this.handleDateChange('noGrazeEndDate'),
    });
  }

  handleDateChange = (key) => (date) => {
    const { action, actionIndex, handleActionChange } = this.props;
    const newAction = {
      ...action,
    };

    if (this.pikaDayDateIn && key === 'noGrazeEndDate') {
      // needs to save the month and day separately as integers
      const { month: noGrazeEndMonth, day: noGrazeEndDay } =
        parseMonthAndDay(date);
      newAction.noGrazeEndMonth = noGrazeEndMonth;
      newAction.noGrazeEndDay = noGrazeEndDay;

      this.pikaDayDateIn.setMaxDate(date);
    } else if (this.pikaDayDateOut && key === 'noGrazeStartDate') {
      const { month: noGrazeStartMonth, day: noGrazeStartDay } =
        parseMonthAndDay(date);
      newAction.noGrazeStartMonth = noGrazeStartMonth;
      newAction.noGrazeStartDay = noGrazeStartDay;

      this.pikaDayDateOut.setMinDate(date);
    }

    handleActionChange(newAction, actionIndex);
  };

  onActionFieldChanged = (e, { name, value }) => {
    const { action, actionIndex, handleActionChange, references } = this.props;
    const newAction = {
      ...action,
      [name]: value,
    };

    if (name === 'actionTypeId') {
      const actionTypes =
        references[REFERENCE_KEY.MINISTER_ISSUE_ACTION_TYPE] || [];
      const otherActionType = actionTypes.find((t) => t.name === 'Other');

      if (otherActionType && value === otherActionType.id) {
        newAction.other = null;
      }
    }

    handleActionChange(newAction, actionIndex);
  };

  onDeleteActionBtnClicked = () => {
    const { handleActionDelete, actionIndex } = this.props;
    handleActionDelete(actionIndex);
  };

  openDeleteActionConfirmationModal = () => {
    this.props.openConfirmationModal({
      id: CONFIRMATION_MODAL_ID.DELETE_MINISTER_ISSUE_ACTION,
      header: DELETE_MINISTER_ISSUE_ACTION_CONFIRM_HEADER,
      content: DELETE_MINISTER_ISSUE_ACTION_CONFIRM_CONTENT,
      onYesBtnClicked: this.onDeleteActionBtnClicked,
      closeAfterYesBtnClicked: true,
    });
  };

  setStartDateRef = (ref) => {
    this.startDateRef = ref;
  };
  setEndDateRef = (ref) => {
    this.endDateRef = ref;
  };

  render() {
    const { action, references } = this.props;
    const { detail, actionTypeId, other } = action;
    const actionTypes =
      references[REFERENCE_KEY.MINISTER_ISSUE_ACTION_TYPE] || [];
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
      {
        key: 'delete',
        text: 'Delete',
        onClick: this.openDeleteActionConfirmationModal,
      },
    ];
    const otherActionType = actionTypes.find((type) => type.name === 'Other');
    const timingActionType = actionTypes.find((type) => type.name === 'Timing');
    const isActionTypeOther =
      otherActionType && actionTypeId === otherActionType.id;
    const isActionTypeTiming =
      timingActionType && actionTypeId === timingActionType.id;

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
            {isActionTypeOther && (
              <Input
                name="other"
                icon="edit"
                value={other || ''}
                onChange={this.onActionFieldChanged}
                style={{ marginLeft: '5px' }}
              />
            )}
            <div
              className={classnames('rup__missue__action__ng', {
                'rup__missue__action__ng--hidden': !isActionTypeTiming,
              })}
            >
              No Graze Period:
              <Input className="rup__missue__action__ng__start-date">
                <input type="text" ref={this.setStartDateRef} />
              </Input>
              -
              <Input className="rup__missue__action__ng__end-date">
                <input type="text" ref={this.setEndDateRef} />
              </Input>
            </div>
          </div>
          <div className="rup__missue__action__ellipsis">
            <Dropdown
              trigger={
                <Icon name="ellipsis vertical" style={{ margin: '0' }} />
              }
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
            value={detail || ''}
            style={{ marginTop: '10px' }}
          />
          <span className="rup__missue__action__detail-asterisk">*</span>
        </Form>
      </div>
    );
  }
}

export default EditableMinisterIssueActionBox;
