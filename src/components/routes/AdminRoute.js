import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { LOGIN } from '../../constants/routes';
import LandingPage from '../LandingPage';
import User from '../../models/User';

const propTypes = {
  component: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  user: PropTypes.shape({}),
};

const defaultProps = {
  user: null,
};

const AdminRoute = ({ component: Component, user: u, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
        const user = new User(u);
        if (user.isAdmin) {
          return <LandingPage {...props} component={Component} />;
        }
        return <Redirect to={LOGIN} />;
      }
    }
  />
);

AdminRoute.propTypes = propTypes;
AdminRoute.defaultProps = defaultProps;
export default AdminRoute;
