import React from 'react'
import { Text, StyleSheet } from '@react-pdf/renderer'
import { config } from './config'

const styles = StyleSheet.create({
  text: {
    fontSize: config.normalFontSize + 1,
    color: config.blackColor,
    fontStyle: 'italic',
    marginBottom: 5
  }
})

const ExplanatoryText = ({ children }) => (
  <Text style={styles.text}>{children}</Text>
)

export default ExplanatoryText
