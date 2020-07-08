import React, { Component } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { Icon } from 'semantic-ui-react'
import {
  findConfirmationWithClientId,
  formatDateFromServer,
  isClientCurrentUser,
  getClientFullName,
  isAgent
} from '../../../../utils'
import { AWAITING_CONFIRMATION } from '../../../../constants/strings'
import { getUserFullName } from '../../pdf/helper'

class AHConfirmationList extends Component {
  static propTypes = {
    user: PropTypes.shape({}).isRequired,
    clients: PropTypes.arrayOf(PropTypes.object).isRequired,
    plan: PropTypes.shape({}).isRequired
  }

  renderConfirmation = (client, confirmation, user) => {
    const { clientAgreements } = this.props
    const { confirmed, updatedAt } = confirmation || {}
    const confirmationDate = confirmed
      ? formatDateFromServer(updatedAt)
      : AWAITING_CONFIRMATION

    return (
      <div key={client.id} className="rup__confirmation__ah-list">
        <div>
          <Icon name="user outline" />
          <span
            className={classnames('rup__confirmation__ah-list__cname', {
              'rup__confirmation__ah-list__cname--bold':
                isClientCurrentUser(client, user) ||
                (isAgent(clientAgreements, user, client) &&
                  confirmation.user.id === user.id)
            })}>
            {getClientFullName(client)}{' '}
            {confirmed &&
              !confirmation.isOwnSignature &&
              `(by ${getUserFullName(confirmation.user)})`}
          </span>
        </div>
        <div>{confirmationDate}</div>
      </div>
    )
  }

  createConfirmationListView = () => {
    const { user, plan, clients } = this.props

    const confirmedListView = [
      <div key="confirmed1" className="rup__confirmation__paragraph-title">
        Agreement holders who have confirmed the submission
      </div>,
      <div key="confirmed2" className="rup__confirmation__ah-list__columns">
        <span>Name</span>
        <span>Confirmation Date</span>
      </div>
    ]
    const notConfirmedListView = [
      <div key="notConfirmed" className="rup__confirmation__paragraph-title">
        Agreement holders who have not yet confirmed the submission
      </div>
    ]
    const allConfimedView = (
      <div key="allConfirmed" className="rup__confirmation__paragraph-title">
        All agreement holders have confirmed this submission. It has now been
        submitted to range staff.
      </div>
    )

    // create confirmation views for each client then
    // push to the view lists based on whether it's confirmed or not
    clients.map(client => {
      const confirmation = findConfirmationWithClientId(
        client.id,
        plan.confirmations
      )
      const view = this.renderConfirmation(client, confirmation, user)
      if (confirmation && confirmation.confirmed) {
        return confirmedListView.push(view)
      }

      return notConfirmedListView.push(view)
    })

    const isAllConfirmed = notConfirmedListView.length === 1

    if (isAllConfirmed) {
      confirmedListView.push(allConfimedView)
      return confirmedListView
    }

    return confirmedListView.concat(notConfirmedListView)
  }

  render() {
    const confirmationList = this.createConfirmationListView()

    return <div style={{ width: '100%' }}>{confirmationList}</div>
  }
}

export default AHConfirmationList
