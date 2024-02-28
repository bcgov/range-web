import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import TextField from './TextField';

storiesOf('Text Field', module)
  .add('With label', () => <TextField label={'With Label'} />)
  .addDecorator(withKnobs)
  .add('With knobs', () => (
    <TextField
      label={text('Label', 'Some Label')}
      text={text('Text', 'Some Text')}
      onClick={action('on-content-clicked')}
      isEditable={boolean('Is Editable', false)}
      isLabelHidden={boolean('Is Label Hidden', false)}
    />
  ));
