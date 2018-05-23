import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { RANGE_USE_PLANS } from '../../constants/routes';

const propTypes = {
  component: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  user: PropTypes.shape({}),
};

const defaultProps = {
  user: null,
};

/**
 * If we have a logged-in user, redirect to the home page. Otherwise, display the component.
 */
const PublicRoute = ({ component: Component, user, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (user) {
        return <Redirect to={RANGE_USE_PLANS} />;
      }
      return <Component {...props} />;
    }}
  />
);

PublicRoute.propTypes = propTypes;
PublicRoute.defaultProps = defaultProps;
export default PublicRoute;
