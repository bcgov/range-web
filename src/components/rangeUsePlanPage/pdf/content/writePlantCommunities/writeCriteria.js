import { getMonthAndDateIntegers, handleNullValue } from '../../helper'
import { writeText, writeFieldText } from '../common'

export const writeCriteria = (doc, y, pc) => {
  const {
    startX,
    halfPageWidth,
    contentWidth,
    fieldTitleFontSize,
    primaryColor,
    lightGrayColor
  } = doc.config
  const {
    name,
    communityType,
    rangeReadinessDay: day,
    rangeReadinessMonth: month,
    rangeReadinessNote,
    // indicatorPlants,
    shrubUse
  } = pc

  let currY = y

  const communityTypeName = (communityType && communityType.name) || name
  const readinessMonthAndDate = getMonthAndDateIntegers(month, day)
  const marginRight = 5
  const moreMarginRight = 9
  const notesStartX = halfPageWidth - 60 + moreMarginRight
  let momentCurrY

  currY += 7
  currY = writeText({
    doc,
    text: `Criteria (${handleNullValue(communityTypeName)})`,
    x: startX + marginRight,
    y: currY,
    fontSize: fieldTitleFontSize + 0.5,
    fontColor: primaryColor
  })

  currY += 6
  currY = writeText({
    doc,
    text: '•  Range Readiness',
    x: startX + marginRight,
    y: currY,
    fontStyle: 'bold',
    fontSize: fieldTitleFontSize
  })

  currY += 5
  currY = writeText({
    doc,
    text:
      'If more than one readiness criteria is provided, all such criteria must be met before grazing may accur.',
    x: startX + moreMarginRight,
    y: currY,
    fontColor: lightGrayColor
  })

  currY += 6
  momentCurrY = currY // eslint-disable-line
  currY = Math.max(
    writeFieldText(
      doc,
      'Readiness Date',
      readinessMonthAndDate,
      startX + moreMarginRight,
      momentCurrY
    ),
    writeFieldText(
      doc,
      'Notes',
      rangeReadinessNote,
      startX + notesStartX,
      momentCurrY,
      contentWidth - notesStartX - 1
    )
  )

  currY += 8
  currY = writeText({
    doc,
    text: '•  Stubble Height',
    x: startX + marginRight,
    y: currY,
    fontStyle: 'bold',
    fontSize: fieldTitleFontSize
  })

  currY += 5
  currY = writeText({
    doc,
    text:
      'Livestock must be removed on the first to occur of the date in the plan (ex. schedule), stubble height criteria or average browse criteria.',
    x: startX + moreMarginRight,
    y: currY,
    fontColor: lightGrayColor,
    cusContentWidth: contentWidth - moreMarginRight
  })

  currY += 8
  currY = writeText({
    doc,
    text: '•  Shrub Use',
    x: startX + marginRight,
    y: currY,
    fontStyle: 'bold',
    fontSize: fieldTitleFontSize
  })

  currY += 5
  currY = writeText({
    doc,
    text:
      'Unless otherwise indicated above, shrub species may be browsed at 25% of current annual growth.',
    x: startX + moreMarginRight,
    y: currY,
    fontColor: lightGrayColor
  })

  currY += 6
  currY = writeFieldText(
    doc,
    '% of Current Annual Growth',
    shrubUse,
    startX + moreMarginRight,
    currY
  )

  return currY
}
