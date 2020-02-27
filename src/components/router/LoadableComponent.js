import React from 'react'
import loadable from '@loadable/component'
import { Loading } from '../common'

/*
  Code Splitting with React Router
  https://serverless-stack.com/chapters/code-splitting-in-create-react-app.html
*/
export const LoadableComponent = cb =>
  loadable(cb, {
    fallback: <Loading />
  })
