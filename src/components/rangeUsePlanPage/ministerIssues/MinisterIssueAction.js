import React from 'react'
import PropTypes from 'prop-types'
import { NO_DESCRIPTION } from '../../../constants/strings'
import { formatDateFromServer } from '../../../utils'

const MinisterIssueAction = ({
  id,
  detail,
  type,
  other,
  noGrazeEndDate,
  noGrazeStartDate
}) => {
  const isOtherType = type === 'Other'
  const isActionTypeTiming = type === 'Timing'

  const noGrazePeriod = (
    <span>{` - No Graze Period (${formatDateFromServer(
      noGrazeStartDate,
      false
    )} - ${formatDateFromServer(noGrazeEndDate, false)})`}</span>
  )

  return (
    <div className="rup__missue__action" key={id}>
      <span className="rup__missue__action__type">
        {type}
        {isOtherType && ` (${other})`}
      </span>
      {isActionTypeTiming && noGrazePeriod}

      <div className="rup__missue__action__detail">
        {detail || NO_DESCRIPTION}
      </div>
    </div>
  )
}

MinisterIssueAction.propTypes = {
  id: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  other: PropTypes.string,
  detail: PropTypes.string,
  noGrazeEndDate: PropTypes.instanceOf(Date),
  noGrazeStartDate: PropTypes.instanceOf(Date)
}

export default MinisterIssueAction
