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

export const Home = Loadable({
  loader: () => import('../Home'),
  loading: LoadingComponent,
});

export const Login = Loadable({
  loader: () => import('../Login'),
  loading: LoadingComponent,
});

export const ReturnPage = Loadable({
  loader: () => import('../ReturnPage'),
  loading: LoadingComponent,
});

export const PageNotFound = Loadable({
  loader: () => import('../PageNotFound'),
  loading: LoadingComponent,
});

export const ManageZone = Loadable({
  loader: () => import('../manageZone'),
  loading: LoadingComponent,
});

export const ManageClient = Loadable({
  loader: () => import('../manageClient'),
  loading: LoadingComponent,
});

export const RangeUsePlan = Loadable({
  loader: () => import('../rangeUsePlan'),
  loading: LoadingComponent,
});

export const RupPDFView = Loadable({
  loader: () => import('../rangeUsePlan/RupPDFView'),
  loading: LoadingComponent,
});