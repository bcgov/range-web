import { NOT_ASSIGNED, NO_DESCRIPTION } from '../../constants/strings'
import { getUserFullName } from './user'

export const getZoneOption = zone => {
  const {
    id: zoneId,
    code: zoneCode,
    user: staff,
    description: zoneDescription,
    district
  } = zone
  const option = {
    value: zoneId,
    text: zoneCode,
    description: NOT_ASSIGNED
  }
  let description = zoneDescription
  if (
    zoneDescription === 'Please update contact and description' ||
    zoneDescription === 'Please update contact'
  ) {
    description = NO_DESCRIPTION
  }
  option.text += ` (${description})`
  option.text += ` - ${district.code}`

  if (staff) {
    option.description = getUserFullName(staff)
  }

  return option
}

export const getContactOption = user => ({
  value: user.id,
  description: user.email,
  text: getUserFullName(user)
})

export const getClientOption = client => {
  const { clientNumber, id, name } = client

  return {
    key: id,
    value: id,
    text: `${name}`,
    description: `Client #: ${clientNumber}`
  }
}

export const getUserOption = user => {
  const { email, clientId, clientNumber } = user

  let description = `${email}`
  if (clientId) {
    description = `Client #: ${clientNumber}, ${email}`
  }

  return {
    value: user.id,
    text: getUserFullName(user),
    description
  }
}
