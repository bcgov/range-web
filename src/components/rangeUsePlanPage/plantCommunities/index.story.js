import React from 'react';
import PlantCommunities from '.';
import { Form } from 'formik-semantic-ui';

const plantCommunities = [
  {
    approved: false,
    communityTypeId: 2,
    name: 'My plant community',
    monitoringAreas: [],
    plantCommunityActions: [],
    notes: '',
    pastureId: 1,
    indicatorPlants: [],
    id: 1,
  },
  {
    approved: false,
    communityTypeId: 2,
    name: 'community 2',
    monitoringAreas: [],
    plantCommunityActions: [],
    notes: '',
    pastureId: 1,
    indicatorPlants: [],
    id: 2,
  },
];

const pastures = [{ id: 1, plantCommunities }];

export default {
  title: 'rangeUsePlanPage/PlantCommunities',
  decorators: [
    (storyFn) => (
      <Form
        initialValues={{
          pastures,
        }}
        render={({ values }) => storyFn(values)}
      />
    ),
  ],
};

export const DefaultStory = (values) => (
  <PlantCommunities
    plantCommunities={values.pastures[0].plantCommunities}
    namespace="pastures.0"
  />
);
