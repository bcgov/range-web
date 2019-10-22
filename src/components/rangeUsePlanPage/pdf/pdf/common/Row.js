import React from 'react'
import { View } from '@react-pdf/renderer'

const Row = ({ children, style }) => (
  <View
    style={[{ display: 'flex', flexDirection: 'row', width: '100%' }, style]}>
    {children}
  </View>
)

export default Row
