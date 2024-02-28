import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import InputModal from './InputModal';

storiesOf('InputModal', module).add('default', () => (
  <InputModal
    open={true}
    onSubmit={action('submit')}
    onClose={action('close')}
    title="My Input Modal"
  />
));
