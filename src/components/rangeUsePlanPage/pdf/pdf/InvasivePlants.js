import React from 'react'
import { Page, StyleSheet, Text } from '@react-pdf/renderer'
import Footer from './Footer'
import Header from './Header'
import Title from './common/Title'
import { config } from './common/config'
import Subtext from './common/Subtext'

const styles = StyleSheet.create({
  page: {
    padding: 50,
    paddingTop: 70,
    fontFamily: config.fontFamily,
    fontSize: config.normalFontSize + 1
  },
  listItem: {
    display: 'block',
    marginBottom: 10,
    paddingLeft: 10,
    borderLeftColor: config.accentColor,
    borderLeftWidth: 2
  },
  subtext: {
    marginBottom: 10
  }
})

const InvasivePlants = ({ plan }) => (
  <Page size="A4" style={styles.page} wrap>
    <Header plan={plan} />
    <Title>Invasive Plants</Title>

    <Subtext style={styles.subtext}>
      I commit to carry out the following measures to prevent the introduction
      or spread of invasive plants that are likely the result of my range
      practices:
    </Subtext>

    {plan.invasivePlantChecklist.equipmentAndVehiclesParking && (
      <Text style={styles.listItem}>
        Equipment and vehicles will not be parked on invasive plant infestations
      </Text>
    )}

    {plan.invasivePlantChecklist.beginInUninfestedArea && (
      <Text style={styles.listItem}>
        Any work will being in un-infested areas before moving to infested
        locations
      </Text>
    )}

    {plan.invasivePlantChecklist.undercarrigesInspected && (
      <Text style={styles.listItem}>
        Clothing and vehicle/equipment undercarriages will be regularly
        inspected for plant parts or propagules if working in an area known to
        contain invasive plants
      </Text>
    )}
    {plan.invasivePlantChecklist.revegetate && (
      <Text style={styles.listItem}>
        Revegetate disturbed areas that have exposed mineral soil within one
        year of disturbance by seeding using Common #1 Forage Mixture or better.
        The certificate of seed analysis will be requested and seed that
        contains weed seeds of listed invasive plants and/or invasive plants
        that are high priority to the area will be rejected. Seeding will occur
        around range developments and areas of cattle congregation where bare
        soil is exposed. Revegetated areas will be monitored and revegetated as
        necessary until exposed soil is eliminated.
      </Text>
    )}
    {plan.invasivePlantChecklist.other ? (
      <Text style={styles.listItem}>
        Other: {plan.invasivePlantChecklist.other.toString()}
      </Text>
    ) : null}

    <Footer />
  </Page>
)

export default InvasivePlants
