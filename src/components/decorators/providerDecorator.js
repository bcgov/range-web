import React from 'react';
import { Provider } from 'react-redux';
import configureStore from '../../configureStore';

const store = configureStore();

const providerDecorator = (story) => <Provider store={store}>{story()}</Provider>;

export default providerDecorator;
