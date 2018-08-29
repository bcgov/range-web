import React from 'react';
import Loadable from 'react-loadable';

/*
  Code Splitting with React Router
  https://serverless-stack.com/chapters/code-splitting-in-create-react-app.html
*/

const LoadingComponent = ({isLoading, error}) => {
  if (isLoading) { // Handle the loading state
    return <div>Loading...</div>;
  } else if (error) {  // Handle the error state
    return <div>Sorry, there was a problem loading the page.</div>;
  } else {
    return null;
  }
};

const AsyncComponent = (component) => {
  return Loadable({
    loader: component,
    loading: LoadingComponent,
  });
};

export const Home = AsyncComponent(() => import('../Home'));
export const Login = AsyncComponent(() => import('../Login'));
export const ReturnPage = AsyncComponent(() => import('../ReturnPage'));
export const PageNotFound = AsyncComponent(() => import('../PageNotFound'));
export const ManageZone = AsyncComponent(() => import('../manageZone'));
export const ManageClient = AsyncComponent(() => import('../manageClient'));
export const RangeUsePlan = AsyncComponent(() => import('../rangeUsePlan'));
export const RupPDFView = AsyncComponent(() => import('../rangeUsePlan/RupPDFView'));
