import { useState, useEffect } from 'react'
import * as API from '../../constants/api'
import { savePlanToLocalStorage, getPlans } from '../../api'
import { axios } from '..'
import useSWR from 'swr'
import { getAuthHeaderConfig } from '../authentication'

export const usePlans = agreementId => {
  const [plans] = useState([])
  const { data: agreement, isValidating, revalidate, error } = useSWR(
    agreementId && API.GET_AGREEMENT(agreementId),
    key => axios.get(key, getAuthHeaderConfig()).then(res => res.data)
  )

  const { remotePlans = [] } = agreement || {}

  const savePlans = async plans => {
    await Promise.all(plans.map(async p => savePlanToLocalStorage(p, true)))
  }

  const localPlans = getPlans().filter(p => p.agreementId === agreementId)

  useEffect(() => {
    savePlans(remotePlans)
  }, [remotePlans])

  useEffect(() => {
    // setPlans(getPlans().filter(p => p.agreementId === agreementId))
    console.log('updating')
  }, [agreementId, localPlans])

  return { plans, isValidating, revalidate, error }
}
