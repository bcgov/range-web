import {
  formatGrazingSchedules,
  formatGrazingScheduleEntries,
  getGrazingScheduleEntrieHeader,
  handleNullValue
} from '../helper'
import {
  writeTitle,
  drawHorizontalLine,
  writeText,
  writeFieldText
} from './common'

export const writeGrazingSchedules = (doc, plan) => {
  const {
    tableMarginBottom,
    startX,
    afterHeaderY,
    primaryRGB,
    sectionTitleFontSize,
    grayColor,
    contentEndX
  } = doc.config

  //doc.addPage()
  let currY = afterHeaderY

  const grazingSchedules = formatGrazingSchedules(plan)
  const grazingScheduleEntrieHeader = getGrazingScheduleEntrieHeader()

  currY = writeTitle(doc, 'Schedules')

  if (grazingSchedules.length === 0) {
    currY += 2
    currY = writeText({
      doc,
      text: 'No schedule provided.',
      x: startX,
      y: currY + 0.5,
      fontColor: grayColor
    })
  }

  currY -= 2
  grazingSchedules.map(gs => {
    currY += 4
    const {
      year,
      narative,
      grazingScheduleEntries,
      authorizedAUMs,
      crownTotalAUMs
    } = gs
    currY = writeText({
      doc,
      text: `${year} Grazing Schedule`,
      x: startX,
      y: currY,
      fontSize: sectionTitleFontSize,
      fontStyle: 'bold'
    })

    const entries = formatGrazingScheduleEntries(grazingScheduleEntries)

    currY += 6
    doc.autoTable({
      startY: currY,
      headStyles: { fillColor: primaryRGB },
      margin: {
        top: afterHeaderY,
        bottom: tableMarginBottom
      },
      pageBreak: 'auto',
      showHead: 'firstPage',
      columns: grazingScheduleEntrieHeader,
      body: entries,
      didDrawPage: hookData => {
        // reset current height after drawing tables
        currY = hookData.cursor.y + 2
      }
    })

    currY = writeText({
      doc,
      text: `Authorized AUMs:  ${handleNullValue(
        authorizedAUMs,
        'N/P'
      )}   Total AUMs:  ${handleNullValue(crownTotalAUMs, 'N/P')}`,
      x: contentEndX - 0.5,
      y: currY,
      fontStyle: 'bold',
      hAlign: 'right'
    })

    currY += 6
    currY = writeFieldText(doc, 'Schedule Description', narative, startX, currY)
    currY += 8
    currY = drawHorizontalLine(doc, currY, 0.2)

    return null
  })

  return currY
}
