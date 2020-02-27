import React, { useContext, useState, useEffect } from 'react'
import { normalize } from 'normalizr'
import * as API from '../api'
import { storePlan } from '../actions'
import * as schema from '../actionCreators/schema'
// import * as schema from '../schema'
import { getNetworkStatus } from '../utils/helper/network'
import { connect } from 'react-redux'
import { appendUsage } from '../utils'

/**
 * @typedef {Object} PlanContext
 * @property {string|number} currentPlanId ID of the current plan
 * @property {object|null} currentPlan Current plan
 * @property {boolean} isFetchingPlan Is the plan currently being fetched
 * @property {boolean} isSavingPlan Is the plan saving
 * @property {string|null} errorFetchingPlan Defined if there was an error fetching the plan
 * @property {(id?: number) => Promise<object>} fetchPlan Fetches by default the plan with id `currentPlanId`. Returns the plan, as well as sets `currentPlan`. If no network connectivity, fallbacks to local storage.
 * @property {(plan: object) => Promise<number>} savePlan Saves `plan` to either the remote backend or local storage, depending on network connectivity.
 */

/**
 * @type {React.Context<PlanContext>}
 */
const PlanContext = React.createContext()

/**
 * @returns {PlanContext}
 */
export const useCurrentPlan = () => useContext(PlanContext)

export const PlanProvider = ({ children, storePlan }) => {
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
        // fetchRUP(planId)
        storePlan(normalize(plan, schema.plan))
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
  { storePlan }
)(PlanProvider)
