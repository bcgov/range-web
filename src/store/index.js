import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers/reducer.js'
import thunkMiddleware from 'redux-thunk';

const loggerMiddleware = createLogger();

const store = process.env.NODE_ENV !== 'production' ? createStore(
  rootReducer,
	applyMiddleware(
		thunkMiddleware,
		loggerMiddleware,
	),
) : createStore(
  rootReducer,
	applyMiddleware(
		thunkMiddleware,
	),
);

export default store;
