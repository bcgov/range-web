import React from 'react'
import { Page, StyleSheet, Text } from '@react-pdf/renderer'
import Footer from './Footer'
import Header from './Header'
import Title from './common/Title'
import { config } from './common/config'
import Table from './common/Table'
import Subtext from './common/Subtext'
import moment from 'moment'
import { formatGrazingSchedules } from '../helper'
import SectionHeader from './common/SectionHeader'
import Row from './common/Row'
import Field from './common/Field'
import Line from './common/Line'

const styles = StyleSheet.create({
  page: {
    padding: config.pagePadding,
    fontFamily: config.fontFamily,
    fontSize: config.normalFontSize
  }
})

const Schedules = ({ plan }) => {
  const schedules = formatGrazingSchedules(plan)

  return (
    <Page size="A4" style={styles.page}>
      <Header plan={plan} />

      <Title>Schedules</Title>

      {schedules.length > 0 ? (
        schedules.map((schedule, i) => (
          <React.Fragment key={schedule.id}>
            <Row>
              <SectionHeader>{schedule.year} Schedule</SectionHeader>
            </Row>
            <Table>
              <Table.Header>
                <Table.HeaderCell>Pasture</Table.HeaderCell>
                <Table.HeaderCell>Livestock Type</Table.HeaderCell>
                <Table.HeaderCell># of Animals</Table.HeaderCell>
                <Table.HeaderCell>Date in</Table.HeaderCell>
                <Table.HeaderCell>Date out</Table.HeaderCell>
                <Table.HeaderCell>Days</Table.HeaderCell>
                <Table.HeaderCell>Grace Days</Table.HeaderCell>
                <Table.HeaderCell>PLD</Table.HeaderCell>
                <Table.HeaderCell>Crown AUMs</Table.HeaderCell>
              </Table.Header>
              <Table.Body>
                {schedule.grazingScheduleEntries.map(entry => (
                  <Table.Row key={entry.id}>
                    <Table.Cell>
                      {entry.pasture ? entry.pasture.name : 'N/P'}
                    </Table.Cell>
                    <Table.Cell>{entry.livestockType.name}</Table.Cell>
                    <Table.Cell>{entry.livestockCount}</Table.Cell>
                    <Table.Cell>
                      {moment(entry.dateIn).format('MMM DD')}
                    </Table.Cell>
                    <Table.Cell>
                      {moment(entry.dateOut).format('MMM DD')}
                    </Table.Cell>
                    <Table.Cell>{entry.days}</Table.Cell>
                    <Table.Cell>{entry.graceDays || 'N/P'}</Table.Cell>
                    <Table.Cell>{entry.pldAUMs}</Table.Cell>
                    <Table.Cell>{entry.crownAUMs}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <Row
              style={{
                justifyContent: 'flex-end',
                fontWeight: 'bold',
                marginTop: 5
              }}>
              <Text style={{ marginRight: 10 }}>
                Authorized AUMs: {schedule.authorizedAUMs}
              </Text>
              <Text>Total AUMs: {schedule.crownTotalAUMs}</Text>
            </Row>
            <Row>
              <Text>
                Schedule description is optional but if included is legal
                content
              </Text>
            </Row>
            <Row>
              <Field label="Schedule Description">{schedule.narative}</Field>
            </Row>
            {i + 1 !== schedules.length && <Line color={config.primaryColor} />}
          </React.Fragment>
        ))
      ) : (
        <Subtext>No schedule provided</Subtext>
      )}

      <Footer />
    </Page>
  )
}
export default Schedules
