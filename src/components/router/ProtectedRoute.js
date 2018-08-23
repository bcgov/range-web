import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import LandingPage from '../LandingPage';
import { MANAGE_CLIENT, MANAGE_ZONE, LOGIN, EXPORT_PDF_WITH_PARAM } from '../../constants/routes';
import { isUserAdmin } from '../../utils';

const ProtectedRoute = ({ component: Component, user, ...rest }) => (
  <Route
    {...rest}
    render={(props) => { // props = { match:{...}, history:{...}, location:{...} }
        if (user) {
          const { path } = props.match;

          // Admin Routes
          if (path === MANAGE_CLIENT || path === MANAGE_ZONE) {
            if (isUserAdmin(user)) {
              return <LandingPage {...props} component={Component} />;
            }
            return <Redirect push to={LOGIN} />;
          }

          // no need to pass the RupPDFView to LandingPage
          if (path === EXPORT_PDF_WITH_PARAM) {
            return <Component {...props} />;
          }

          return <LandingPage {...props} component={Component} />;
        }

        // user is undefined redirect to the login page
        return <Redirect push to={LOGIN} />;
      }
    }
  />
);

export default ProtectedRoute;
