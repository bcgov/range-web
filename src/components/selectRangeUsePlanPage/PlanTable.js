import React from 'react'
import { Segment, Button } from 'semantic-ui-react'
import { Loading, PrimaryButton } from '../common'
import * as API from '../../constants/api'
import {
  EFFECTIVE_DATE,
  SUBMITTED,
  TYPE,
  STATUS,
  VIEW,
  NO_RESULTS_FOUND,
  ERROR_OCCUR
} from '../../constants/strings'
import PlanTableRow from './PlanTableRow'
import {
  axios,
  getAuthHeaderConfig,
  isStatusAmongApprovedStatuses
} from '../../utils'
import useSWR from 'swr'

const PlanTable = ({ agreementId }) => {
  const { data: agreement, isValidating, revalidate, error } = useSWR(
    agreementId && API.GET_AGREEMENT(agreementId),
    key => axios.get(key, getAuthHeaderConfig()).then(res => res.data)
  )

  const { plans = [] } = agreement || {}

  const setFirstApproved = (p, i) => {
    const index = plans.findIndex(p => isStatusAmongApprovedStatuses(p.status))
    return {
      ...p,
      recentApproved: index === i
    }
  }

  if (error) {
    return (
      <div className="agrm__ptable__message agrm__ptable__message--error">
        {ERROR_OCCUR}
        <PrimaryButton
          inverted
          onClick={() => revalidate}
          style={{ marginLeft: '10px' }}>
          Refresh
        </PrimaryButton>
      </div>
    )
  }

  if (plans.length === 0) {
    return <div className="agrm__ptable__message">{NO_RESULTS_FOUND}</div>
  }

  return (
    <Segment basic>
      <Loading size="medium" active={isValidating && !agreement} />
      <div className="agrm__ptable">
        <div className="agrm__ptable__header-row">
          <div className="agrm__ptable__header-row__cell">{EFFECTIVE_DATE}</div>
          <div className="agrm__ptable__header-row__cell">{SUBMITTED}</div>
          <div className="agrm__ptable__header-row__cell">{TYPE}</div>
          <div className="agrm__ptable__header-row__cell">{STATUS}</div>
          <div className="agrm__ptable__header-row__cell">
            <Button disabled>{VIEW}</Button>
          </div>
        </div>
        {plans.map(setFirstApproved).map(plan => (
          <PlanTableRow plan={plan} key={plan.id} />
        ))}
      </div>
    </Segment>
  )
}

export default PlanTable
