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
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/core';
import configureStore from '../configureStore';
import Router from './router';
import UserProvider from '../providers/UserProvider';
import ReferencesProvider from '../providers/ReferencesProvider';
import ToastProvider from '../providers/ToastProvider';
import EditableProvider from '../providers/EditableProvider';
import PlanProvider from '../providers/PlanProvider';
import theme from './theme';
import { SWRConfig } from 'swr';
import { ConfirmationModalProvider } from '../providers/ConfrimationModalProvider';

const store = configureStore();

class App extends Component {
  render() {
    return (
      <SWRConfig
        value={{
          revalidateIfStale: false,
          revalidateOnFocus: false,
          revalidateOnReconnect: false,
          shouldRetryOnError: false,
        }}
      >
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <UserProvider>
              <PlanProvider>
                <EditableProvider editable={true}>
                  <ReferencesProvider>
                    <ToastProvider>
                      <ConfirmationModalProvider>
                        <Router />
                      </ConfirmationModalProvider>
                    </ToastProvider>
                  </ReferencesProvider>
                </EditableProvider>
              </PlanProvider>
            </UserProvider>
          </ThemeProvider>
        </Provider>
      </SWRConfig>
    );
  }
}

export default App;
