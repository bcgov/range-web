import React from 'react'
import { configure, addDecorator } from '@storybook/react'

// import the global styles
import '../src/semantic/semantic.min.css'
import '../src/styles/index.scss'

import { ReferencesContext } from '../src/providers/ReferencesProvider'
import mockReferences from './mocks/references'
import { withUserDecorator } from './roles-addon'

// automatically import all files ending in *.stories.js or *.story.js
const req = require.context('../src/components', true, /\.(stories|story)\.js$/)
function loadStories() {
  req.keys().forEach(filename => req(filename))
}

// Mock user
addDecorator(withUserDecorator())

// Mock references
addDecorator(story => (
  <ReferencesContext.Provider value={mockReferences}>
    {story()}
  </ReferencesContext.Provider>
))

configure(loadStories, module)
