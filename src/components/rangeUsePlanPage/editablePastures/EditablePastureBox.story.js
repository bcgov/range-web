import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { providerDecorator, marginDecorator } from '../../decorators'

import EditablePastureBox from './EditablePastureBox'

const pasture = {
  name: 'Test Pasture',
  allowableAum: 100,
  pldPercent: 0.2,
  graceDays: 7,
  notes: 'This is a note.',
  plantCommunities: []
}

const stories = storiesOf(
  'rangeUsePlanPage/editablePastures/EditablePastureBox',
  module
)

stories
  .addDecorator(providerDecorator)
  .addDecorator(marginDecorator)
  .add('active', () => (
    <div className="rup__pastures">
      <EditablePastureBox
        pasture={pasture}
        pastureIndex={0}
        activePastureIndex={0}
        onPastureClicked={() => action('CollapsibleBox clicked')}
        onNumberFieldChange={action('Number field changed')}
        onTextFieldChange={action('Text field changed')}
      />
    </div>
  ))
  .add('closed', () => (
    <div className="rup__pastures">
      <EditablePastureBox
        pasture={pasture}
        pastureIndex={0}
        activePastureIndex={-1}
        onPastureClicked={() => action('CollapsibleBox clicked')}
        onNumberFieldChange={action('Number field changed')}
        onTextFieldChange={action('Text field changed')}
      />
    </div>
  ))
