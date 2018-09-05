import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';
import { getUser } from '../../reducers/rootReducer';
import * as Routes from '../../constants/routes';
import * as AsyncComponents from './AsyncComponent';

class Router extends Component {
  static propTypes = {
    user: PropTypes.shape({}).isRequired,
  }

  render() {
    const { user } = this.props;
    return (
      <BrowserRouter>
        <Switch>
          <ProtectedRoute path={Routes.MANAGE_ZONE} component={AsyncComponents.ManageZone} user={user} />
          <ProtectedRoute path={Routes.MANAGE_CLIENT} component={AsyncComponents.ManageClient} user={user} />

          <ProtectedRoute path={Routes.HOME} component={AsyncComponents.Home} user={user} />
          <ProtectedRoute path={Routes.RANGE_USE_PLAN_WITH_PARAM} component={AsyncComponents.RangeUsePlan} user={user} />
          <ProtectedRoute path={Routes.EXPORT_PDF_WITH_PARAM} component={AsyncComponents.RupPDFView} user={user} />

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
