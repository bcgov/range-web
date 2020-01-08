import React from 'react'
import { useUser } from '../../providers/UserProvider'
import { ErrorMessage } from '../common'
import { NO_CLIENT_NUMBER_ASSIGNED } from '../../constants/strings'
import { isUserAgreementHolder } from '../../utils'

const AHWarning = () => {
  const user = useUser()
  const clientNumber = user && user.clientId

  if (isUserAgreementHolder(user) && !clientNumber) {
    return (
      <ErrorMessage
        warning
        style={{ margin: '10px 0' }}
        message={NO_CLIENT_NUMBER_ASSIGNED}
      />
    )
  }

  return null
}

export default AHWarning
