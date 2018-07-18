import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import { Offline } from 'react-detect-offline';
import Navbar from './Navbar';
import Toast from './Toast';
import { Loading } from './common';
import { userHaveRole, isUserActive, registerAxiosInterceptors } from '../utils';
import { fetchUser, fetchReferences, fetchZones, signOut } from '../actionCreators';
import { getUser, getIsFetchingUser } from '../reducers/rootReducer';
import { USER_NOT_ACTIVE, USER_NO_ROLE, LOADING_USER } from '../constants/strings';

const propTypes = {
  component: PropTypes.func.isRequired,
  user: PropTypes.shape({}),
  signOut: PropTypes.func.isRequired,
  isFetchingUser: PropTypes.bool.isRequired,
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

  renderComponent() {
    const {
      component: Component,
      user,
      isFetchingUser,
      ...rest
    } = this.props;

    if (isFetchingUser) {
      return <Loading message={LOADING_USER} />;
    }

    if (!isUserActive(user)) {
      return <section className="user-error">{USER_NOT_ACTIVE}</section>;
    }

    if (!userHaveRole(user)) {
      return <section className="user-error">{USER_NO_ROLE}</section>;
    }

    return <Component {...rest} />;
  }

  render() {
    const {
      component: Component,
      user,
      isFetchingUser,
      ...rest
    } = this.props;

    return (
      <main>
        <Navbar {...rest} />

        {/* <Offline>
          <section className="offline">{NO_INTERNET}</section>
        </Offline> */}

        {this.renderComponent()}

        <Toast />

        <footer />
      </main>
    );
  }
}

const mapStateToProps = state => (
  {
    user: getUser(state),
    isFetchingUser: getIsFetchingUser(state),
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
