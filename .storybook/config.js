import React from 'react';
import { configure, addDecorator } from '@storybook/react';

// import the global styles
import '../src/semantic/semantic.min.css';
import '../src/styles/index.scss';

import { ReferencesContext } from '../src/providers/ReferencesProvider';
import mockReferences from './mocks/references';
import { withUserDecorator } from './roles-addon';

// Mock user
addDecorator(withUserDecorator());

// Mock references
addDecorator((story) => (
  <ReferencesContext.Provider value={mockReferences}>
    {story()}
  </ReferencesContext.Provider>
));

// automatically import all files ending in *.stories.js or *.story.js
const res = require.context(
  '../src/components',
  true,
  /\.(stories|story)\.js$/,
);

configure(res, module);
