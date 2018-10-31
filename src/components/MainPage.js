import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Navbar from './Navbar';
import Toasts from './Toasts';
import ConfirmationModals from './ConfirmationModals';
import { Loading } from './common';
import { userHaveRole, isUserActive, registerAxiosInterceptors } from '../utils';
import { fetchReferences, fetchZones, signOut, fetchUser } from '../actionCreators';
import { getUser, getIsFetchingUser } from '../reducers/rootReducer';
import { USER_NOT_ACTIVE, USER_NO_ROLE } from '../constants/strings';

const propTypes = {
  component: PropTypes.func.isRequired,
  user: PropTypes.shape({}),
  signOut: PropTypes.func.isRequired,
  isFetchingUser: PropTypes.bool.isRequired,
  fetchZones: PropTypes.func.isRequired,
  fetchReferences: PropTypes.func.isRequired,
  fetchUser: PropTypes.func.isRequired,
};

const defaultProps = {
  user: undefined,
};

export class MainPage extends Component {
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
      return <Loading />;
    }

    if (!userHaveRole(user)) {
      return <section className="user-error">{USER_NO_ROLE}</section>;
    }

    if (!isUserActive(user)) {
      return <section className="user-error">{USER_NOT_ACTIVE}</section>;
    }

    return <Component {...rest} />;
  }

  render() {
    const {
      component: Component,
      user,
      isFetchingUser,
      confirmationModalsMap,
      ...rest
    } = this.props;

    return (
      <main>
        <Navbar {...rest} />

        {this.renderComponent()}

        <ConfirmationModals />

        <Toasts />

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

MainPage.propTypes = propTypes;
MainPage.defaultProps = defaultProps;
export default connect(mapStateToProps, {
  signOut,
  fetchReferences,
  fetchZones,
  fetchUser,
})(MainPage);
