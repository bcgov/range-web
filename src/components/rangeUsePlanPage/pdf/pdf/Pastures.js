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
    padding: config.pagePadding,
    fontFamily: config.fontFamily,
    fontSize: config.normalFontSize
  }
})

const Pastures = ({ plan }) => (
  <Page size="A4" style={styles.page} wrap>
    <Header plan={plan} />
    <Title>Pastures</Title>

    {plan.pastures.map((pasture, i) => (
      <React.Fragment key={pasture.id}>
        <Pasture pasture={pasture} plan={plan} />
        {i + 1 < plan.pastures.length && (
          <Line color={config.primaryColor} height={20} />
        )}
      </React.Fragment>
    ))}

    <Footer />
  </Page>
)

export default Pastures
