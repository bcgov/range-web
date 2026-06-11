import React from 'react';
import { Navigate } from 'react-router-dom';
import { HOME } from '../../constants/routes';
import type { User } from '../../types';

interface PublicRouteProps {
  component: React.ComponentType<any>;
  user: User | undefined;
}

function PublicRoute({ component: Component, user }: PublicRouteProps) {
  if (user) {
    return <Navigate to={HOME} replace />;
  }
  return <Component />;
}

export default PublicRoute;
