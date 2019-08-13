import { writeTitle, drawHorizontalLine, writeText } from './common'

export const writeManagementConsiderations = (doc, plan) => {
  const {
    startX,
    afterHeaderY,
    fieldTitleFontSize,
    halfPageWidth,
    contentWidth,
    grayColor
  } = doc.config

  const { managementConsiderations } = plan
  if (managementConsiderations && managementConsiderations.length === 0) {
    return null
  }

  doc.addPage()
  let currY = afterHeaderY

  const marginBottom = 6
  const detailStartX = halfPageWidth - 60
  let momentCurrY

  currY = writeTitle(doc, 'Management Considerations')
  currY += 2

  currY = writeText({
    doc,
    text:
      'Content in this section is non-legal and is intended to provide additional information about management within the agreement area.',
    x: startX,
    y: currY,
    fontColor: grayColor
  })
  currY += marginBottom

  momentCurrY = currY
  currY = Math.max(
    writeText({
      doc,
      text: 'Considerations',
      x: startX,
      y: momentCurrY,
      fontSize: fieldTitleFontSize,
      fontStyle: 'bold'
    }),
    writeText({
      doc,
      text: 'Details',
      x: startX + detailStartX,
      y: momentCurrY,
      fontSize: fieldTitleFontSize,
      fontStyle: 'bold'
    })
  )
  currY += marginBottom

  managementConsiderations.map(mc => {
    const { detail, url, considerationType } = mc
    const considerationTypeName = considerationType && considerationType.name

    momentCurrY = currY
    currY = Math.max(
      writeText({
        doc,
        text: considerationTypeName,
        x: startX,
        y: momentCurrY,
        fontSize: fieldTitleFontSize,
        fontColor: grayColor,
        cusContentWidth: detailStartX - 5
      }),
      writeText({
        doc,
        text: detail,
        x: startX + detailStartX,
        y: momentCurrY,
        fontSize: fieldTitleFontSize,
        fontColor: grayColor,
        cusContentWidth: contentWidth - detailStartX - 1
      })
    )
    currY += marginBottom

    writeText({
      doc,
      text: 'URL: ',
      x: startX + detailStartX,
      y: currY,
      fontSize: fieldTitleFontSize,
      fontStyle: 'bold',
      cusContentWidth: contentWidth - detailStartX
    })
    currY = writeText({
      doc,
      text: url,
      x: startX + detailStartX + 11,
      y: currY,
      fontSize: fieldTitleFontSize,
      fontColor: grayColor,
      cusContentWidth: contentWidth - detailStartX - 11
    })
    currY += 8

    return null
  })

  currY = drawHorizontalLine(doc, currY, 0.2)
  currY += 3

  return currY
}
