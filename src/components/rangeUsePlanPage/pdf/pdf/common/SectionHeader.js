import React from 'react'
import { Text, StyleSheet } from '@react-pdf/renderer'
import { config } from './config'

const styles = StyleSheet.create({
  sectionHeader: {
    fontWeight: 'bold',
    margin: '5px 0',
    flex: 1
  }
})

const SectionHeader = ({ children, secondary = false, style = {} }) => (
  <Text
    style={[
      styles.sectionHeader,
      {
        color: secondary ? config.primaryColor : config.blackColor,
        fontSize: secondary
          ? config.sectionTitleFontSize - 1
          : config.sectionTitleFontSize
      },
      style
    ]}>
    {children}
  </Text>
)

export default SectionHeader
