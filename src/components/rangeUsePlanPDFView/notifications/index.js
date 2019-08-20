import React, { Component } from 'react'
import PropTypes from 'prop-types'
import StatusHistory from './StatusHistory'
import {
  isStatusAwaitingConfirmation,
  isStatusIndicatingStaffFeedbackNeeded,
  isUserStaff
} from '../../../utils'
import AHSignaturesStatusModal from './AHSignaturesStatusModal'

class Notifications extends Component {
  static propTypes = {
    plan: PropTypes.shape({}).isRequired,
    user: PropTypes.shape({}).isRequired,
    references: PropTypes.shape({}).isRequired,
    confirmationsMap: PropTypes.shape({}).isRequired,
    planStatusHistoryMap: PropTypes.shape({}).isRequired,
    planTypeDescription: PropTypes.string
  }

  static defaultProps = {
    planTypeDescription: ''
  }

  render() {
    const { plan, user, planTypeDescription } = this.props
    const { status, planStatusHistory } = plan

    return (
      <div className="rup__notifications">
        {isUserStaff(user) && isStatusIndicatingStaffFeedbackNeeded(status) && (
          <div className="rup__feedback-notification">
            <div className="rup__feedback-notification__title">
              {`Provide input for ${planTypeDescription} Submission`}
            </div>
            Review the Range Use Plan and provide for feedback
          </div>
        )}

        {planStatusHistory.length !== 0 && (
          <StatusHistory
            {...this.props}
            planStatusHistory={planStatusHistory}
          />
        )}

        {isStatusAwaitingConfirmation(status) && (
          <AHSignaturesStatusModal {...this.props} />
        )}
      </div>
    )
  }
}

export default Notifications
