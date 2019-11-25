import React from 'react'
import { PrimaryButton } from '../common'
import { Icon } from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'
import { createNewPlan } from '../../api'
import { RANGE_USE_PLAN } from '../../constants/routes'

const NewPlanButton = ({ agreement }) => {
  const history = useHistory()

  const handleClick = e => {
    e.stopPropagation()
    const plan = createNewPlan(agreement)
    history.push(`${RANGE_USE_PLAN}/${plan.id}`)
  }

  return (
    <PrimaryButton icon onClick={handleClick}>
      New plan <Icon name="add" />
    </PrimaryButton>
  )
}

export default NewPlanButton
