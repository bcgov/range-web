import React from 'react'
import Row from './common/Row'
import { StyleSheet, Text, View } from '@react-pdf/renderer'
import moment from 'moment'
import { config } from './common/config'

const styles = StyleSheet.create({
  container: {
    fontSize: config.normalFontSize + 1
  },
  label: {
    fontWeight: 'bold',
    flex: 1,
    marginBottom: 5
  },
  detailsLabel: {
    flex: 2
  },
  detailsSection: {
    flex: 2
  },
  details: {
    marginBottom: 2,
    color: config.grayColor
  },
  bold: {
    fontWeight: 'bold'
  },
  action: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 15
  },
  grazePeriod: {
    color: config.grayColor,
    marginLeft: 4
  },
  actionType: {
    flex: 1,
    color: config.grayColor
  }
})

const PlantCommunityActions = ({ actions }) => (
  <View style={styles.container}>
    <Row>
      <Text style={styles.label}>Action</Text>
      <Text style={[styles.label, styles.detailsLabel]}>Details</Text>
    </Row>

    {actions.map(action => (
      <View key={action.id} style={styles.action}>
        <Text style={styles.actionType}>
          {action.actionType.name === 'Other'
            ? `${action.name} (Other)`
            : action.actionType.name}
        </Text>
        <View style={styles.detailsSection}>
          <Text style={styles.details}>{action.details}</Text>
          <Row>
            <Text style={styles.bold}>No Graze Period: </Text>
            <Text style={styles.grazePeriod}>
              {action.noGrazeStartMonth && action.noGrazeStartDay
                ? moment()
                    .set('month', action.noGrazeStartMonth)
                    .set('date', action.noGrazeStartDay)
                    .format('MMMM Do')
                : 'Not Provided'}{' '}
              -{' '}
              {action.noGrazeEndMonth && action.noGrazeEndDay
                ? moment()
                    .set('month', action.noGrazeEndMonth)
                    .set('date', action.noGrazeEndDay)
                    .format('MMMM Do')
                : 'Not Provided'}
            </Text>
          </Row>
        </View>
      </View>
    ))}
  </View>
)

export default PlantCommunityActions
