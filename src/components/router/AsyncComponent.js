import React from 'react';
import Loadable from 'react-loadable';
import { Button, Icon } from 'semantic-ui-react';
import { Loading } from '../common';

/*
  Code Splitting with React Router
  https://serverless-stack.com/chapters/code-splitting-in-create-react-app.html
*/

const LoadingComponent = ({ isLoading, error }) => {
  let component;
  if (isLoading) { // Handle the loading state
    component = <Loading />;
  } else if (error) { // Handle the error state
    component = (
      <div className="page-error">
        <Icon name="warning circle" size="big" color="red" />
        <div>
          <span className="page-error__message">
            Sorry, there was a problem loading the page.
          </span>
        </div>
        <div>
          <Button onClick={() => window.location.reload(true)}>Refresh</Button>
        </div>
      </div>
    );
  }

  return component;
};

const AsyncComponent = Component => (
  Loadable({
    loader: Component,
    loading: LoadingComponent,
  })
);

export const Home = AsyncComponent(() => import('../Home'));
export const Login = AsyncComponent(() => import('../Login'));
export const ReturnPage = AsyncComponent(() => import('../ReturnPage'));
export const PageNotFound = AsyncComponent(() => import('../PageNotFound'));
export const ManageZone = AsyncComponent(() => import('../manageZone'));
export const ManageClient = AsyncComponent(() => import('../manageClient'));
export const RangeUsePlan = AsyncComponent(() => import('../rangeUsePlan'));
export const RupPDFView = AsyncComponent(() => import('../rangeUsePlan/RupPDFView'));
