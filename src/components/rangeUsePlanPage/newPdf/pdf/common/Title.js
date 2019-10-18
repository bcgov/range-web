import React from 'react'
import { Text, StyleSheet } from '@react-pdf/renderer'
import { config } from './config'

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Lato',
    fontSize: config.sectionTitleFontSize + 3,
    fontWeight: 'bold',
    width: '100%',
    borderBottomWidth: 2,
    borderBottomColor: config.primaryColor,
    paddingBottom: 4
  }
})

const Title = ({ children }) => <Text style={styles.title}>{children}</Text>

export default Title
