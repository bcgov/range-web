import React from 'react';
import { storiesOf } from '@storybook/react';
import { Form } from 'formik-semantic-ui';
import { action } from '@storybook/addon-actions';

import PlantCommunityBox from './PlantCommunityBox';

const plantCommunity = {
  name: 'Plant Community',
  plantCommunityActions: [],
  purposeOfAction: 'maintain',
  aspect: '',
  elevation: 0,
  url: '',
  approved: '',
  notes: '',
  communityType: { name: 'My community' },
  monitoringAreas: [],
  indicatorPlants: [],
};

storiesOf('rangeUsePlanPage/plantCommunities/PlantCommunityBox', module).add('default', () => (
  <Form
    initialValues={{ plantCommunity }}
    render={({ values }) => (
      <ul className="collaspible-boxes">
        <PlantCommunityBox
          namespace="plantCommunity"
          plantCommunity={values.plantCommunity}
          onClick={action('click')}
          index={1}
          activeIndex={1}
        />
      </ul>
    )}
  />
));
