import React, { useEffect, useState } from 'react'
import { PDFViewer } from '@react-pdf/renderer'
import RUPDocument from './pdf'
import { getPlan } from '../../../api'
import { Loading } from '../../common'

const PDFView = ({ match }) => {
  const [isFetching, setFetching] = useState(false)
  const [plan, setPlan] = useState(null)
  const { planId } = match.params

  const fetchPlan = async () => {
    setFetching(true)

    const plan = await getPlan(planId)

    setPlan(plan)
    setFetching(false)
  }

  useEffect(() => {
    fetchPlan()
  }, [])

  return (
    <>
      <Loading active={isFetching} message="Fetching plan" />
      {!isFetching && plan && (
        <PDFViewer width={window.innerWidth} height={window.innerHeight}>
          <RUPDocument plan={plan} />
        </PDFViewer>
      )}
    </>
  )
}

export default PDFView
