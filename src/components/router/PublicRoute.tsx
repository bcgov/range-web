// @ts-nocheck
import React from 'react';
import { Navigate } from 'react-router-dom';
import { HOME } from '../../constants/routes';

const PublicRoute = ({ component: Component, user }) => {
  if (user) {
    return <Navigate to={HOME} replace />;
  }
  return <Component />;
};

export default PublicRoute;
