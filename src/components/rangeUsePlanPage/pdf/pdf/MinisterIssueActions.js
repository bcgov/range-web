import React from 'react'
import { View } from '@react-pdf/renderer'
import Section from './common/Section'
import Field from './common/Field'
import moment from 'moment'

const MinisterIssueActions = ({ actions }) => (
  <View>
    {actions.map(action => (
      <Section style={{ margin: '5px 0' }} key={action.id}>
        <Field
          label={
            action.ministerIssueActionType.name === 'Other'
              ? `${action.other} (Other)`
              : action.ministerIssueActionType.name +
                (action.ministerIssueActionType.name === 'Timing'
                  ? ` - No Graze Period (${moment()
                      .set('month', action.noGrazeStartMonth - 1)
                      .set('date', action.noGrazeStartDay)
                      .format('MMM DD')} - ${moment()
                      .set('month', action.noGrazeEndMonth - 1)
                      .set('date', action.noGrazeEndDay)
                      .format('MMM DD')})`
                  : '')
          }
          style={{ margin: 0 }}>
          {action.detail}{' '}
        </Field>
        {action.name}
      </Section>
    ))}
  </View>
)

export default MinisterIssueActions
