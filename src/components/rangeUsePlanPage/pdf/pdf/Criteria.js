import React from 'react'
import Field from './common/Field'
import Row from './common/Row'
import SectionHeader from './common/SectionHeader'
import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { config } from './common/config'
import IndicatorPlants from './IndicatorPlants'
import moment from 'moment'
import ExplanatoryText from './common/ExplanatoryText'

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

    <ExplanatoryText>
      If more than one readiness criteria is provided, all such criteria must be
      met before grazing may occur
    </ExplanatoryText>

    <Row>
      <Field label="Readiness Date">
        {plantCommunity.rangeReadinessMonth &&
          plantCommunity.rangeReadinessDay &&
          moment()
            .set('month', plantCommunity.rangeReadinessMonth - 1)
            .set('date', plantCommunity.rangeReadinessDay)
            .format('MMMM D')}
      </Field>
    </Row>
    <Row>
      <Field label="Other">{plantCommunity.rangeReadinessNote}</Field>
    </Row>

    <IndicatorPlants
      indicatorPlants={plantCommunity.indicatorPlants}
      criteria="rangereadiness"
      valueLabel="Criteria (Leaf Stage)"
    />

    <Row>
      <SectionHeader style={styles.header}>Stubble Height</SectionHeader>
    </Row>

    <ExplanatoryText>
      Livestock must be removed on the first to occur of the date in the plan
      (ex. schedule), stubble height criteria or average browse criteria.
    </ExplanatoryText>

    <IndicatorPlants
      indicatorPlants={plantCommunity.indicatorPlants}
      criteria="stubbleheight"
      valueLabel="Height After Grazing (cm)"
    />

    <View wrap={false}>
      <Row>
        <SectionHeader style={styles.header}>Shrub Use</SectionHeader>
      </Row>

      <ExplanatoryText>
        Unless otherwise indicated above, shrub species may be browsed at 25% of
        current annual growth.
      </ExplanatoryText>
    </View>

    <Field label="% of Current Annual Growth">{plantCommunity.shrubUse}</Field>
  </View>
)

export default Criteria
