import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import configureStore from '../configureStore';
import * as Routes from '../constants/routes';
import Home from './Home';
import Login from './Login';
import ReturnPage from './ReturnPage';
import LandingPage from './LandingPage';
import { getAuthData } from '../reducers/rootReducer';

export const store = configureStore();
// console.log(store.getState());

/* eslint-disable react/prop-types */
/* eslint-disable react/prefer-stateless-function */
// const AdminRoute = ({ component: Component, ...rest }) => (
//   <Route
//     {...rest}
//     render={(props) => {
//         if (user && user.isAdmin) {
//           return <LandingPage {...props} component={Component} />;
//         }
//         return <Redirect to={Routes.LOGIN} />;
//       }
//     }
//   />
// );

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => { // props = { match:{...}, history:{...}, location:{...} }
        if (getAuthData(store.getState())) {
          return <LandingPage {...props} component={Component} />;
        }
        return <Redirect to={Routes.LOGIN} />;
      }
    }
  />
);

const PublicRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (getAuthData(store.getState())) {
        return <Redirect to={Routes.HOME} />;
      }
      return <Component {...props} />;
    }}
  />
);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <PublicRoute path={Routes.LOGIN} component={Login} />
            <PrivateRoute path="/home" component={Home} />
            <Route path="/return-page" component={ReturnPage} />
            <Route path="/" exact render={() => (<Redirect to={Routes.LOGIN} />)} />
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
