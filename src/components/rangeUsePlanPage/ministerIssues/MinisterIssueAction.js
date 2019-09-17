import React from 'react'
import { NO_DESCRIPTION } from '../../../constants/strings'
import PermissionsField from '../../common/PermissionsField'
import { MINISTER_ISSUES } from '../../../constants/fields'
import { TextArea } from 'formik-semantic-ui'
import { Form } from 'semantic-ui-react'
import DateInputField from '../../common/form/DateInputField'
import { useReferences } from '../../../providers/ReferencesProvider'
import { REFERENCE_KEY } from '../../../constants/variables'

const MinisterIssueAction = ({
  actionTypeId,
  detail,
  other,
  noGrazeEndDate,
  noGrazeStartDate,
  namespace
}) => {
  const types = useReferences()[REFERENCE_KEY.MINISTER_ISSUE_ACTION_TYPE] || []
  const type = types.find(t => t.id === actionTypeId).name

  const isOtherType = type === 'Other'
  const isActionTypeTiming = type === 'Timing'

  const noGrazePeriod = (
    <Form.Group width="equal">
      <PermissionsField
        name={`${namespace}.noGrazeStartDate`}
        permission={MINISTER_ISSUES.ACTIONS.NO_GRAZING_PERIOD}
        displayValue={noGrazeStartDate}
        component={DateInputField}
        label="No Graze Period"
        inline
      />

      <PermissionsField
        name={`${namespace}.noGrazeEndDate`}
        permission={MINISTER_ISSUES.ACTIONS.NO_GRAZING_PERIOD}
        displayValue={noGrazeEndDate}
        component={DateInputField}
        label="-"
        inline
      />
    </Form.Group>
  )

  return (
    <div className="rup__missue__action">
      <span className="rup__missue__action__type">
        {type}
        {isOtherType && other.name && ` (${other.name})`}
      </span>
      {isActionTypeTiming && noGrazePeriod}

      <div className="rup__missue__action__detail">
        <PermissionsField
          permission={MINISTER_ISSUES.ACTIONS.DETAIL}
          name={`${namespace}.detail`}
          component={TextArea}
          displayValue={detail || NO_DESCRIPTION}
        />
      </div>
    </div>
  )
}

export default MinisterIssueAction
