import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import * as Routes from '../constants/routes';
import Home from './Home';
import Login from './Login';
import ReturnPage from './ReturnPage';
import LandingPage from './LandingPage';
import PageNotFound from './PageNotFound';
import ManageZone from './manageZone';
import ManageClient from './manageClient';
import RangeUsePlan from './rangeUsePlan';
import RupPDFView from './rangeUsePlan/RupPDFView';
import { getUser } from '../reducers/rootReducer';
import { isUserAdmin } from '../utils';

/* eslint-disable react/prop-types */
/* eslint-disable react/prefer-stateless-function */

const PrivateRoute = ({ component: Component, user, ...rest }) => (
  <Route
    {...rest}
    render={(props) => { // props = { match:{...}, history:{...}, location:{...} }
        if (user) {
          const { path } = props.match;

          // Admin Routes
          if (path === Routes.MANAGE_CLIENT || path === Routes.MANAGE_ZONE) {
            if (isUserAdmin(user)) {
              return <LandingPage {...props} component={Component} />;
            }
            return <Redirect to={Routes.LOGIN} />;
          }

          // no need to pass the RupPDFView to LandingPage
          if (path === Routes.EXPORT_PDF_WITH_PARAM) {
            return <Component {...props} />;
          }

          return <LandingPage {...props} component={Component} />;
        }

        // user is undefined redirect to the login page
        return <Redirect to={Routes.LOGIN} />;
      }
    }
  />
);

const PublicRoute = ({ component: Component, user, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (user) {
        return <Redirect to={Routes.HOME} />;
      }
      return <Component {...props} />;
    }}
  />
);

class Router extends Component {
  render() {
    const { user } = this.props;
    return (
      <BrowserRouter>
        <Switch>
          <PrivateRoute path={Routes.MANAGE_ZONE} component={ManageZone} user={user} />
          <PrivateRoute path={Routes.MANAGE_CLIENT} component={ManageClient} user={user} />

          <PrivateRoute path={Routes.HOME} component={Home} user={user} />
          <PrivateRoute path={Routes.RANGE_USE_PLAN_WITH_PARAM} component={RangeUsePlan} user={user} />
          <PrivateRoute path={Routes.EXPORT_PDF_WITH_PARAM} component={RupPDFView} user={user} />
          <PublicRoute path={Routes.LOGIN} component={Login} user={user} />

          <Route path="/return-page" component={ReturnPage} />
          <Route path="/" exact render={() => (<Redirect to={Routes.LOGIN} />)} />
          <Route path="*" component={PageNotFound} />
        </Switch>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => (
  {
    user: getUser(state),
  }
);

export default connect(mapStateToProps, null)(Router);
