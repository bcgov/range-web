import { writeText, writeFieldText, drawVerticalLine } from '../common'
import { capitalize, handleNullValue } from '../../helper'
import { writeMonitoringAreas } from './writeMonitoringAreas'
import { writePlantCommunityActions } from './writePlantCommunityActions'
import { writeCriteria } from './writeCriteria'

export const writePlantCommunities = (doc, y, pasture) => {
  const { internal, config } = doc
  const {
    startX,
    contentWidth,
    sectionTitleFontSize,
    primaryColor,
    fieldTitleFontSize,
    afterHeaderY
  } = config
  const { name: pastureName, plantCommunities = [] } = pasture

  let currY = y

  if (plantCommunities.length === 0) {
    return currY
  }

  currY = writeText({
    doc,
    text: `Plant Communities: (${pastureName})`,
    x: startX,
    y: currY,
    fontSize: sectionTitleFontSize,
    fontStyle: 'bold'
  })
  currY += 7

  const marginRight = 5
  let numberOfCommunities = plantCommunities.length
  plantCommunities.map((pc, index) => {
    const {
      name,
      purposeOfAction: poa,
      aspect,
      elevation,
      url,
      approved,
      notes,
      communityType
    } = pc
    const communityTypeName = (communityType && communityType.name) || name
    const elevationName = elevation && elevation.name
    const purposeOfAction = capitalize(poa)

    const startYForVLine = currY
    const startPageForVLine = internal.getCurrentPageInfo().pageNumber

    currY = writeText({
      doc,
      text: `Plant Community: ${handleNullValue(communityTypeName)}`,
      x: startX + marginRight,
      y: currY,
      fontSize: fieldTitleFontSize + 0.5,
      fontStyle: 'bold',
      fontColor: primaryColor
    })
    currY += 5

    let sub = aspect || 'No aspect'
    if (elevationName) sub = `${sub}  |  ${elevationName} FT`
    if (approved) sub = `${sub}  |  Approved By Minister`
    currY = writeText({
      doc,
      text: sub,
      x: startX + marginRight,
      y: currY
    })
    currY += 7

    currY = writeFieldText(
      doc,
      'Pasture Notes',
      notes,
      startX + marginRight,
      currY,
      contentWidth - marginRight
    )
    currY += 7
    currY = writeFieldText(
      doc,
      'Plant Community URL',
      url,
      startX + marginRight,
      currY,
      contentWidth - marginRight
    )
    currY += 7
    currY = writeFieldText(
      doc,
      'Purpose of Actions',
      purposeOfAction,
      startX + marginRight,
      currY,
      contentWidth - marginRight
    )

    currY = writeMonitoringAreas(doc, currY, pc)
    currY = writePlantCommunityActions(doc, currY, pc)
    currY = writeCriteria(doc, currY, pc)

    drawVerticalLine(
      doc,
      startX + 2,
      startYForVLine,
      currY,
      startPageForVLine,
      internal.getCurrentPageInfo().pageNumber,
      0.7
    )

    currY += 10
    doc.addPage()

    currY = afterHeaderY
    return null
  })

  return currY
}
