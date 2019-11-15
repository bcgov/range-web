import React from 'react'
import uuid from 'uuid-v4'
import { NO_DESCRIPTION } from '../../../constants/strings'
import PermissionsField, { IfEditable } from '../../common/PermissionsField'
import { MINISTER_ISSUES } from '../../../constants/fields'
import { TextArea } from 'formik-semantic-ui'
import { Form, Icon, Dropdown } from 'semantic-ui-react'
import { useReferences } from '../../../providers/ReferencesProvider'
import { REFERENCE_KEY } from '../../../constants/variables'
import DayMonthPicker from '../../common/form/DayMonthPicker'
import moment from 'moment'

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
  id
}) => {
  const types = useReferences()[REFERENCE_KEY.MINISTER_ISSUE_ACTION_TYPE] || []
  const type = types.find(t => t.id === actionTypeId)
    ? types.find(t => t.id === actionTypeId).name
    : ''

  const isOtherType = type === 'Other'
  const isActionTypeTiming = type === 'Timing'

  const menuOptions = [
    {
      key: 'delete',
      text: 'Delete',
      onClick: uuid.isUUID(id) ? onDelete : null,
      disabled: !uuid.isUUID(id)
    }
  ]

  const noGrazePeriod = (
    <Form.Group widths="equal">
      <PermissionsField
        permission={MINISTER_ISSUES.ACTIONS.NO_GRAZING_PERIOD}
        monthName={`${namespace}.noGrazeStartMonth`}
        dayName={`${namespace}.noGrazeStartDay`}
        component={DayMonthPicker}
        label="Grazing Period Start"
        displayValue={moment(
          `${noGrazeStartMonth} ${noGrazeStartDay}`,
          'MM DD'
        ).format('MMMM Do')}
      />

      <PermissionsField
        permission={MINISTER_ISSUES.ACTIONS.NO_GRAZING_PERIOD}
        monthName={`${namespace}.noGrazeEndMonth`}
        dayName={`${namespace}.noGrazeEndDay`}
        component={DayMonthPicker}
        label="Grazing Period End"
        displayValue={moment(
          `${noGrazeEndMonth} ${noGrazeEndDay}`,
          'MM DD'
        ).format('MMMM Do')}
      />
    </Form.Group>
  )

  return (
    <div className="rup__missue__action">
      <div className="rup__missue__action__dropdown-ellipsis-container">
        <span className="rup__missue__action__type">
          {type}
          {isOtherType && other.name && ` (${other.name})`}
        </span>

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
        />
      </div>
    </div>
  )
}

export default MinisterIssueAction
