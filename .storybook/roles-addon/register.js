import React from 'react';
import addons, { types } from '@storybook/addons';
import Tool from './Tool';
import { ADDON_ID } from './constants';

addons.register(ADDON_ID, (api) => {
  addons.add(ADDON_ID, {
    type: types.TOOL,
    title: 'User role',
    render: () => <Tool api={api} channel={addons.getChannel()} />,
  });
});
