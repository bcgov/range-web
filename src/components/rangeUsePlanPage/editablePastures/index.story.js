import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { providerDecorator, marginDecorator } from '../../decorators'

import EditablePastures from './index'

const pasture = {
  name: 'Test Pasture',
  allowableAum: 100,
  pldPercent: 0.2,
  graceDays: 7,
  notes: 'This is a note.',
  plantCommunities: []
}

const stories = storiesOf(
  'rangeUsePlanPage/editablePastures/EditablePastures',
  module
)

stories
  .addDecorator(providerDecorator)
  .addDecorator(marginDecorator)
  .add('With content', () => (
    <div className="rup__pastures">
      <EditablePastures
        plan={{
          id: 33,
          pastures: [1, 2]
        }}
        pasturesMap={{
          1: { ...pasture, id: 1, name: 'Item A' },
          2: { ...pasture, id: 2, name: 'Item B' }
        }}
        pastureAdded={action('Add')}
        pastureUpdated={action('Update')}
      />
    </div>
  ))
  .add('With no pasturesMap', () => (
    <div className="rup__pastures">
      <EditablePastures
        plan={{
          id: 33,
          pastures: [1, 2]
        }}
        pasturesMap={{}}
        pastureAdded={action('Add')}
        pastureUpdated={action('Update')}
      />
    </div>
  ))
  .add('No pastures associated with plan', () => (
    <div className="rup__pastures">
      <EditablePastures
        plan={{
          id: 33,
          pastures: []
        }}
        pasturesMap={{
          1: { ...pasture, id: 1, name: 'Item A' },
          2: { ...pasture, id: 2, name: 'Item B' }
        }}
        pastureAdded={action('Add')}
        pastureUpdated={action('Update')}
      />
    </div>
  ))
