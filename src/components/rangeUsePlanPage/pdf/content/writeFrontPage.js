import {
  formatDateFromServer,
  getClientFullName,
  findConfirmationWithClientId,
  getPDFStatus 
  
} from '../helper'


import { writeText } from './common'

export const writeFrontPage = (doc, plan, logoImage) => {
  const {
    halfPageWidth,
    fieldTitleFontSize,
    grayColor,
    primaryColor,
    sectionTitleFontSize
  } = doc.config
  const { agreement, confirmations } = plan
  const {
    forestFileId,
    clients,
    agreementStartDate: asd,
    agreementEndDate: aed
  } = agreement || {}

  let currY = 25
  const margin = 32
  const divide = 7
  const imageW = 600 / divide
  doc.addImage(
    logoImage,
    'PNG',
    halfPageWidth - imageW / 2,
    currY,
    imageW,
    214 / divide
  )
  currY += 50

  writeText({
    doc,
    text: 'Range Use Plan\n\nSTATUS: ' + getPDFStatus(plan.status) + '\n',
    x: halfPageWidth,
    y: currY,
    fontSize: sectionTitleFontSize + 9,
    fontStyle: 'bold',
    fontColor: primaryColor,
    hAlign: 'center'
  })
  currY += 40

  writeText({
    doc,
    text: `${forestFileId}`,
    x: halfPageWidth,
    y: currY,
    fontSize: sectionTitleFontSize + 1,
    fontStyle: 'bold',
    hAlign: 'center'
  })
  currY += 8

  writeText({
    doc,
    text: `${formatDateFromServer(asd)} - ${formatDateFromServer(aed)}`,
    x: halfPageWidth,
    y: currY,
    fontSize: sectionTitleFontSize + 1,
    fontColor: grayColor,
    hAlign: 'center'
  })
  currY += margin

  writeText({
    doc,
    text: 'Confirmed by Agreement Holder(s):',
    x: halfPageWidth,
    y: currY,
    fontSize: sectionTitleFontSize + 1,
    fontStyle: 'bold',
    hAlign: 'center'
  })
  currY += 8

  clients.map(client => {
    let confirmationDate = 'Awaiting Signature'
    const confirmation = findConfirmationWithClientId(client.id, confirmations)
    if (confirmation && confirmation.confirmed) {
      confirmationDate = formatDateFromServer(confirmation.updatedAt)
    }

    writeText({
      doc,
      text: `${getClientFullName(client)} - ${confirmationDate}`,
      x: halfPageWidth,
      y: currY,
      fontSize: sectionTitleFontSize + 1,
      fontColor: grayColor,
      hAlign: 'center'
    })
    currY += 7

    return null
  })
  currY += margin - 7

  writeText({
    doc,
    text: 'Confirmed by District Manager:',
    x: halfPageWidth,
    y: currY,
    fontSize: sectionTitleFontSize + 1,
    fontStyle: 'bold',
    hAlign: 'center'
  })
  currY += 25

  const halfOfLineW = 25
  const interval = 5
  const fromCenterToStartLength = halfOfLineW * 3 + interval
  doc.setLineWidth(0.3).setDrawColor(primaryColor)
  doc.line(
    halfPageWidth - fromCenterToStartLength,
    currY,
    halfPageWidth - halfOfLineW - interval,
    currY
  )
  writeText({
    doc,
    text: 'Printed Name',
    x: halfPageWidth - fromCenterToStartLength + halfOfLineW,
    y: currY + 3,
    fontSize: fieldTitleFontSize,
    hAlign: 'center'
  })

  doc.line(
    halfPageWidth - halfOfLineW,
    currY,
    halfPageWidth + halfOfLineW,
    currY
  )
  writeText({
    doc,
    text: 'Signature',
    x: halfPageWidth,
    y: currY + 3,
    fontSize: fieldTitleFontSize,
    hAlign: 'center'
  })

  doc.line(
    halfPageWidth + halfOfLineW + interval,
    currY,
    halfPageWidth + fromCenterToStartLength,
    currY
  )
  writeText({
    doc,
    text: 'Date',
    x: halfPageWidth + fromCenterToStartLength - halfOfLineW,
    y: currY + 3,
    fontSize: fieldTitleFontSize,
    hAlign: 'center'
  })
}
