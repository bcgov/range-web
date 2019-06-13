import { writeText } from '../common'
import { handleNullValue, getMonthAndDateIntegers } from '../../helper'

export const writePlantCommunityActions = (doc, y, pc) => {
  const {
    startX,
    fieldTitleFontSize,
    halfPageWidth,
    contentWidth,
    grayColor,
    primaryColor
  } = doc.config
  const { name, communityType, plantCommunityActions } = pc

  let currY = y
  if (!plantCommunityActions || plantCommunityActions.length === 0) {
    return currY
  }

  const communityTypeName = (communityType && communityType.name) || name
  const marginRight = 5
  const detailStartX = halfPageWidth - 60 + marginRight
  let momentCurrY

  currY += 7
  currY = writeText({
    doc,
    text: `Plant Community Actions (${handleNullValue(communityTypeName)})`,
    x: startX + marginRight,
    y: currY,
    fontSize: fieldTitleFontSize + 0.5,
    fontColor: primaryColor
  })

  currY += 6
  momentCurrY = currY // eslint-disable-line
  currY = Math.max(
    writeText({
      doc,
      text: 'Action',
      x: startX + marginRight,
      y: momentCurrY,
      fontStyle: 'bold'
    }),
    writeText({
      doc,
      text: 'Details',
      x: startX + detailStartX,
      y: momentCurrY,
      fontStyle: 'bold'
    })
  )

  plantCommunityActions.map(pca => {
    const {
      actionType,
      details,
      noGrazeStartDay,
      noGrazeStartMonth,
      noGrazeEndDay,
      noGrazeEndMonth
    } = pca
    const actionTypeName = actionType && actionType.name

    currY += 5
    currY = writeText({
      doc,
      text: actionTypeName,
      x: startX + marginRight,
      y: currY,
      fontColor: grayColor,
      cusContentWidth: detailStartX - 5
    })
    currY = writeText({
      doc,
      text: details,
      x: startX + detailStartX,
      y: currY,
      fontColor: grayColor,
      cusContentWidth: contentWidth - detailStartX - 1
    })

    currY += 5
    currY = writeText({
      doc,
      text: 'No Graze Period: ',
      x: startX + detailStartX,
      y: currY,
      fontStyle: 'bold',
      cusContentWidth: contentWidth - detailStartX
    })

    const period = `${getMonthAndDateIntegers(
      noGrazeStartMonth,
      noGrazeStartDay
    )} - ${getMonthAndDateIntegers(noGrazeEndMonth, noGrazeEndDay)}`
    currY = writeText({
      doc,
      text: period,
      x: startX + detailStartX + 30,
      y: currY,
      fontColor: grayColor,
      cusContentWidth: contentWidth - detailStartX - 11
    })

    currY += 2
    return null
  })

  return currY - 2
}
