import React from 'react'
import { View, StyleSheet, Text } from '@react-pdf/renderer'
import { config } from './config'

const specialCharsRegex = /-|_/g
const insertSoftHyphens = string =>
  string.replace(specialCharsRegex, match => `\u00ad${match}`)

const styles = StyleSheet.create({
  table: {
    width: '100%'
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: config.primaryColor,
    color: '#fff',
    padding: 3
  },
  headerCell: {
    fontWeight: 'heavy',
    white: '#fff',
    width: '11.11%',
    fontSize: config.normalFontSize
  },
  body: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f5f5f5'
  },
  cell: {
    width: '11.11%'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px 3px'
  }
})

const Table = ({ children }) => <View style={styles.table}>{children}</View>

const TableHeader = ({ children }) => (
  <View style={styles.header}>{children}</View>
)

const TableHeaderCell = ({ children }) => (
  <Text style={styles.headerCell}>{children}</Text>
)

const TableBody = ({ children }) => <View style={styles.body}>{children}</View>

const TableRow = ({ children }) => <View style={styles.row}>{children}</View>

const TableCell = ({ children }) => (
  <Text style={styles.cell}>
    {typeof children === 'string' ? insertSoftHyphens(children) : children}
  </Text>
)

Table.Header = TableHeader
Table.Body = TableBody
Table.Row = TableRow
Table.HeaderCell = TableHeaderCell
Table.Cell = TableCell

export default Table
