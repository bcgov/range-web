import React from 'react'
import Field from './common/Field'
import Line from './common/Line'
import Row from './common/Row'
import SectionHeader from './common/SectionHeader'
import PlantCommunity from './PlantCommunity'

const Pasture = ({ pasture }) => (
  <>
    <Row>
      <SectionHeader>Pasture: {pasture.name}</SectionHeader>
    </Row>

    <Row>
      <Field label="Allowable AUMs">{pasture.allowableAum}</Field>
      <Field label="Private Land Deduction">
        {pasture.pldPercent && `${pasture.pldPercent * 100}%`}
      </Field>
    </Row>

    <Row>
      <Field label="Pasture Notes (non legal content)">{pasture.notes}</Field>
    </Row>

    {pasture.plantCommunities.length > 0 && (
      <Row>
        <SectionHeader>Plant Communities: ({pasture.name})</SectionHeader>
      </Row>
    )}

    {pasture.plantCommunities.map((community, i) => (
      <React.Fragment key={community.id}>
        <PlantCommunity plantCommunity={community} />
        {i + 1 !== pasture.plantCommunities.length && <Line />}
      </React.Fragment>
    ))}
  </>
)

export default Pasture
