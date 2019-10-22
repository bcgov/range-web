import React from 'react'
import { View, Page, StyleSheet, Text } from '@react-pdf/renderer'
import Footer from './Footer'
import Header from './Header'
import Title from './common/Title'
import { config } from './common/config'
import Subtext from './common/Subtext'
import SectionHeader from './common/SectionHeader'
import Field from './common/Field'
import { formatMinisterIssues } from '../../pdf/helper'
import MinisterIssueActions from './MinisterIssueActions'

const styles = StyleSheet.create({
  page: {
    padding: 50,
    paddingTop: 70,
    fontFamily: config.fontFamily,
    fontSize: config.normalFontSize
  }
})

const MinisterIssues = ({ plan }) => (
  <Page size="A4" style={styles.page}>
    <Header plan={plan} />

    <Title>Minister&apos;s Issues and Actions</Title>

    <Subtext>
      If more than one readiness criteria is provided, all such criteria must be
      met before grazing may accur.
    </Subtext>

    {formatMinisterIssues(plan).map(ministerIssue => (
      <View key={ministerIssue.id}>
        <SectionHeader>
          Issue Type: {ministerIssue.ministerIssueType.name}
        </SectionHeader>

        <Field label="Details">{ministerIssue.detail}</Field>
        <Field label="Objectives">{ministerIssue.objective}</Field>
        <Field label="Pastures">{ministerIssue.pastureNames}</Field>
        <SectionHeader secondary>Actions</SectionHeader>
        {ministerIssue.ministerIssueActions.length > 0 ? (
          <MinisterIssueActions actions={ministerIssue.ministerIssueActions} />
        ) : (
          <Subtext>No actions provided</Subtext>
        )}
      </View>
    ))}

    {plan.ministerIssues.length <= 0 && (
      <Text>No minister issues provided</Text>
    )}

    <Footer />
  </Page>
)

export default MinisterIssues
