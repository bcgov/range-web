import React from 'react'
import { Link } from 'react-router-dom'
import { formatDateFromServer, canUserEditThisPlan } from '../../utils'
import { useUser } from '../../providers/UserProvider'
import { useReferences } from '../../providers/ReferencesProvider'
import { Icon } from 'semantic-ui-react'
import { REFERENCE_KEY } from '../../constants/variables'
import { INITIAL_PLAN, VIEW } from '../../constants/strings'
import { Status, PrimaryButton } from '../common'
import { RANGE_USE_PLAN } from '../../constants/routes'

const PlanTableRow = ({ plan }) => {
  const user = useUser()
  const references = useReferences()

  const amendmentTypes = references[REFERENCE_KEY.AMENDMENT_TYPE]
  const amendmentType = amendmentTypes.find(
    at => at.id === plan.amendmentTypeId
  )
  const amendment = amendmentType ? amendmentType.description : INITIAL_PLAN
  const effectiveAt = formatDateFromServer(plan.effectiveAt, true, '-')
  const submittedAt = formatDateFromServer(plan.submittedAt, true, '-')
  const { recentApproved } = plan

  return (
    <div className="agrm__ptable__row">
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
        <PrimaryButton
          inverted
          compact
          as={Link}
          to={`${RANGE_USE_PLAN}/${plan.id}`}>
          {canUserEditThisPlan(plan, user) ? 'Edit' : VIEW}
        </PrimaryButton>
      </div>
    </div>
  )
}

export default PlanTableRow
