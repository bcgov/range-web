import React from 'react'
import { Page, StyleSheet } from '@react-pdf/renderer'
import Footer from './Footer'
import Header from './Header'
import Title from './common/Title'
import { config } from './common/config'
import Pasture from './Pasture'
import Line from './common/Line'

const styles = StyleSheet.create({
  page: {
    padding: 50,
    paddingTop: 70,
    fontFamily: config.fontFamily,
    fontSize: config.normalFontSize
  }
})

const Pastures = ({ plan }) => (
  <Page size="A4" style={styles.page} wrap>
    <Header plan={plan} />
    <Title>Pastures</Title>

    {plan.pastures.map((pasture, i) => (
      <>
        <Pasture key={pasture.id} pasture={pasture} plan={plan} />
        {i + 1 < plan.pastures.length && (
          <Line color={config.primaryColor} height={20} />
        )}
      </>
    ))}

    <Footer />
  </Page>
)

export default Pastures
