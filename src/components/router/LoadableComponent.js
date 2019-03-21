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

export const LoadableComponent = Component => (
  Loadable({
    loader: Component,
    loading: LoadingComponent,
  })
);
