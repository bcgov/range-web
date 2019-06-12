import { applyMiddleware, createStore } from 'redux'
import { configureStore } from 'redux-mock-store'
import rootReducer from '../../reducers/rootReducer'

export const flushAllPromises = () =>
  new Promise(resolve => setTimeout(resolve, 0))

export const configureMockStore = (middlewares = []) => {
  const store = createStore(rootReducer, applyMiddleware(...middlewares))

  return store
}

export const configureReduxMockStore = (middlewares = []) =>
  configureStore(...middlewares)
