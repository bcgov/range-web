import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect, BrowserRouter } from 'react-router-dom';

import * as Routes from '../constants/routes';
import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';
import Login from './auth/Login';
import Toast from './Toast';
import PageNotFound from './PageNotFound';
import RangeUsePlan from './rangeUsePlan';
import RangeUsePlanPDFView from './rangeUsePlan/RupPDFView';
import Agreement from './agreement';
import ManageZone from './manageZone';

import { registerAxiosInterceptors } from '../handlers/authentication';
import { logout } from '../actions/authActions';

const propTypes = {
  logout: PropTypes.func.isRequired,
  user: PropTypes.shape({}),
};

const defaultProps = {
  user: null,
};

export class App extends Component {
  componentWillMount() {
    registerAxiosInterceptors(this.props.logout);
  }

  render() {
    const { user } = this.props;

    return (
      <div>
        <BrowserRouter>
          <Switch>
            <PublicRoute path={Routes.LOGIN} component={Login} user={user} />
            <PrivateRoute path={Routes.RANGE_USE_PLANS} component={Agreement} user={user} />
            <PrivateRoute path={`${Routes.RANGE_USE_PLAN}/:agreementId/:planId`} component={RangeUsePlan} user={user} />
            <PrivateRoute path={Routes.MANAGE_ZONE} component={ManageZone} user={user} />

            <Route path={`${Routes.EXPORT_PDF}/:agreementId/:planId`} component={RangeUsePlanPDFView} user={user} />
            <Route path="/" exact render={() => (<Redirect to={Routes.LOGIN} />)} />
            <Route path="*" component={PageNotFound} />
          </Switch>
        </BrowserRouter>
        <Toast />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { user } = state.auth;
  return {
    user,
  };
};

App.propTypes = propTypes;
App.defaultProps = defaultProps;
export default connect(mapStateToProps, { logout })(App);
