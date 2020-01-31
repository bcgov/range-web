import React from 'react'
import { View, StyleSheet, Text, Image } from '@react-pdf/renderer'
import moment from 'moment'
import { IMAGE_SRC } from '../../../../constants/variables'
import { getPrimaryClientFullName } from '../helper'

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    position: 'absolute',
    fontSize: 10,
    top: 15,
    left: 50,
    right: 50,
    textAlign: 'left',
    color: '#444444',
    fontFamily: 'Lato',
    height: 60
  },
  image: {
    height: '110%',
    marginLeft: -10
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#000000'
  },
  subtitle: {
    fontWeight: 'normal',
    fontSize: 11,
    color: '#000000'
  }
})

const Header = ({ plan }) => (
  <View style={styles.header} fixed>
    <Image src={IMAGE_SRC.MYRANGEBC_LOGO_FOR_PDF} style={styles.image} />
    <View style={styles.info}>
      <Text style={styles.title}>Range Use Plan</Text>
      <Text>
        {plan.agreement.id} | {getPrimaryClientFullName(plan.agreement.clients)}
      </Text>
      <Text style={styles.subtitle}>Plan Term</Text>
      <Text>
        {moment(plan.planStartDate).format('MMMM DD, YYYY')} -{' '}
        {moment(plan.planEndDate).format('MMMM DD, YYYY')}
      </Text>
    </View>
  </View>
)

export default Header
