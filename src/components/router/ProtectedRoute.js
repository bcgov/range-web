import React from 'react';
import { Navigate, useParams, useNavigate, useLocation } from 'react-router-dom';
import MainPage from '../mainPage';
import { LOGIN, EXPORT_PDF_WITH_PARAM, EMAIL_TEMPLATE } from '../../constants/routes';
import { isUserAdmin } from '../../utils';

const ProtectedRoute = ({ component: Component, user, path }) => {
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
    push: (path, state) => {
      if (typeof path === 'object') {
        navigate(path.pathname, { state: path.state || state });
      } else {
        navigate(path, { state });
      }
    },
    replace: (path, state) => {
      if (typeof path === 'object') {
        navigate(path.pathname, { state: path.state || state, replace: true });
      } else {
        navigate(path, { state, replace: true });
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
        return <MainPage component={Component} user={user} match={match} history={history} location={location} />;
      }
      return <Navigate to={LOGIN} replace />;

    default:
      return <MainPage component={Component} user={user} match={match} history={history} location={location} />;
  }
};

export default ProtectedRoute;
