import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { Icon } from 'semantic-ui-react'
import { REFERENCE_KEY } from '../../constants/variables'
import { formatDateFromServer } from '../../utils'
import { Status, PrimaryButton } from '../common'
import { VIEW, INITIAL_PLAN } from '../../constants/strings'
import { RANGE_USE_PLAN } from '../../constants/routes'

class PlanTableRow extends Component {
  static propTypes = {
    plan: PropTypes.shape({}).isRequired,
    user: PropTypes.shape({}).isRequired,
    references: PropTypes.shape({}).isRequired
  }

  state = {
    redirectTo: null
  }

  onViewClicked = plan => () => {
    this.setState({
      redirectTo: {
        push: true, // redirecting will push a new entry onto the history
        to: `${RANGE_USE_PLAN}/${plan.id}`
      }
    })
  }

  render() {
    const { references, user, plan } = this.props
    const { redirectTo } = this.state
    const amendmentTypes = references[REFERENCE_KEY.AMENDMENT_TYPE]
    const amendmentType = amendmentTypes.find(
      at => at.id === plan.amendmentTypeId
    )
    const amendment = amendmentType ? amendmentType.description : INITIAL_PLAN
    const effectiveAt = formatDateFromServer(plan.effectiveAt, true, '-')
    const submittedAt = formatDateFromServer(plan.submittedAt, true, '-')
    const { id, recentApproved } = plan

    if (redirectTo) {
      return <Redirect {...redirectTo} />
    }

    return (
      <div key={id} className="agrm__ptable__row">
        <div className="agrm__ptable__row__cell">
          {recentApproved && (
            <Icon name="star" size="small" style={{ marginRight: '7px' }} />
          )}
          {effectiveAt}
        </div>
        <div className="agrm__ptable__row__cell">{submittedAt}</div>
        <div className="agrm__ptable__row__cell">{amendment}</div>
        <div className="agrm__ptable__row__cell">
          <Status user={user} status={plan.status} />
        </div>
        <div className="agrm__ptable__row__cell">
          <PrimaryButton inverted compact onClick={this.onViewClicked(plan)}>
            {VIEW}
          </PrimaryButton>
        </div>
      </div>
    )
  }
}

export default PlanTableRow
