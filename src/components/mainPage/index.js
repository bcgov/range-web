import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Navbar from './Navbar';
import Toasts from './Toasts';
import ConfirmationModals from './ConfirmationModals';
import InputModal from './InputModal';
import { registerAxiosInterceptors } from '../../utils';
import { fetchReferences, fetchZones, signOut } from '../../actionCreators';
import { reauthenticate } from '../../actions';
import SignInModal from './SignInModal';

export class MainPage extends Component {
  static propTypes = {
    component: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired,
    fetchZones: PropTypes.func.isRequired,
    fetchReferences: PropTypes.func.isRequired,
  }

  componentWillMount() {
    registerAxiosInterceptors(this.props.reauthenticate);
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

    return (
      <main>
        <Navbar {...rest} />

        <Component {...rest} />

        <ConfirmationModals />

        <InputModal />

        <SignInModal />

        <Toasts />

        <footer />
      </main>
    );
  }
}

export default connect(null, {
  signOut,
  reauthenticate,
  fetchReferences,
  fetchZones,
})(MainPage);
