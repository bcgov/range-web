import React from 'react';
import { Navigate, useParams, useNavigate, useLocation } from 'react-router-dom';
import MainPage from '../mainPage';
import { LOGIN, EXPORT_PDF_WITH_PARAM, EMAIL_TEMPLATE } from '../../constants/routes';
import { isUserAdmin } from '../../utils';
import type { User } from '../../types';

// MainPage is a connected component — cast to accept any props
const AnyMainPage = MainPage as React.ComponentType<any>;

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  user: User | undefined;
  path?: string;
}

function ProtectedRoute({ component: Component, user, path }: ProtectedRouteProps) {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // v5-compatible match and history objects for components not yet migrated to hooks
  const match = {
    params,
    url: location.pathname,
    path: path || location.pathname,
  };

  const history = {
    push: (pathArg: any, state?: any) => {
      if (typeof pathArg === 'object') {
        navigate(pathArg.pathname, { state: pathArg.state || state });
      } else {
        navigate(pathArg, { state });
      }
    },
    replace: (pathArg: any, state?: any) => {
      if (typeof pathArg === 'object') {
        navigate(pathArg.pathname, { state: pathArg.state || state, replace: true });
      } else {
        navigate(pathArg, { state, replace: true });
      }
    },
    goBack: () => navigate(-1),
    location,
  };

  if (!user) {
    return <Navigate to={LOGIN} replace />;
  }

  switch (path) {
    // no need to pass the PDFView to MainPage
    case EXPORT_PDF_WITH_PARAM:
      return <Component match={match} history={history} location={location} />;

    // Admin Routes
    case EMAIL_TEMPLATE:
      if (isUserAdmin(user)) {
        return <AnyMainPage component={Component} user={user} match={match} history={history} location={location} />;
      }
      return <Navigate to={LOGIN} replace />;

    default:
      return <AnyMainPage component={Component} user={user} match={match} history={history} location={location} />;
  }
}

export default ProtectedRoute;
