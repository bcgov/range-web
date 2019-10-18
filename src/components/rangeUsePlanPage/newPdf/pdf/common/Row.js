import React from 'react'
import { View } from '@react-pdf/renderer'

const Row = ({ children }) => (
  <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
    {children}
  </View>
)

export default Row
