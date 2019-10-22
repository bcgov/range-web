import React from 'react'
import { View, Text, StyleSheet } from '@react-pdf/renderer'
import Row from './common/Row'
import { config } from './common/config'

const styles = StyleSheet.create({
  label: {
    flex: 1,
    color: config.blackColor,
    fontSize: config.normalFontSize + 1,
    marginBottom: 3
  },
  indicatorPlant: {
    flex: 1,
    marginBottom: 3
  }
})

const IndicatorPlants = ({ indicatorPlants, criteria }) => (
  <View>
    <Row>
      <Text style={styles.label}>Indicator Plant</Text>
      <Text style={styles.label}>Criteria (Leaf Stage)</Text>
    </Row>

    {indicatorPlants
      .filter(ip => ip.criteria === criteria)
      .map(indicatorPlant => (
        <Row key={indicatorPlant.id}>
          <Text style={styles.indicatorPlant}>
            {indicatorPlant.plantSpecies.name === 'Other'
              ? `${indicatorPlant.name} (Other)`
              : indicatorPlant.plantSpecies.name}
          </Text>
          <Text style={styles.indicatorPlant}>{indicatorPlant.value}</Text>
        </Row>
      ))}
  </View>
)

export default IndicatorPlants
