import React from 'react';
import { storiesOf } from '@storybook/react';
import { Formik } from 'formik';

import plan from '../../../../.storybook/mocks/plan';
import GrazingSchedules from './';

storiesOf('rangeUsePlanPage/GrazingSchedules', module).add('default', () => (
  <Formik
    initialValues={plan}
    render={({ values: plan }) => <GrazingSchedules plan={plan} />}
  />
));
