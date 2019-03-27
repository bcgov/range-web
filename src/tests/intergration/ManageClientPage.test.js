import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { MemoryRouter, withRouter } from 'react-router-dom';
import thunk from 'redux-thunk';
import { axios } from '../../utils';
import ManageClientPage from '../../components/manageClientPage';
import { storeAuthData, storeReferences } from '../../actions';
import { configureMockStore, flushAllPromises } from '../helpers/utils';
import { requestMockHeader, mockUsers, mockReference, mockAuthData } from './mockData';
import * as API from '../../constants/api';

let store;
const mockAxios = new MockAdapter(axios);

beforeEach(() => {
  store = configureMockStore([thunk]);
  store.dispatch(storeAuthData(mockAuthData));
  store.dispatch(storeReferences(mockReference));
  mockAxios.reset();
});

describe('Integration testing', () => {
  it('Component initializes properly', async () => {
    const config = {
      ...requestMockHeader(store.getState),
    };

    mockAxios.onGet(API.GET_USERS, config).reply(200, mockUsers);

    const ManageClientWithRouter = withRouter(ManageClientPage);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['manage-client']}>
          <ManageClientWithRouter />
        </MemoryRouter>
      </Provider>,
    );


    await flushAllPromises();
    wrapper.update();

    expect(wrapper.find('DropdownItem')).toHaveLength(mockUsers.length);
  });
});
