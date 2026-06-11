//
// MyRangeBC
//
// Copyright © 2018 Province of British Columbia
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

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Navbar from './Navbar';
import Toasts from './Toasts';
import ConfirmModals from './ConfirmModals';
import InputModal from './InputModal';
import SignInModal from './SignInModal';
import UsernameInputModal from './UsernameInputModal';
import { Footer } from '../common';
import { registerAxiosInterceptors } from '../../utils';
import { resetTimeoutForReAuth } from '../../actionCreators';
import { reauthenticate, storeAuthData } from '../../actions';
import { AppDispatch } from '../../configureStore';

interface MainPageProps {
  component: React.ComponentType<any>;
  [key: string]: any;
}

function MainPage({ component: Component, ...rest }: MainPageProps) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const reauthenticateFn = () => dispatch(reauthenticate() as any);
    const resetTimeoutFn = (reauth: any) => dispatch(resetTimeoutForReAuth(reauth) as any);
    const storeAuthFn = (data: any) => dispatch(storeAuthData(data));
    registerAxiosInterceptors(resetTimeoutFn, reauthenticateFn, storeAuthFn);
    resetTimeoutFn(reauthenticateFn);
  }, [dispatch]);

  return (
    <main>
      <Navbar {...rest} />

      <Component {...rest} />

      <ConfirmModals />

      <InputModal />

      <SignInModal />

      <UsernameInputModal />

      <Toasts />

      <Footer withTopMargin />
    </main>
  );
}

export default MainPage;
