import React from 'react'
import { Document, Font } from '@react-pdf/renderer'
import FrontPage from './FrontPage'
import BasicInformation from './BasicInformation'
import Pastures from './Pastures'
import Schedules from './Schedules'
import MinisterIssues from './MinisterIssues'
import AdditionalRequirements from './AdditionalRequirements'
import InvasivePlants from './InvasivePlants'

import latoRegular from './fonts/Lato-Regular.ttf'
import latoItalic from './fonts/Lato-Italic.ttf'
import latoBold from './fonts/Lato-Bold.ttf'
import latoBlack from './fonts/Lato-Black.ttf'

Font.register({
  family: 'Lato',
  fonts: [
    { src: latoRegular },
    { src: latoItalic, fontStyle: 'italic' },
    { src: latoBold, fontWeight: 'bold' },
    { src: latoBlack, fontWeight: 'heavy' }
  ]
})

const RUPDocument = ({ plan }) => (
  <Document title={`Range Use Plan - ${plan.agreement.id}`}>
    <FrontPage plan={plan} />
    <BasicInformation plan={plan} />
    <Pastures plan={plan} />
    <Schedules plan={plan} />
    <MinisterIssues plan={plan} />
    <InvasivePlants plan={plan} />
    <AdditionalRequirements plan={plan} />
  </Document>
)

export default RUPDocument
