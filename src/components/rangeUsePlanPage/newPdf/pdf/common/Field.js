import React from 'react'
import { Text, StyleSheet, View } from '@react-pdf/renderer'
import { config } from './config'

const styles = StyleSheet.create({
  field: {
    fontFamily: 'Lato',
    fontSize: config.normalFontSize,
    marginBottom: 5,
    flex: 1
  },
  label: {
    marginBottom: 2
  },
  value: {
    color: config.grayColor,
    margin: 0
  }
})

const Field = ({ children, label }) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{children || 'Not provided'}</Text>
  </View>
)

export default Field
