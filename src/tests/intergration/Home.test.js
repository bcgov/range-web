import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import _ from 'lodash';

import { axios } from '../../utils';
import Home from '../../components/Home';
import { storeAuthData, storeUser } from '../../actions';
import { getAgreements } from '../../reducers/rootReducer';
import { configureMockStore, flushAllPromises } from '../helpers/utils';
import { ELEMENT_ID } from '../../constants/variables';
import { mockRequestHeader, mockAgreements, mockAgreement } from './mockData';
import * as API from '../../constants/API';

// mock lodash debounce in jest
_.debounce = jest.fn(fn => fn);

let store;
const mockAxios = new MockAdapter(axios);
const mockAuthData = {
  access_token: 'mockToken',
};
const mockUser = {
  id: 'user_id',
};

beforeEach(() => {
  store = configureMockStore([thunk]);
  store.dispatch(storeAuthData(mockAuthData));
  store.dispatch(storeUser(mockUser));
  mockAxios.reset();
});
/* eslint-disable function-paren-newline */
describe('Integration testing', () => {
  it('Component initializes properly', async () => {
    const config = {
      ...mockRequestHeader(mockAuthData.access_token),
      params: { term: '', page: 1, limit: 10 },
    };

    mockAxios.onGet(API.SEARCH_AGREEMENTS_ENDPOINT, config).reply(200, mockAgreements);

    const wrapper = mount(
      <Provider store={store}>
        <BrowserRouter>
          <MemoryRouter initialEntries={['/home']}>
            <Home />
          </MemoryRouter>
        </BrowserRouter>
      </Provider>,
    );
    await flushAllPromises();
    // Forces a re-render
    wrapper.update();
    expect(getAgreements(store.getState())).toHaveLength(10);
  });

  describe('Browse functionalities', () => {
    it('search agreements by RAN number', async () => {
      const config = {
        ...mockRequestHeader(mockAuthData.access_token),
        params: { term: 'RAN075974', page: '1', limit: 10 },
      };

      mockAxios.onGet(API.SEARCH_AGREEMENTS_ENDPOINT, config).reply(200, mockAgreement);
      const wrapper = mount(
        <Provider store={store}>
          <BrowserRouter>
            <MemoryRouter initialEntries={['/home']}>
              <Home />
            </MemoryRouter>
          </BrowserRouter>
        </Provider>,
      );
      await flushAllPromises();
      wrapper.update();

      wrapper.find(`#${ELEMENT_ID.SEARCH_TERM}`).simulate('change', { target: { id: ELEMENT_ID.SEARCH_TERM, value: 'RAN075974' } });
      await flushAllPromises();
      wrapper.update();
      expect(getAgreements(store.getState())).toHaveLength(1);
    });
  });
});
