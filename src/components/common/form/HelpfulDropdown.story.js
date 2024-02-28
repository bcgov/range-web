import React from 'react';
import HelpfulDropdown from './HelpfulDropdown';
import { Form } from 'formik-semantic-ui';

export default {
  title: 'HelpfulDropdown',
};

const options = [
  { value: 'en', key: 'en', text: 'English' },
  { value: 'es', key: 'es', text: 'Spanish' },
  { value: 'fr', key: 'fr', text: 'French' },
];

export const withInfoText = () => (
  <Form
    initialValues={{ language: 'fr' }}
    render={() => (
      <HelpfulDropdown
        help="This is the info for the dropdown"
        label="Language"
        options={options}
        name="language"
      />
    )}
  />
);
