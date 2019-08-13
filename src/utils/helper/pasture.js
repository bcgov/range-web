import { NOT_PROVIDED } from '../../constants/strings'

export const getPastureNames = (pastureIds = [], pasturesMap = {}) => {
  const pastureNames = pastureIds.map(pId => {
    const pasture = pasturesMap[pId]
    return pasture && pasture.name
  })
  const { length } = pastureNames

  switch (length) {
    case 0:
      return NOT_PROVIDED
    case 1:
    case 2:
      return pastureNames.join(' and ')
    default:
      return `${pastureNames.slice(0, length - 1).join(', ')}, and ${
        pastureNames[length - 1]
      }`
  }
}
