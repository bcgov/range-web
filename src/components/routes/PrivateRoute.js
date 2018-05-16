import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { LOGIN } from '../../constants/routes';
import LandingPage from '../LandingPage';

const propTypes = {
  component: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  user: PropTypes.shape({}),
};

const defaultProps = {
  user: null,
};

/**
 * If we have a logged-in user, display the component, otherwise redirect to login page.
 */
const PrivateRoute = ({ component: Component, user, ...rest }) => (
  <Route
    {...rest}
    render={(props) => { // props = { match:{...}, history:{...}, location:{...} }
        if (user) {
          return <LandingPage {...props} component={Component} />;
        }
        return <Redirect to={LOGIN} />;
      }
    }
  />
);

PrivateRoute.propTypes = propTypes;
PrivateRoute.defaultProps = defaultProps;
export default PrivateRoute;
