import React from 'react'
import { Text, StyleSheet, View } from '@react-pdf/renderer'
import { config } from './config'

const styles = StyleSheet.create({
  field: {
    fontFamily: 'Lato',
    fontSize: config.normalFontSize + 1,
    marginBottom: 8,
    flex: 1
  },
  label: {
    marginBottom: 1,
    color: config.blackColor
  },
  value: {
    color: config.grayColor,
    fontSize: config.normalFontSize,
    margin: 0
  }
})

const Field = ({ children, label, style }) => (
  <View style={[styles.field, style]}>
    {label && <Text style={styles.label}>{label}</Text>}
    <Text style={styles.value}>{children || 'Not provided'}</Text>
  </View>
)

export default Field
