import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers/reducer';

const loggerMiddleware = createLogger();

const store = process.env.NODE_ENV !== 'production'
  ? createStore(rootReducer, applyMiddleware(thunkMiddleware, loggerMiddleware))
  : createStore(rootReducer, applyMiddleware(thunkMiddleware));

export default store;
