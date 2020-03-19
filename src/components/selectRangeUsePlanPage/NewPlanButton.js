import React from 'react'
import { useHistory } from 'react-router-dom'
import { Icon } from 'semantic-ui-react'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { createNewPlan } from '../../api'
import { RANGE_USE_PLAN } from '../../constants/routes'

const useStyles = makeStyles(theme => ({
  icon: {
    marginLeft: `${theme.spacing()}px !important`,
    height: '100% !important'
  }
}))

const NewPlanButton = ({ agreement }) => {
  const history = useHistory()
  const classes = useStyles()

  const handleClick = e => {
    e.stopPropagation()
    const plan = createNewPlan(agreement)
    history.push(`${RANGE_USE_PLAN}/${plan.id}`)
  }

  return (
    <Button
      fullWidth
      variant="contained"
      disableElevation
      color="primary"
      onClick={handleClick}>
      New plan
      <Icon className={classes.icon} name="add" fitted={false} />
    </Button>
  )
}

export default NewPlanButton
