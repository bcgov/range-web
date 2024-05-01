//
// MyRangeBC
//
// Copyright © 2018 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Created by Kyubin Han.
//

import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';
import { useUser } from '../../providers/UserProvider';
import * as Routes from '../../constants/routes';
import { LoadableComponent } from './LoadableComponent';
import { QueryParamProvider } from 'use-query-params';
import ErrorBoundary from '../common/ErrorBoundary';
import ManageAgentsPage from '../rangeUsePlanPage/manageAgentsPage';

const SelectRangeUsePlan = LoadableComponent(
  () => import('../selectRangeUsePlanPage'),
);
const LoginPage = LoadableComponent(() => import('../loginPage'));
const ReturnPage = LoadableComponent(() => import('../ReturnPage'));
const PageNotFound = LoadableComponent(() => import('../PageNotFound'));
const ManageClient = LoadableComponent(() => import('../manageClientPage'));
const MergeAccount = LoadableComponent(() => import('../mergeAccountPage'));
const RangeUsePlan = LoadableComponent(() => import('../rangeUsePlanPage'));
const EmailTemplate = LoadableComponent(() => import('../emailTemplatePage'));
const AssignRoles = LoadableComponent(() => import('../assignRolesPage'));
const AssignDistrict = LoadableComponent(() => import('../assignDistrictPage'));
const PDFView = LoadableComponent(
  () => import('../rangeUsePlanPage/pdf/PDFView'),
);

const Router = () => {
  const user = useUser();

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <QueryParamProvider ReactRouterRoute={Route}>
          <Switch>
            {/* Admin Routes */}
            <ProtectedRoute
              path={Routes.MANAGE_CLIENT}
              component={ManageClient}
              user={user}
            />
            <ProtectedRoute
              path={Routes.MERGE_ACCOUNT}
              component={MergeAccount}
              user={user}
            />
            <ProtectedRoute
              path={Routes.EMAIL_TEMPLATE}
              component={EmailTemplate}
              user={user}
            />
            <ProtectedRoute
              path={Routes.ASSIGN_ROLES}
              component={AssignRoles}
              user={user}
            />
            <ProtectedRoute
              path={Routes.ASSIGN_DISTRICT}
              component={AssignDistrict}
              user={user}
            />
            {/* Admin Routes End */}

            <PublicRoute
              path={Routes.LOGIN}
              component={LoginPage}
              user={user}
            />

            <ProtectedRoute
              path={`${Routes.HOME}/:page?`}
              component={SelectRangeUsePlan}
              user={user}
            />
            <ProtectedRoute
              path={Routes.MANAGE_PLAN_AGENTS}
              component={ManageAgentsPage}
              user={user}
            />
            <ProtectedRoute
              path={Routes.RANGE_USE_PLAN_WITH_PARAM}
              component={RangeUsePlan}
              user={user}
            />
            <ProtectedRoute
              path={Routes.EXPORT_PDF_WITH_PARAM}
              component={PDFView}
              user={user}
            />

            <PublicRoute
              path={Routes.LOGIN}
              component={LoginPage}
              user={user}
            />

            <Route path={Routes.RETURN_PAGE} component={ReturnPage} />
            <Route
              path="/"
              exact
              render={() => <Redirect to={Routes.LOGIN} />}
            />
            <Route component={PageNotFound} />
          </Switch>
        </QueryParamProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

Router.propTypes = {
  user: PropTypes.shape({}),
};

export default Router;
