import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import MainPage from '../mainPage';
import { LOGIN, EXPORT_PDF_WITH_PARAM, MANAGE_CLIENT, MANAGE_ZONE } from '../../constants/routes';
import { isUserAdmin } from '../../utils';

const ProtectedRoute = ({ component: Component, user, ...rest }) => (
  <Route
    {...rest}
    render={(props) => { // props = { match:{...}, history:{...}, location:{...} }
        const mainPage = <MainPage {...props} component={Component} user={user} />;
        const redirectToLogin = <Redirect push to={LOGIN} />;

        if (user) {
          const { path } = props.match;

          switch (path) {
            // no need to pass the PDFView to MainPage
            case EXPORT_PDF_WITH_PARAM:
              return <Component {...props} />;

            // Admin Routes
            case MANAGE_CLIENT:
            case MANAGE_ZONE:
              if (isUserAdmin(user)) {
                return mainPage;
              }
              return redirectToLogin;

            default:
              return mainPage;
          }
        }

        // user is undefined redirect to the login page
        return redirectToLogin;
      }
    }
  />
);

export default ProtectedRoute;
