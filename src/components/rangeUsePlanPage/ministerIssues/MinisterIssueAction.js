import React from 'react';
import { NO_DESCRIPTION } from '../../../constants/strings';
import PermissionsField, { IfEditable } from '../../common/PermissionsField';
import { MINISTER_ISSUES } from '../../../constants/fields';
import { TextArea, Dropdown as FormikDropdown } from 'formik-semantic-ui';
import { Form, Icon, Dropdown } from 'semantic-ui-react';
import { useReferences } from '../../../providers/ReferencesProvider';
import { REFERENCE_KEY } from '../../../constants/variables';
import DayMonthPicker from '../../common/form/DayMonthPicker';
import moment from 'moment';

const MinisterIssueAction = ({
  actionTypeId,
  detail,
  other,
  noGrazeStartMonth,
  noGrazeStartDay,
  noGrazeEndMonth,
  noGrazeEndDay,
  namespace,
  onDelete,
}) => {
  const types = useReferences()[REFERENCE_KEY.MINISTER_ISSUE_ACTION_TYPE] || [];
  const type = types.find((t) => t.id === actionTypeId)?.name ?? '';
  const options = types.map((type) => ({
    key: type.id,
    value: type.id,
    text: type.name,
    id: type.id,
  }));

  const isOtherType = type === 'Other';
  const isActionTypeTiming = type === 'Timing';

  const menuOptions = [
    {
      key: 'delete',
      text: 'Delete',
      onClick: onDelete,
    },
  ];

  const noGrazePeriod = (
    <Form.Group widths="equal">
      <PermissionsField
        permission={MINISTER_ISSUES.ACTIONS.NO_GRAZING_PERIOD}
        monthName={`${namespace}.noGrazeStartMonth`}
        dayName={`${namespace}.noGrazeStartDay`}
        component={DayMonthPicker}
        label="No Grazing Period Start"
        displayValue={moment(
          `${noGrazeStartMonth} ${noGrazeStartDay}`,
          'MM DD',
        ).format('MMMM Do')}
      />

      <PermissionsField
        permission={MINISTER_ISSUES.ACTIONS.NO_GRAZING_PERIOD}
        monthName={`${namespace}.noGrazeEndMonth`}
        dayName={`${namespace}.noGrazeEndDay`}
        component={DayMonthPicker}
        label="No Grazing Period End"
        displayValue={moment(
          `${noGrazeEndMonth} ${noGrazeEndDay}`,
          'MM DD',
        ).format('MMMM Do')}
      />
    </Form.Group>
  );

  return (
    <div className="rup__missue__action">
      <div className="rup__missue__action__dropdown-ellipsis-container">
        <Form.Group>
          <PermissionsField
            permission={MINISTER_ISSUES.ACTIONS.NAME}
            name={`${namespace}.actionTypeId`}
            displayValue={isOtherType ? 'Other:' : type}
            component={FormikDropdown}
            options={options}
          />
          {isOtherType && (
            <PermissionsField
              permission={MINISTER_ISSUES.ACTIONS.NAME}
              name={`${namespace}.other`}
              displayValue={other}
              inputProps={{
                placeholder: 'Other type',
              }}
            />
          )}
        </Form.Group>

        <IfEditable permission={MINISTER_ISSUES.ACTIONS.NAME}>
          <Dropdown
            trigger={<Icon name="ellipsis vertical" />}
            options={menuOptions}
            icon={null}
            pointing="right"
          />
        </IfEditable>
      </div>
      <div className="rup__missue__action__detail">
        {isActionTypeTiming && noGrazePeriod}

        <PermissionsField
          permission={MINISTER_ISSUES.ACTIONS.DETAIL}
          name={`${namespace}.detail`}
          component={TextArea}
          displayValue={detail || NO_DESCRIPTION}
          label="Description"
          inputProps={{
            placeholder:
              types.find((t) => t.id === actionTypeId)?.placeholder ??
              types.find((t) => t.name === 'Other')?.placeholder,
          }}
          fieldProps={{ required: true }}
        />
      </div>
    </div>
  );
};

export default MinisterIssueAction;
