import { configure } from '@storybook/react'

// import the global styles
import '../src/semantic/semantic.min.css'
import '../src/styles/index.scss'

// automatically import all files ending in *.stories.js or *.story.js
const req = require.context('../src/components', true, /\.(stories|story)\.js$/)
function loadStories() {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
