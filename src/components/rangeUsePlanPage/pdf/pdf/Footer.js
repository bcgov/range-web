import React from 'react'
import { View, StyleSheet, Text } from '@react-pdf/renderer'
import moment from 'moment'
import { config } from './common/config'

const styles = StyleSheet.create({
  footer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    fontFamily: config.fontFamily,
    fontSize: config.normalFontSize,
    bottom: 15,
    left: 50,
    right: 50,
    textAlign: 'left',
    color: config.grayColor,
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    paddingTop: 5
  }
})

const Footer = () => (
  <View style={styles.footer} fixed>
    <Text>
      Generated {moment().format(config.dateFormat)} by the MyRangeBC web
      application
    </Text>
    <Text
      fixed
      render={({ pageNumber, totalPages }) =>
        `Page ${pageNumber} of ${totalPages}`
      }
    />
  </View>
)

export default Footer
