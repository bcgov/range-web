import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Navbar from './Navbar';
import Toasts from './Toasts';
import ConfirmationModals from './ConfirmationModals';
import { DoesUserHaveRole, isUserActive, registerAxiosInterceptors } from '../../utils';
import { fetchReferences, fetchZones, signOut } from '../../actionCreators';

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
      ...rest
    } = this.props;
    const { user } = rest;

    return (
      <main>
        <Navbar {...rest} />

        { isUserActive(user) && DoesUserHaveRole(user) &&
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
