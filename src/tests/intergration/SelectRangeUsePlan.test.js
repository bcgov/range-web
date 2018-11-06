import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';
import { MemoryRouter, withRouter } from 'react-router-dom';
import { axios } from '../../utils';
import SelectRangeUsePlan from '../../components/selectRangeUsePlan';
import { storeAuthData, storeUser, storeReferences } from '../../actions';
import { getAgreements } from '../../reducers/rootReducer';
import { configureMockStore, flushAllPromises } from '../helpers/utils';
import { ELEMENT_ID } from '../../constants/variables';
import { mockRequestHeader, mockAgreements, mockAgreement, mockReference } from './mockData';
import * as API from '../../constants/api';

jest.mock('lodash.debounce');

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
  store.dispatch(storeReferences(mockReference));
  mockAxios.reset();
});
/* eslint-disable function-paren-newline */
describe('Integration testing', () => {
  it('Component initializes properly', async () => {
    const config = {
      ...mockRequestHeader(store.getState),
      params: { term: '', page: 1, limit: 10 },
    };

    mockAxios.onGet(API.SEARCH_AGREEMENTS, config).reply(200, mockAgreements);

    const SelectRangeUsePlanWithRouter = withRouter(SelectRangeUsePlan);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/home']}>
          <SelectRangeUsePlanWithRouter />
        </MemoryRouter>
      </Provider>,
    );

    await flushAllPromises();
    // Forces a re-render
    wrapper.update();
    expect(getAgreements(store.getState())).toHaveLength(10);
  });

  describe('Browse functionalities', () => {
    it('search agreements by RAN number', async () => {
      let config = {
        ...mockRequestHeader(store.getState),
        params: { term: '', page: 1, limit: 10 },
      };
      mockAxios.onGet(API.SEARCH_AGREEMENTS, config).reply(200, mockAgreements);
      config = { ...config, params: { term: 'RAN075974', page: 1, limit: 10 } };
      mockAxios.onGet(API.SEARCH_AGREEMENTS, config).reply(200, mockAgreement);

      const SelectRangeUsePlanWithRouter = withRouter(SelectRangeUsePlan);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/home']}>
            <SelectRangeUsePlanWithRouter />
          </MemoryRouter>
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
