import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from 'prop-types';

import { LOGIN } from '../../constants/routes';

const propTypes = {
  component: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  user: PropTypes.object,
};

/**
 * If we have a logged-in user, display the component, otherwise redirect to login page.
 */
const PrivateRoute = ({ component: Component, user, ...rest }) => (
  <Route
    {...rest}
    render = {props => // props = { match:{...}, history:{...}, location:{...} }
      user
        ? <Component {...props} />
        : <Redirect to={LOGIN} /> 
    }
  />
);

PrivateRoute.propTypes = propTypes;
export default PrivateRoute;
