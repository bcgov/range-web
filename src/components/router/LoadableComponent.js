import React from 'react';
import Loadable from 'react-loadable';
import { Loading, ErrorPage } from '../common';

/*
  Code Splitting with React Router
  https://serverless-stack.com/chapters/code-splitting-in-create-react-app.html
*/

const LoadingComponent = ({ isLoading, error }) => {
  let component;
  if (isLoading) { // Handle the loading state
    component = <Loading />;
  } else if (error) { // Handle the error state
    component = <ErrorPage message="Sorry, there was a problem loading the page." />;
  }

  return component;
};

const LoadableComponent = Component => (
  Loadable({
    loader: Component,
    loading: LoadingComponent,
  })
);

export const SelectRangeUsePlan = LoadableComponent(() => import('../selectRangeUsePlan'));
export const LoginPage = LoadableComponent(() => import('../auth/LoginPage'));
export const ReturnPage = LoadableComponent(() => import('../ReturnPage'));
export const PageNotFound = LoadableComponent(() => import('../PageNotFound'));
export const ManageZone = LoadableComponent(() => import('../manageZone'));
export const ManageClient = LoadableComponent(() => import('../manageClient'));
export const RangeUsePlan = LoadableComponent(() => import('../rangeUsePlan'));
export const PDFView = LoadableComponent(() => import('../rangeUsePlan/pdf/PDFView'));
