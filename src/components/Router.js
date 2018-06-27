import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import * as Routes from '../constants/routes';
import Home from './Home';
import Login from './Login';
import ReturnPage from './ReturnPage';
import LandingPage from './LandingPage';
import PageNotFound from './PageNotFound';
import ManageZone from './manageZone';
import { getAuthData, getUser } from '../reducers/rootReducer';
import { isUserAdmin } from '../utils';

/* eslint-disable react/prop-types */
/* eslint-disable react/prefer-stateless-function */
const AdminRoute = ({ component: Component, user, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
        if (isUserAdmin(user)) {
          return <LandingPage {...props} component={Component} />;
        }
        return <Redirect to={Routes.LOGIN} />;
      }
    }
  />
);

const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={(props) => { // props = { match:{...}, history:{...}, location:{...} }
        if (auth) {
          return <LandingPage {...props} component={Component} />;
        }
        return <Redirect to={Routes.LOGIN} />;
      }
    }
  />
);

const PublicRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (auth) {
        return <Redirect to={Routes.HOME} />;
      }
      return <Component {...props} />;
    }}
  />
);

class Router extends Component {
  render() {
    const { auth, user } = this.props;
    return (
      <BrowserRouter>
        <Switch>
          <PublicRoute path={Routes.LOGIN} component={Login} auth={auth} />
          <PrivateRoute path={Routes.HOME} component={Home} auth={auth} />
          <AdminRoute path={Routes.MANAGE_ZONE} component={ManageZone} user={user} />
          <Route path="/return-page" component={ReturnPage} />
          <Route path="/" exact render={() => (<Redirect to={Routes.LOGIN} />)} />
          <Route path="*" component={PageNotFound} />
        </Switch>
      </BrowserRouter>
    );
  }
}

const propTypes = {
  auth: PropTypes.shape({}),
  user: PropTypes.shape({}),
};
const defaultProps = {
  auth: null,
  user: null,
};
const mapStateToProps = state => (
  {
    auth: getAuthData(state),
    user: getUser(state),
  }
);

Router.propTypes = propTypes;
Router.defaultProps = defaultProps;
export default connect(mapStateToProps, null)(Router);
