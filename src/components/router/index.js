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

import React from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import PublicRoute from './PublicRoute'
import ProtectedRoute from './ProtectedRoute'
import { useUser } from '../../providers/UserProvider'
import * as Routes from '../../constants/routes'
import { LoadableComponent } from './LoadableComponent'

const SelectRangeUsePlan = LoadableComponent(() =>
  import('../selectRangeUsePlanPage')
)
const LoginPage = LoadableComponent(() => import('../loginPage'))
const ReturnPage = LoadableComponent(() => import('../ReturnPage'))
const PageNotFound = LoadableComponent(() => import('../PageNotFound'))
const ManageZone = LoadableComponent(() => import('../manageZonePage'))
const ManageClient = LoadableComponent(() => import('../manageClientPage'))
const RangeUsePlan = LoadableComponent(() => import('../rangeUsePlanPage'))
const PDFView = LoadableComponent(() =>
  import('../rangeUsePlanPage/pdf/PDFView')
)

const Router = () => {
  const user = useUser()

  return (
    <BrowserRouter>
      <Switch>
        {/* Admin Routes */}
        <ProtectedRoute
          path={Routes.MANAGE_ZONE}
          component={ManageZone}
          user={user}
        />
        <ProtectedRoute
          path={Routes.MANAGE_CLIENT}
          component={ManageClient}
          user={user}
        />
        {/* Admin Routes End */}

        <ProtectedRoute
          path={Routes.HOME}
          component={SelectRangeUsePlan}
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

        <PublicRoute path={Routes.LOGIN} component={LoginPage} user={user} />

        <Route path={Routes.RETURN_PAGE} component={ReturnPage} />
        <Route path="/" exact render={() => <Redirect to={Routes.LOGIN} />} />
        <Route component={PageNotFound} />
      </Switch>
    </BrowserRouter>
  )
}

Router.propTypes = {
  user: PropTypes.shape({})
}

export default Router
