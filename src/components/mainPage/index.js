//
// MyRangeBC
//
// Copyright © 2018 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Created by Kyubin Han.
//

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Navbar from './Navbar';
import Toasts from './Toasts';
import ConfirmationModals from './ConfirmationModals';
import InputModal from './InputModal';
import SignInModal from './SignInModal';
import UsernameInputModal from './UsernameInputModal';
import { Footer } from '../common';
import { registerAxiosInterceptors } from '../../utils';
import { fetchReferences, fetchZones, signOut, resetTimeoutForReAuth } from '../../actionCreators';
import { reauthenticate } from '../../actions';

export class MainPage extends Component {
  static propTypes = {
    component: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired,
    fetchZones: PropTypes.func.isRequired,
    fetchReferences: PropTypes.func.isRequired,
  }

  componentWillMount() {
    const { reauthenticate, resetTimeoutForReAuth } = this.props;
    resetTimeoutForReAuth(reauthenticate);
    registerAxiosInterceptors(resetTimeoutForReAuth, reauthenticate);
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

        <UsernameInputModal />

        <Toasts />

        <Footer withTopPad />
      </main>
    );
  }
}

export default connect(null, {
  signOut,
  reauthenticate,
  fetchReferences,
  fetchZones,
  resetTimeoutForReAuth,
})(MainPage);
