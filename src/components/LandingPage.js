import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Offline } from 'react-detect-offline';
import Navbar from './Navbar';
import Toast from './Toast';
import { userHaveRole, isUserActive, registerAxiosInterceptors } from '../utils';
import { fetchUser, fetchReferences, fetchZones, signOut } from '../actionCreators';
import { getUser } from '../reducers/rootReducer';
import { USER_NOT_ACTIVE, NO_INTERNET } from '../constants/strings';

const propTypes = {
  component: PropTypes.func.isRequired,
  user: PropTypes.shape({}),
  signOut: PropTypes.func.isRequired,
  fetchUser: PropTypes.func.isRequired,
  fetchZones: PropTypes.func.isRequired,
  fetchReferences: PropTypes.func.isRequired,
};
const defaultProps = {
  user: undefined,
};

export class LandingPage extends Component {
  componentWillMount() {
    registerAxiosInterceptors(this.props.signOut);
  }

  componentDidMount() {
    const { fetchReferences, fetchZones, fetchUser } = this.props;
    fetchReferences();
    fetchZones();
    fetchUser();
  }

  render() {
    const { component: Component, user, ...rest } = this.props;

    return (
      <main>
        <Navbar {...rest} />

        <Offline>
          <section className="offline">{NO_INTERNET}</section>
        </Offline>

        { !isUserActive(user) &&
          <section className="user-not-active">{USER_NOT_ACTIVE}</section>
        }

        { userHaveRole(user) &&
          <Component {...rest} />
        }

        <Toast />

        <footer />
      </main>
    );
  }
}

const mapStateToProps = state => (
  {
    user: getUser(state),
  }
);

LandingPage.propTypes = propTypes;
LandingPage.defaultProps = defaultProps;
export default connect(mapStateToProps, {
  signOut,
  fetchUser,
  fetchReferences,
  fetchZones,
})(LandingPage);
