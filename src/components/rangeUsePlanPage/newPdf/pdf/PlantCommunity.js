import React from 'react'
import { Page, Text, StyleSheet, View } from '@react-pdf/renderer'
import Footer from './Footer'
import moment from 'moment'
import Header from './Header'
import Title from './common/Title'
import Field from './common/Field'
import Line from './common/Line'
import { config } from './common/config'
import {
  getAgreementType,
  getDistrict,
  getUserFullName,
  getAgreementExemptionStatus,
  getClientFullName,
  getContactRole,
  capitalize
} from '../../pdf/helper'
import Row from './common/Row'
import SectionHeader from './common/SectionHeader'
import MonitoringArea from './MonitoringArea'
import PlantCommunityActions from './PlantCommunityActions'
import Criteria from './Criteria'

const styles = StyleSheet.create({
  container: {
    borderLeftColor: config.accentColor,
    borderLeftWidth: 2,
    marginLeft: 5,
    paddingLeft: 5
  }
})

const PlantCommunity = ({ plan, plantCommunity }) => {
  const communityType =
    (plantCommunity.communityType && plantCommunity.communityType.name) ||
    'Not provided'
  return (
    <View style={styles.container}>
      <Row>
        <SectionHeader secondary>
          Plant community: {communityType}
        </SectionHeader>
      </Row>

      <Field>
        {plantCommunity.aspect || 'No aspect'}
        {plantCommunity.elevation && ` | ${plantCommunity.elevation.name} FT`}
        {plantCommunity.approved && ' | Approved By Minister'}
      </Field>

      <Field label="Pasture Notes">{plantCommunity.notes}</Field>
      <Field label="Plant Community URL">{plantCommunity.url}</Field>
      <Field label="Purpose of Actions">
        {capitalize(plantCommunity.purposeOfAction)}
      </Field>

      {plantCommunity.monitoringAreas.length > 0 && (
        <>
          <Row>
            <SectionHeader style={{ fontWeight: 'normal' }} secondary>
              Monitoring Areas ({communityType})
            </SectionHeader>
          </Row>

          {plantCommunity.monitoringAreas.map(area => (
            <MonitoringArea monitoringArea={area} key={area.id} />
          ))}
        </>
      )}

      {plantCommunity.plantCommunityActions.length > 0 && (
        <>
          <Row>
            <SectionHeader style={{ fontWeight: 'normal' }} secondary>
              Plant Community Actions ({communityType})
            </SectionHeader>
          </Row>

          <PlantCommunityActions
            actions={plantCommunity.plantCommunityActions}
          />
        </>
      )}

      <Row>
        <SectionHeader style={{ fontWeight: 'normal' }} secondary>
          Criteria ({communityType})
        </SectionHeader>
      </Row>

      <Criteria plantCommunity={plantCommunity} />
    </View>
  )
}

export default PlantCommunity
