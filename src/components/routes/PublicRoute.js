import React from "react";
import { Route, Redirect } from "react-router-dom";
import { RANGE_USE_PLANS } from '../../constants/routes';
import PropTypes from 'prop-types';

const propTypes = {
  component: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  user: PropTypes.object,
};

/**
 * If we have a logged-in user, redirect to the home page. Otherwise, display the component.
 */
const PublicRoute = ({ component: Component, user, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      user
        ? <Redirect to={RANGE_USE_PLANS} />
        : <Component {...props} />
    }
  />
);

PublicRoute.propTypes = propTypes;
export default PublicRoute;