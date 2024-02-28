import React from 'react';
import UserProvider from './UserProvider';
import { makeDecorator } from '@storybook/addons';

export const withUserDecorator = makeDecorator({
  name: 'withUserProvider',
  wrapper: (getStory) => {
    return <UserProvider>{getStory()}</UserProvider>;
  },
});
