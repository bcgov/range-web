// @ts-nocheck
//
// MyRangeBC
//
// Copyright © 2018 Province of British Columbia
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
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';
import { useUser } from '../../providers/UserProvider';
import * as RoutePaths from '../../constants/routes';
import { LoadableComponent } from './LoadableComponent';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import ErrorBoundary from '../common/ErrorBoundary';
import ManageAgentsPage from '../rangeUsePlanPage/manageAgentsPage';

const SelectRangeUsePlan = LoadableComponent(() => import('../selectRangeUsePlanPage'));
const LoginPage = LoadableComponent(() => import('../loginPage'));
const ReturnPage = LoadableComponent(() => import('../ReturnPage'));
const PageNotFound = LoadableComponent(() => import('../PageNotFound'));
const ManageClient = LoadableComponent(() => import('../manageClientPage'));
const MergeAccount = LoadableComponent(() => import('../mergeAccountPage'));
const RangeUsePlan = LoadableComponent(() => import('../rangeUsePlanPage'));
const EmailTemplate = LoadableComponent(() => import('../emailTemplatePage'));
const AssignRolesAndDistricts = LoadableComponent(() => import('../assignRolesAndDistrictsPage'));
const PDFView = LoadableComponent(() => import('../rangeUsePlanPage/pdf/PDFView'));

const Router = () => {
  const user = useUser();

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <QueryParamProvider adapter={ReactRouter6Adapter}>
          <Routes>
            {/* Admin Routes */}
            <Route
              path={RoutePaths.MANAGE_CLIENT}
              element={<ProtectedRoute component={ManageClient} user={user} path={RoutePaths.MANAGE_CLIENT} />}
            />
            <Route
              path={RoutePaths.MERGE_ACCOUNT}
              element={<ProtectedRoute component={MergeAccount} user={user} path={RoutePaths.MERGE_ACCOUNT} />}
            />
            <Route
              path={RoutePaths.EMAIL_TEMPLATE}
              element={<ProtectedRoute component={EmailTemplate} user={user} path={RoutePaths.EMAIL_TEMPLATE} />}
            />
            <Route
              path={RoutePaths.ASSIGN_ROLES_AND_DISTRICTS}
              element={
                <ProtectedRoute
                  component={AssignRolesAndDistricts}
                  user={user}
                  path={RoutePaths.ASSIGN_ROLES_AND_DISTRICTS}
                />
              }
            />
            {/* Admin Routes End */}

            <Route path={RoutePaths.LOGIN} element={<PublicRoute component={LoginPage} user={user} />} />

            <Route
              path={`${RoutePaths.HOME}/:page?`}
              element={<ProtectedRoute component={SelectRangeUsePlan} user={user} path={`${RoutePaths.HOME}/:page?`} />}
            />
            <Route
              path={RoutePaths.MANAGE_PLAN_AGENTS}
              element={<ProtectedRoute component={ManageAgentsPage} user={user} path={RoutePaths.MANAGE_PLAN_AGENTS} />}
            />
            <Route
              path={RoutePaths.RANGE_USE_PLAN_WITH_PARAM}
              element={
                <ProtectedRoute component={RangeUsePlan} user={user} path={RoutePaths.RANGE_USE_PLAN_WITH_PARAM} />
              }
            />
            <Route
              path={RoutePaths.EXPORT_PDF_WITH_PARAM}
              element={<ProtectedRoute component={PDFView} user={user} path={RoutePaths.EXPORT_PDF_WITH_PARAM} />}
            />

            <Route path={RoutePaths.RETURN_PAGE} element={<ReturnPage />} />
            <Route path="/" element={<Navigate to={RoutePaths.LOGIN} replace />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </QueryParamProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default Router;
