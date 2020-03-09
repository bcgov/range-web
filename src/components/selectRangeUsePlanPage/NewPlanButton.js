import React from 'react'
import { useHistory } from 'react-router-dom'
import AddIcon from '@material-ui/icons/Add'
import { Button } from '@material-ui/core'
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
    <Button fullWidth variant="contained" color="primary" onClick={handleClick}>
      New plan <AddIcon fontSize="small" />
    </Button>
  )
}

export default NewPlanButton
