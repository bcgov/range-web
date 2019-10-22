import React from 'react'
import { Text, StyleSheet } from '@react-pdf/renderer'
import { config } from './config'

const styles = StyleSheet.create({
  label: {
    flex: 1,
    color: config.blackColor,
    fontSize: config.normalFontSize + 1,
    marginBottom: 3,
    fontWeight: 'bold'
  }
})

const Label = ({ children, style = {} }) => (
  <Text style={[styles.label, style]}>{children}</Text>
)

export default Label
