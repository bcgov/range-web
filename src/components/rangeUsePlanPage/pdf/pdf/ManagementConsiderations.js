import React from 'react'
import { View, Page, StyleSheet, Text } from '@react-pdf/renderer'
import Footer from './Footer'
import Header from './Header'
import Title from './common/Title'
import { config } from './common/config'
import Subtext from './common/Subtext'
import { handleNullValue } from '../helper'
import Label from './common/Label'
import Row from './common/Row'
import ExplanatoryText from './common/ExplanatoryText'

const styles = StyleSheet.create({
  page: {
    padding: config.pagePadding,
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

const ManagementConsiderations = ({ plan }) => {
  if (plan.managementConsiderations.length <= 0) return null
  return (
    <Page size="A4" style={styles.page} wrap>
      <Header plan={plan} />

      <Title>Management Considerations</Title>

      <ExplanatoryText>
        Content in this section is non-legal and is intended to provide
        additional information about management within the agreement area.
      </ExplanatoryText>
      <Row>
        <Label>Considerations</Label>
        <Label style={{ flex: 2 }}>Details</Label>
      </Row>

      {plan.managementConsiderations.map(consideration => (
        <View style={styles.container} key={consideration.id}>
          <Subtext style={{ flex: 1 }}>
            {handleNullValue(
              consideration.category && consideration.category.name
            )}
          </Subtext>
          <View style={{ flex: 2 }}>
            <Subtext>{handleNullValue(consideration.detail)}</Subtext>
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
                {handleNullValue(consideration.url)}
              </Text>
            </View>
          </View>
        </View>
      ))}

      <Footer />
    </Page>
  )
}

export default ManagementConsiderations
