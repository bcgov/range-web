import React from 'react'
import { configure, addDecorator } from '@storybook/react'

// import the global styles
import '../src/semantic/semantic.min.css'
import '../src/styles/index.scss'

import { UserContext } from '../src/providers/UserProvider'
import { ReferencesContext } from '../src/providers/ReferencesProvider'
import mockReferences from './mocks/references'
import mockUser from './mocks/user'

// automatically import all files ending in *.stories.js or *.story.js
const req = require.context('../src/components', true, /\.(stories|story)\.js$/)
function loadStories() {
  req.keys().forEach(filename => req(filename))
}

// Mock user
addDecorator(story => (
  <UserContext.Provider value={mockUser}>{story()}</UserContext.Provider>
))

// Mock references
addDecorator(story => (
  <ReferencesContext.Provider value={mockReferences}>
    {story()}
  </ReferencesContext.Provider>
))

configure(loadStories, module)
