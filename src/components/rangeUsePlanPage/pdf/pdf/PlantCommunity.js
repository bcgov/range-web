import React from 'react'
import { StyleSheet, View, Link } from '@react-pdf/renderer'
import Field from './common/Field'
import { config } from './common/config'
import { capitalize } from '../helper'
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

const PlantCommunity = ({ plantCommunity }) => {
  const description = [
    plantCommunity.aspect && `Aspect: ${plantCommunity.aspect}`,
    plantCommunity.elevation && `Elevation: ${plantCommunity.elevation.name} m`
  ]
    .filter(d => typeof d === 'string')
    .join(' | ')

  const communityType =
    plantCommunity.communityType && plantCommunity.communityType.name
  return (
    <View style={styles.container}>
      <Row>
        <SectionHeader secondary>
          Plant community: {communityType}
        </SectionHeader>
      </Row>

      {description ? (
        <Row>
          <Field>{description}</Field>
        </Row>
      ) : null}

      <Row>
        <Field label="Plant Community Description">
          {plantCommunity.notes}
        </Field>
      </Row>
      <Row>
        <Field label="Plant Community URL">
          <Link src={plantCommunity.url}>{plantCommunity.url}</Link>
        </Field>
      </Row>
      <Row>
        <Field label="Purpose of Actions">
          {capitalize(plantCommunity.purposeOfAction)}
        </Field>
      </Row>

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
