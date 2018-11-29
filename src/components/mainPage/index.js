import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Navbar from './Navbar';
import Toasts from './Toasts';
import ConfirmationModals from './ConfirmationModals';
import { DoesUserHaveRole, isUserActive, registerAxiosInterceptors } from '../../utils';
import { fetchReferences, fetchZones, signOut } from '../../actionCreators';
import { USER_NOT_ACTIVE, USER_NO_ROLE } from '../../constants/strings';

export class MainPage extends Component {
  static propTypes = {
    component: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired,
    fetchZones: PropTypes.func.isRequired,
    fetchReferences: PropTypes.func.isRequired,
  }

  componentWillMount() {
    registerAxiosInterceptors(this.props.signOut);
  }

  componentDidMount() {
    const { fetchReferences, fetchZones } = this.props;
    fetchReferences();
    fetchZones();
  }

  render() {
    const {
      component: Component,
      confirmationModalsMap,
      ...rest
    } = this.props;
    const { user } = rest;
    const userActive = isUserActive(user);
    const userHaveRole = DoesUserHaveRole(user);
    const userActiveAndHaveRole = userActive && userHaveRole;

    return (
      <main>
        <Navbar {...rest} />

        { !userHaveRole &&
          <section className="user-error">{USER_NO_ROLE}</section>
        }

        { userHaveRole && !userActive &&
          <section className="user-error">{USER_NOT_ACTIVE}</section>
        }

        { userActiveAndHaveRole &&
          <Component {...rest} />
        }

        <ConfirmationModals />

        <Toasts />

        <footer />
      </main>
    );
  }
}

export default connect(null, {
  signOut,
  fetchReferences,
  fetchZones,
})(MainPage);
