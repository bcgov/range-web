import React from 'react'
import { StyleSheet, Text } from '@react-pdf/renderer'
import { config } from './config'

const styles = StyleSheet.create({
  subtext: {
    color: config.grayColor,
    fontSize: config.normalFontSize + 1,
    margin: '5px 0'
  }
})

const Subtext = ({ children, style }) => (
  <Text style={[styles.subtext, style]}>{children}</Text>
)

export default Subtext
