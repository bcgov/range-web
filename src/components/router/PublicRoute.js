import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { HOME } from '../../constants/routes';

const PublicRoute = ({ component: Component, user, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (user) {
        return <Redirect push to={HOME} />;
      }
      return <Component {...props} />;
    }}
  />
);

export default PublicRoute;
