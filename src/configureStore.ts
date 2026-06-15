import { createStore, applyMiddleware, compose, AnyAction } from 'redux';
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk';
import rootReducer from './reducers/rootReducer';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: () => <T>(f: T) => T;
  }
}

const dev = process.env.NODE_ENV === 'development';

function devTools() {
  if (dev && window.__REDUX_DEVTOOLS_EXTENSION__) {
    return window.__REDUX_DEVTOOLS_EXTENSION__();
  }
  return <T>(f: T): T => f;
}

const configureStore = () => {
  const middlewares = [thunk];

  return createStore(rootReducer, compose(applyMiddleware(...middlewares), devTools()));
};

export default configureStore;

/** The root state type — inferred from the root reducer. */
export type RootState = ReturnType<typeof rootReducer>;

/** Typed dispatch that supports thunks. */
export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

/** Reusable type for thunk action creators. */
export type AppThunk<ReturnType = Promise<void>> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;
