import React from 'react'
import { Text, StyleSheet } from '@react-pdf/renderer'
import { config } from './config'

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: config.sectionTitleFontSize,
    fontWeight: 'bold',
    margin: '5px 0',
    flex: 1
  }
})

const SectionHeader = ({ children }) => (
  <Text style={styles.sectionHeader}>{children}</Text>
)

export default SectionHeader
