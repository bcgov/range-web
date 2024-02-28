import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import ListModal from './ListModal';

const options = [
  {
    key: 0,
    text: 'Option 1',
    value: 'option1',
  },
  {
    key: 1,
    text: 'Option 2',
    value: 'option2',
  },
  {
    key: 2,
    text: 'Option 3',
    value: 'option3',
  },
  {
    key: 3,
    text: 'Option 4',
    value: 'option4',
  },
  {
    key: 4,
    text: 'Option 5',
    value: 'option5',
  },
];

storiesOf('ListModal', module)
  .add('default', () => (
    <ListModal
      open={true}
      onOptionClick={action('option clicked')}
      onClose={action('close')}
      title="My List Modal"
      options={options}
    />
  ))
  .add('multiselect', () => (
    <ListModal
      open={true}
      onOptionClick={action('option clicked')}
      onClose={action('close')}
      onSubmit={action('submit')}
      title="My List Modal"
      options={options}
      multiselect
    />
  ));
