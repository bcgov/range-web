import React from 'react'
import Field from './common/Field'
import Row from './common/Row'
import SectionHeader from './common/SectionHeader'
import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { config } from './common/config'
import IndicatorPlants from './IndicatorPlants'
import moment from 'moment'

const styles = StyleSheet.create({
  container: {
    color: config.grayColor,
    fontSize: config.normalFontSize
  },
  subtext: {
    color: config.grayColor,
    fontSize: config.normalFontSize + 1,
    marginBottom: 5
  },
  label: {
    flex: 1,
    color: config.blackColor,
    fontSize: config.normalFontSize + 1,
    marginBottom: 3
  },
  header: {
    fontSize: config.sectionTitleFontSize - 2
  }
})

const Criteria = ({ plantCommunity }) => (
  <View style={styles.container}>
    <Row>
      <SectionHeader style={styles.header}>Range Readiness</SectionHeader>
    </Row>

    <Text style={styles.subtext}>
      If more than one readiness criteria is provided, all such criteria must be
      met before grazing may occur
    </Text>

    <Row>
      <Field label="Readiness Date">
        {moment()
          .set('month', plantCommunity.rangeReadinessMonth - 1)
          .set('date', plantCommunity.rangeReadinessDay)
          .format('MMMM D')}
      </Field>
      <Field label="Notes">{plantCommunity.notes}</Field>
    </Row>

    <IndicatorPlants
      indicatorPlants={plantCommunity.indicatorPlants}
      criteria="rangereadiness"
    />

    <Row>
      <SectionHeader style={styles.header}>Stubble Height</SectionHeader>
    </Row>

    <Text style={styles.subtext}>
      Livestock must be removed on the first to occur of the date in the plan
      (ex. schedule), stubble height criteria or average browse criteria.
    </Text>

    <IndicatorPlants
      indicatorPlants={plantCommunity.indicatorPlants}
      criteria="stubbleheight"
    />

    <Row>
      <SectionHeader style={styles.header}>Shrub Use</SectionHeader>
    </Row>

    <Text style={styles.subtext}>
      Unless otherwise indicated above, shrub species may be browsed at 25% of
      current annual growth.
    </Text>

    <Field label="% of Current Annual Growth">{plantCommunity.shrubUse}</Field>
  </View>
)

export default Criteria
