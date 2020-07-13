import React, { useState } from 'react'
import { Button, Confirm } from 'semantic-ui-react'
import { useCurrentPlan } from '../../providers/PlanProvider'
import { useNetworkStatus } from '../../utils/hooks/network'
import { updateStatus, updatePlan } from '../../api'
import { useToast } from '../../providers/ToastProvider'
import {
  PLAN_STATUS,
  REFERENCE_KEY,
  AMENDMENT_TYPE
} from '../../constants/variables'
import { useReferences } from '../../providers/ReferencesProvider'
import { findStatusWithCode } from '../../utils'

const SubmitAsMandatoryButton = () => {
  const [isModalOpen, setModalOpen] = useState(false)
  const [isDiscarding, setDiscarding] = useState(false)
  const { errorToast } = useToast()
  const references = useReferences()

  const { currentPlan, fetchPlan } = useCurrentPlan()

  const isOnline = useNetworkStatus()

  const handleDiscard = async () => {
    setDiscarding(true)

    try {
      const amendmentTypes = references[REFERENCE_KEY.AMENDMENT_TYPE]

      const mandatoryAmendmentType = amendmentTypes?.find(
        a => a.code === AMENDMENT_TYPE.MANDATORY
      )
      if (!mandatoryAmendmentType) {
        throw new Error("Couldn't find mandatory amendment type in reference.")
      }

      const status = findStatusWithCode(
        references,
        PLAN_STATUS.SUBMITTED_AS_MANDATORY
      )

      if (!status) {
        throw new Error(
          "Couldn't find submitted as mandatory status in reference."
        )
      }

      await updateStatus({
        planId: currentPlan.id,
        statusId: status.id
      })
      await updatePlan(currentPlan.id, {
        amendmentTypeId: mandatoryAmendmentType.id
      })

      await fetchPlan()
    } catch (e) {
      errorToast(e.message)
    }

    setTimeout(() => {
      setDiscarding(false)
      closeModal()
    }, 1000)
  }

  const openModal = () => setModalOpen(true)
  const closeModal = () => setModalOpen(false)

  return (
    <>
      <Button
        key="submitAsMandatoryBtn"
        inverted
        compact
        type="button"
        disabled={!isOnline}
        onClick={() => {
          openModal()
        }}>
        Submit as Mandatory
      </Button>
      <Confirm
        open={isModalOpen}
        onConfirm={handleDiscard}
        onCancel={closeModal}
        header="Submit this minor amendment as mandatory?"
        content="You will still have a chance to make changes and provide comments to agreement holders."
        confirmButton={
          <Button loading={isDiscarding}>Submit as Mandatory</Button>
        }
      />
    </>
  )
}

export default SubmitAsMandatoryButton
