import React, { useEffect, useRef } from 'react';
import Pikaday from 'pikaday';
import classnames from 'classnames';
import { Input, Icon, TextArea, Dropdown, Form as SemanticForm } from 'semantic-ui-react';

const Form = SemanticForm as any;
import { REFERENCE_KEY, CONFIRMATION_MODAL_ID, DATE_FORMAT } from '../../../constants/variables';
import {
  DELETE_MINISTER_ISSUE_ACTION_CONFIRM_CONTENT,
  DELETE_MINISTER_ISSUE_ACTION_CONFIRM_HEADER,
} from '../../../constants/strings';
import { parseMonthAndDay, createDateWithMoment } from '../../../utils';

interface EditableMinisterIssueActionBoxProps {
  action: any;
  actionIndex: number;
  references: any;
  openConfirmationModal: (config: any) => void;
  handleActionChange: (action: any, actionIndex: number) => void;
  handleActionDelete: (actionIndex: number) => void;
}

const EditableMinisterIssueActionBox = ({
  action,
  actionIndex,
  references,
  openConfirmationModal,
  handleActionChange,
  handleActionDelete,
}: EditableMinisterIssueActionBoxProps) => {
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const pikaDayDateInRef = useRef<Pikaday | null>(null);
  const pikaDayDateOutRef = useRef<Pikaday | null>(null);

  const {
    noGrazeEndDay: ngEndDay,
    noGrazeEndMonth: ngEndMonth,
    noGrazeStartDay: ngStartDay,
    noGrazeStartMonth: ngStartMonth,
  } = action;

  useEffect(() => {
    const noGrazeStartDate = createDateWithMoment(ngStartDay, ngStartMonth);
    const noGrazeEndDate = createDateWithMoment(ngEndDay, ngEndMonth);
    const minDate = createDateWithMoment(1, 1);
    const maxDate = createDateWithMoment(31, 12);

    pikaDayDateInRef.current = new Pikaday({
      field: startDateRef.current!,
      format: DATE_FORMAT.CLIENT_SIDE_WITHOUT_YEAR,
      minDate,
      maxDate: noGrazeEndDate || maxDate,
      defaultDate: noGrazeStartDate || minDate,
      setDefaultDate: noGrazeStartDate !== null,
      onSelect: handleDateChange('noGrazeStartDate'),
    });

    pikaDayDateOutRef.current = new Pikaday({
      field: endDateRef.current!,
      format: DATE_FORMAT.CLIENT_SIDE_WITHOUT_YEAR,
      minDate: noGrazeStartDate || minDate,
      maxDate,
      defaultDate: noGrazeEndDate || minDate,
      setDefaultDate: noGrazeEndDate !== null,
      onSelect: handleDateChange('noGrazeEndDate'),
    });

    return () => {
      pikaDayDateInRef.current?.destroy();
      pikaDayDateOutRef.current?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDateChange = (key: string) => (date: Date) => {
    const newAction = { ...action };

    if (pikaDayDateInRef.current && key === 'noGrazeEndDate') {
      const { month: noGrazeEndMonth, day: noGrazeEndDay } = parseMonthAndDay(date);
      newAction.noGrazeEndMonth = noGrazeEndMonth;
      newAction.noGrazeEndDay = noGrazeEndDay;
      pikaDayDateInRef.current.setMaxDate(date);
    } else if (pikaDayDateOutRef.current && key === 'noGrazeStartDate') {
      const { month: noGrazeStartMonth, day: noGrazeStartDay } = parseMonthAndDay(date);
      newAction.noGrazeStartMonth = noGrazeStartMonth;
      newAction.noGrazeStartDay = noGrazeStartDay;
      pikaDayDateOutRef.current.setMinDate(date);
    }

    handleActionChange(newAction, actionIndex);
  };

  const onActionFieldChanged = (e: any, { name, value }: any) => {
    const newAction = {
      ...action,
      [name]: value,
    };

    if (name === 'actionTypeId') {
      const actionTypes = references[REFERENCE_KEY.MINISTER_ISSUE_ACTION_TYPE] || [];
      const otherActionType = actionTypes.find((t: any) => t.name === 'Other');

      if (otherActionType && value === otherActionType.id) {
        newAction.other = null;
      }
    }

    handleActionChange(newAction, actionIndex);
  };

  const onDeleteActionBtnClicked = () => {
    handleActionDelete(actionIndex);
  };

  const openDeleteActionConfirmationModal = () => {
    openConfirmationModal({
      id: CONFIRMATION_MODAL_ID.DELETE_MINISTER_ISSUE_ACTION,
      header: DELETE_MINISTER_ISSUE_ACTION_CONFIRM_HEADER,
      content: DELETE_MINISTER_ISSUE_ACTION_CONFIRM_CONTENT,
      onYesBtnClicked: onDeleteActionBtnClicked,
      closeAfterYesBtnClicked: true,
    });
  };

  const { detail, actionTypeId, other } = action;
  const actionTypes = references[REFERENCE_KEY.MINISTER_ISSUE_ACTION_TYPE] || [];
  const actionTypesMap: Record<string, any> = {};
  const actionTypeOptions = actionTypes.map((at: any) => {
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
      onClick: openDeleteActionConfirmationModal,
    },
  ];
  const otherActionType = actionTypes.find((type: any) => type.name === 'Other');
  const timingActionType = actionTypes.find((type: any) => type.name === 'Timing');
  const isActionTypeOther = otherActionType && actionTypeId === otherActionType.id;
  const isActionTypeTiming = timingActionType && actionTypeId === timingActionType.id;

  return (
    <div className="rup__missue__action">
      <div className="rup__missue__action__dropdown-ellipsis-container">
        <div className="rup__missue__action__type-dropdown">
          <Dropdown
            name="actionTypeId"
            options={actionTypeOptions}
            value={actionTypeId}
            onChange={onActionFieldChanged}
            error={actionTypeId === null}
            selection
            selectOnBlur={false}
          />
          {isActionTypeOther && (
            <Input
              name="other"
              icon="edit"
              value={other || ''}
              onChange={onActionFieldChanged}
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
              <input type="text" ref={startDateRef} />
            </Input>
            -
            <Input className="rup__missue__action__ng__end-date">
              <input type="text" ref={endDateRef} />
            </Input>
          </div>
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
          onChange={onActionFieldChanged}
          value={detail || ''}
          style={{ marginTop: '10px' }}
        />
        <span className="rup__missue__action__detail-asterisk">*</span>
      </Form>
    </div>
  );
};

export default EditableMinisterIssueActionBox;
