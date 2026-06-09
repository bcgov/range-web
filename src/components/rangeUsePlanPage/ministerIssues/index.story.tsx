import React from 'react';
import { storiesOf } from '@storybook/react';
import moment from 'moment';

import MinisterIssues from '.';
import { Form } from 'formik-semantic-ui';

const ministerIssues = [
  {
    id: 8,
    issueTypeId: 2,
    detail: 'This is a pretty big issue',
    objective: 'Our objective is to address the issue....',
    identified: true,
    pastures: [0, 1],
    ministerIssueActions: [
      {
        id: 1,
        actionTypeId: 5,
        detail: 'Issue actions details yo!',
        noGrazeEndMonth: moment().add(3, 'months').month(),
        noGrazeEndDay: moment().add(3, 'months').day(),
        noGrazeStartMonth: moment().add(1, 'month').month(),
        noGrazeStartDay: moment().add(1, 'month').day(),
      },
    ],
  },
];

const pastures = [
  { name: 'Pasture 1', id: 0 },
  { name: 'Pasture 2', id: 1 },
  { name: 'Pasture 3', id: 2 },
];

storiesOf('rangeUsePlanPage/ministerIssues/MinisterIssues', module).add('With Content', () => (
  <Form
    initialValues={{ ministerIssues, pastures }}
    render={({ values }) => <MinisterIssues issues={values.ministerIssues} />}
  />
));
