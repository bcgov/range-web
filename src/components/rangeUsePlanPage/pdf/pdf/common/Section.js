import React from 'react'
import { View, StyleSheet } from '@react-pdf/renderer'
import { config } from './config'

const styles = StyleSheet.create({
  section: {
    borderLeftColor: config.accentColor,
    borderLeftWidth: 2,
    marginLeft: 5,
    paddingLeft: 5
  }
})

const Section = ({ children, primary = false, style }) => (
  <View
    style={[
      styles.section,
      { borderLeftColor: primary ? config.primaryColor : config.accentColor },
      style
    ]}>
    {children}
  </View>
)

export default Section
