import React from 'react'
import { Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { IMAGE_SRC } from '../../../../constants/variables'
import Footer from './Footer'
import moment from 'moment'
import { config } from './common/config'
import { getUserFullName } from '../helper'

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '50px',
    fontFamily: 'Lato',
    fontSize: 14,
    paddingBottom: '200px'
  },
  image: {
    width: '250'
  },
  mainHeader: {
    color: config.primaryColor,
    fontSize: 22,
    fontWeight: 'heavy',
    display: 'flex',
    alignItems: 'center'
  },
  signatures: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  signature: {
    width: '150px',
    paddingTop: '10px',
    borderTopWidth: 2,
    borderTopColor: config.primaryColor,
    borderTopStyle: 'solid',
    textAlign: 'center',
    fontSize: 12
  },
  header: {
    fontWeight: 'bold',
    marginBottom: '5px'
  },
  section: {
    display: 'flex',
    alignItems: 'center'
  }
})

const FrontPage = ({ plan }) => (
  <Page size="A4" style={styles.page}>
    <Image src={IMAGE_SRC.MYRANGEBC_LOGO_FOR_PDF} style={styles.image} />
    <View style={styles.mainHeader}>
      <Text>Range Use Plan </Text>
      <Text>STATUS: {plan.status.name.toUpperCase()}</Text>
    </View>
    <View style={styles.section}>
      <Text style={styles.header}>{plan.agreement.id}</Text>
      <Text style={styles.subtitle}>Plan Term</Text>
      <Text>
        {moment(plan.planStartDate).format('MMMM DD, YYYY')} -{' '}
        {moment(plan.planEndDate).format('MMMM DD, YYYY')}
      </Text>
    </View>
    <View style={styles.section}>
      <Text style={styles.header}>Confirmed by Agreement Holder(s):</Text>
      {plan.agreement.clients.map(client => {
        const confirmation = plan.confirmations.find(
          c => c.clientId === client.id
        )

        return (
          <Text key={client.id}>
            {client.name} -{' '}
            {confirmation && confirmation.confirmed
              ? moment(confirmation.updatedAt).format('MMMM DD, YYYY')
              : 'Awaiting Signature'}
            {confirmation &&
              confirmation.confirmed &&
              !confirmation.isOwnSignature && (
                <Text> by {getUserFullName(confirmation.user)}</Text>
              )}
          </Text>
        )
      })}
    </View>
    <Text style={styles.header}>Confirmed by District Manager:</Text>
    <View style={styles.signatures}>
      <Text style={styles.signature}>Printed Name</Text>
      <Text style={styles.signature}>Signature</Text>
      <Text style={styles.signature}>Date</Text>
    </View>
    <Footer />
  </Page>
)

export default FrontPage
