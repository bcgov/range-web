import React, { useState } from 'react'
import RUPDocument from './pdf'
import { getPlan } from '../../../api'
import { Button, Icon } from 'semantic-ui-react'
import { usePDF } from '../../../utils/hooks/pdf'
import { useUser } from '../../../providers/UserProvider'

const PDFView = ({ match }) => {
  const [agreementId, setAgreementId] = useState(null)
  const user = useUser()
  const { planId } = match.params

  const [pdfUrl, loading, error, retry] = usePDF(async () => {
    setAgreementId(null)
    const plan = await getPlan(planId, user)

    if (plan && plan.agreement && plan.agreement.id) {
      setAgreementId(plan.agreement.id)
    }
    return <RUPDocument plan={plan} />
  }, [match.url])

  const hasError = !!error

  return (
    <>
      <Button
        primary
        negative={hasError}
        basic={hasError}
        loading={loading}
        as="a"
        href={pdfUrl}
        download={`Range Use Plan - ${agreementId}`}
        onClick={e => {
          const iOS =
            /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream

          if (iOS && !loading && !hasError && pdfUrl) {
            e.preventDefault()
            window.open(pdfUrl, '_blank')
          }
          if (hasError && !loading) {
            retry()
          }
        }}>
        <Icon name="file pdf outline" />
        {error ? `Error loading PDF. Click to retry` : 'Download PDF'}
      </Button>
    </>
  )
}

export default PDFView
