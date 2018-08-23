import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import { getUser } from '../../reducers/rootReducer';
import * as Routes from '../../constants/routes';
import * as AsyncComponents from './AsyncComponent';

class Router extends Component {
  render() {
    const { user } = this.props;
    return (
      <BrowserRouter>
        <Switch>
          <PrivateRoute path={Routes.MANAGE_ZONE} component={AsyncComponents.ManageZone} user={user} />
          <PrivateRoute path={Routes.MANAGE_CLIENT} component={AsyncComponents.ManageClient} user={user} />

          <PrivateRoute path={Routes.HOME} component={AsyncComponents.Home} user={user} />
          <PrivateRoute path={Routes.RANGE_USE_PLAN_WITH_PARAM} component={AsyncComponents.RangeUsePlan} user={user} />
          <PrivateRoute path={Routes.EXPORT_PDF_WITH_PARAM} component={AsyncComponents.RupPDFView} user={user} />
          <PublicRoute path={Routes.LOGIN} component={AsyncComponents.Login} user={user} />

          <Route path="/return-page" component={AsyncComponents.ReturnPage} />
          <Route path="/" exact render={() => (<Redirect to={Routes.LOGIN} />)} />
          <Route component={AsyncComponents.PageNotFound} />
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
