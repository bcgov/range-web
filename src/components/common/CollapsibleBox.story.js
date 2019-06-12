import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import CollapsibleBox from './CollapsibleBox'
import TextField from './TextField'
import { Icon } from 'semantic-ui-react'

storiesOf('Collapsible Box', module)
  .add('Open', () => (
    <CollapsibleBox
      header={<div>Header</div>}
      collapsibleContent={
        <>
          <span>content..</span>
        </>
      }
      contentIndex={0}
      activeContentIndex={0}
      onContentClicked={() => action('on-content-clicked')}
    />
  ))

  .add('Closed', () => (
    <CollapsibleBox
      header={<div>Header</div>}
      collapsibleContent={
        <>
          <span>content..</span>
        </>
      }
      contentIndex={1}
      activeContentIndex={0}
      onContentClicked={() => action('on-content-clicked')}
    />
  ))

  .add('Open with custom content', () => (
    <CollapsibleBox
      header={<div>Header</div>}
      collapsibleContent={
        <>
          <div className="rup__row">
            <div className="rup__cell-4">
              <TextField
                label={'Label A'}
                text={`
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Phasellus vel venenatis purus, vitae viverra ex. Nulla ac
                  nisl aliquam, eleifend neque vitae, feugiat magna. Nunc
                  venenatis dui et odio pulvinar tincidunt. Nunc in maximus
                  est, at faucibus elit.
                `}
              />
            </div>
            <div className="rup__cell-4">
              <TextField
                text={`
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Phasellus vel venenatis purus, vitae viverra ex. Nulla ac
                  nisl aliquam, eleifend neque vitae, feugiat magna. Nunc
                  venenatis dui et odio pulvinar tincidunt. Nunc in maximus
                  est, at faucibus elit.
              `}
              />
            </div>
            <div className="rup__cell-4">
              <TextField
                label={'Label C'}
                text={`
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Phasellus vel venenatis purus, vitae viverra ex. Nulla ac
                  nisl aliquam, eleifend neque vitae, feugiat magna. Nunc
                  venenatis dui et odio pulvinar tincidunt. Nunc in maximus
                  est, at faucibus elit.
                `}
              />
            </div>
            <div className="rup__cell-4">
              <TextField
                label={'Label D'}
                text={
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vel venenatis purus, vitae viverra ex. Nulla ac nisl aliquam, eleifend neque vitae, feugiat magna. Nunc venenatis dui et odio pulvinar tincidunt. Nunc in maximus est, at faucibus elit. '
                }
              />
            </div>
            <div className="rup__cell-4">
              <TextField
                label={'Label E'}
                text={`
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Phasellus vel venenatis purus, vitae viverra ex. Nulla ac
                  nisl aliquam, eleifend neque vitae, feugiat magna. Nunc
                  venenatis dui et odio pulvinar tincidunt. Nunc in maximus
                  est, at faucibus elit.
                `}
              />
            </div>
          </div>
        </>
      }
      contentIndex={0}
      activeContentIndex={0}
      onContentClicked={() => action('on-content-clicked')}
    />
  ))

  .add('Open with custom right header', () => (
    <CollapsibleBox
      headerRight={
        <div className="rup__missue__identified">
          {'A custom header: '}
          <Icon name="check circle" color="green" />
        </div>
      }
      header={<div>Header</div>}
      collapsibleContent={
        <>
          <span>content..</span>
        </>
      }
      contentIndex={0}
      activeContentIndex={0}
      onContentClicked={i => () => i}
    />
  ))

  .add('Open with message', () => (
    <CollapsibleBox
      header={<div>Header</div>}
      collapsibleContent={
        <>
          <span>content..</span>
        </>
      }
      contentIndex={0}
      activeContentIndex={0}
      onContentClicked={() => action('on-content-clicked')}
      message={
        <>
          <div style={{ marginLeft: ' 15px' }}>
            {`
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Phasellus vel venenatis purus, vitae viverra ex. Nulla ac
              nisl aliquam, eleifend neque vitae, feugiat magna. Nunc
              venenatis dui et odio pulvinar tincidunt. Nunc in maximus
              est, at faucibus elit.
            `}
          </div>
        </>
      }
    />
  ))
