import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import configureStore from '../configureStore';
import Home from '../components/Home';

export const store = configureStore();
/* eslint-disable react/prefer-stateless-function */
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Route path="/" component={Home} />
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
