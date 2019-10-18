import React from 'react'
import { Page, Text, StyleSheet } from '@react-pdf/renderer'
import Footer from './Footer'
import moment from 'moment'
import Header from './Header'
import Title from './common/Title'
import Field from './common/Field'
import Line from './common/Line'
import { config } from './common/config'
import {
  getAgreementType,
  getDistrict,
  getUserFullName,
  getAgreementExemptionStatus,
  getClientFullName,
  getContactRole
} from '../../pdf/helper'
import Row from './common/Row'
import SectionHeader from './common/SectionHeader'

const styles = StyleSheet.create({
  page: {
    padding: 50,
    paddingTop: 70,
    fontFamily: config.fontFamily,
    fontSize: config.normalFontSize
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%'
  },
  section: {
    flex: 1
  }
})

const BasicInformation = ({ plan }) => (
  <Page size="A4" style={styles.page}>
    <Header plan={plan} />
    <Title>Basic Information</Title>

    <Row>
      <SectionHeader>Agreement Information</SectionHeader>
      <SectionHeader>Contact Information</SectionHeader>
    </Row>

    <Row>
      <Field label="RAN">{plan.agreement.id}</Field>
      <Field label="District (Responsible)">
        {getDistrict(plan.agreement.zone)}
      </Field>
    </Row>

    <Row>
      <Field label="Agreement Type">
        {getAgreementType(plan.agreement.agreementType)}
      </Field>
      <Field label="Zone">{plan.agreement.zone.code}</Field>
    </Row>

    <Row>
      <Field label="Agreement Date">
        {moment(plan.agreement.agreementStartDate).format('MMMM DD, YYYY')} -{' '}
        {moment(plan.agreement.agreementEndDate).format('MMMM DD, YYYY')}
      </Field>
      <Field label="Contact Name">
        {getUserFullName(plan.agreement.zone.user)}
      </Field>
    </Row>

    <Row>
      <Field label="Range Name">{plan.rangeName}</Field>
      <Field label="Contact Phone">
        {plan.agreement.zone.user.phoneNumber}
      </Field>
    </Row>

    <Row>
      <Field label="Alternative Business Name">{plan.altBusinessName}</Field>
      <Field label="Contact Email">{plan.agreement.zone.user.email}</Field>
    </Row>

    <Line color={config.primaryColor} />

    <Row>
      <SectionHeader>Plan Information</SectionHeader>
    </Row>

    <Row>
      <Field label="Plan Start Date">
        {moment(plan.planStartDate).format(config.dateFormat)}
      </Field>
      <Field label="Plan End Date">
        {moment(plan.planEndDate).format(config.dateFormat)}
      </Field>
    </Row>

    <Row>
      <Field label="Extended">{plan.extension}</Field>
      <Field label="Exemption Status">
        {getAgreementExemptionStatus(plan.agreement)}
      </Field>
    </Row>

    <Line color={config.primaryColor} />

    <Row>
      <SectionHeader>Agreement Holders</SectionHeader>
    </Row>

    {plan.agreement.clients.map(client => (
      <Row key={client.id}>
        <Field label="Name">{getClientFullName(client)}</Field>
        <Field label="Type">{getContactRole(client)}</Field>
      </Row>
    ))}

    <Footer />
  </Page>
)

export default BasicInformation
