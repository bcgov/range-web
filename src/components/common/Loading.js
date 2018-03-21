import React from 'react';
import { Loader, Dimmer } from 'semantic-ui-react';

export const Loading = () => (
  <Dimmer active inverted>
    <Loader>Loading</Loader>
  </Dimmer>
);
