import React from 'react'
import { View, Page, StyleSheet, Text } from '@react-pdf/renderer'
import Footer from './Footer'
import Header from './Header'
import Title from './common/Title'
import { config } from './common/config'
import Subtext from './common/Subtext'
import { handleNullValue } from '../../pdf/helper'
import Label from './common/Label'
import Row from './common/Row'

const styles = StyleSheet.create({
  page: {
    padding: 50,
    paddingTop: 70,
    fontFamily: config.fontFamily,
    fontSize: config.normalFontSize
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    marginBottom: 5
  },
  category: {},
  details: {}
})

const AdditionalRequirements = ({ plan }) => (
  <Page size="A4" style={styles.page} wrap>
    <Header plan={plan} />

    <Title>Additional Requirements</Title>

    <Subtext>
      Other direction or agreements with which this Range Use Plan must be
      consistent.
    </Subtext>
    <Row>
      <Label>Category</Label>
      <Label style={{ flex: 2 }}>Details</Label>
    </Row>

    {plan.additionalRequirements.map(requirement => (
      <View style={styles.container} key={requirement.id}>
        <Subtext style={{ flex: 1 }}>
          {handleNullValue(requirement.category && requirement.category.name)}
        </Subtext>
        <View style={{ flex: 2 }}>
          <Subtext>{handleNullValue(requirement.detail)}</Subtext>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-end'
            }}>
            <Text style={{ fontWeight: 'bold', marginRight: 5 }}>URL:</Text>
            <Text
              style={{
                color: config.grayColor,
                fontSize: config.normalFontSize + 1
              }}>
              {requirement.url}
            </Text>
          </View>
        </View>
      </View>
    ))}

    {plan.additionalRequirements.length <= 0 && (
      <Text>No additional requirements provided</Text>
    )}

    <Footer />
  </Page>
)

export default AdditionalRequirements
