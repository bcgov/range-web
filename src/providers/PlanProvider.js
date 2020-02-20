import React, { useContext, useState, useEffect } from 'react'
import * as API from '../api'
import { fetchRUP } from '../actionCreators'
import { getNetworkStatus } from '../utils/helper/network'
import { connect } from 'react-redux'
import { appendUsage } from '../utils'

const PlanContext = React.createContext()

export const useCurrentPlan = () => useContext(PlanContext)

export const PlanProvider = ({ children, fetchRUP }) => {
  const [currentPlanId, setCurrentPlanId] = useState(null)
  const [currentPlan, setCurrentPlan] = useState(null)
  const [isFetchingPlan, setFetchingPlan] = useState(false)
  const [isSavingPlan, setSavingPlan] = useState(false)
  const [errorFetchingPlan, setErrorFetchingPlan] = useState(null)

  const fetchPlan = async (planId = currentPlanId) => {
    setFetchingPlan(true)

    try {
      const plan = await API.getPlan(planId)
      setCurrentPlan(appendUsage(plan))

      // TODO: remove redux
      const isOnline = await getNetworkStatus()
      if (isOnline) {
        fetchRUP(planId)
      }

      return plan
    } catch (e) {
      setErrorFetchingPlan(e)
    } finally {
      setFetchingPlan(false)
    }
  }

  const savePlan = async plan => {
    setSavingPlan(true)

    const planId = await API.savePlan(plan)
    await fetchPlan(planId)

    setSavingPlan(false)

    return planId
  }

  useEffect(() => {
    if (currentPlanId !== null) {
      fetchPlan()
    }
  }, [currentPlanId])

  return (
    <PlanContext.Provider
      value={{
        setCurrentPlanId,
        currentPlan,
        isFetchingPlan,
        isSavingPlan,
        errorFetchingPlan,
        fetchPlan,
        savePlan
      }}>
      {children}
    </PlanContext.Provider>
  )
}

export default connect(
  null,
  { fetchRUP }
)(PlanProvider)
