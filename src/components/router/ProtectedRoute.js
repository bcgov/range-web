import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import MainPage from '../MainPage';
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
              return <MainPage {...props} component={Component} user={user} />;
            }
            return <Redirect push to={LOGIN} />;
          }

          // no need to pass the RupPDFView to MainPage
          if (path === EXPORT_PDF_WITH_PARAM) {
            return <Component {...props} />;
          }

          return <MainPage {...props} component={Component} user={user} />;
        }

        // user is undefined redirect to the login page
        return <Redirect push to={LOGIN} />;
      }
    }
  />
);

export default ProtectedRoute;
