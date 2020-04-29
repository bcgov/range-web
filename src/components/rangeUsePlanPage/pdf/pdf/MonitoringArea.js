import React from 'react'
import Field from './common/Field'
import Row from './common/Row'
import SectionHeader from './common/SectionHeader'
import Section from './common/Section'
import { getMonitoringAreaPurposes } from '../helper'

const MonitoringArea = ({ monitoringArea }) => (
  <Section primary>
    <Row>
      <SectionHeader>Monitoring Area: {monitoringArea.name}</SectionHeader>
    </Row>

    <Row>
      <Field label="Location">{monitoringArea.location}</Field>
    </Row>

    <Row>
      <Field label="Latitude/Longitude">
        {monitoringArea.latitude}/{monitoringArea.longitude}
      </Field>
    </Row>

    <Row>
      <Field label="Rangeland Health">
        {monitoringArea.rangelandHealth?.name}
      </Field>
    </Row>

    <Row>
      <Field label="Purposes">
        {getMonitoringAreaPurposes(monitoringArea.purposes)}
      </Field>
    </Row>
  </Section>
)

export default MonitoringArea
