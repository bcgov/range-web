import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { normalize } from 'normalizr';
import { MemoryRouter, withRouter } from 'react-router-dom';
import thunk from 'redux-thunk';
import { axios } from '../../utils';
import RangeUsePlan from '../../components/rangeUsePlan';
import { storeAuthData, storeReferences } from '../../actions';
import { configureMockStore, flushAllPromises } from '../helpers/utils';
import { requestMockHeader, mockPlan, mockReference, mockAuthData } from './mockData';
import * as API from '../../constants/api';
import * as schema from '../../actionCreators/schema';
import { getPlansMap } from '../../reducers/rootReducer';
import { USER_ROLE } from '../../constants/variables';

let store;
const mockAxios = new MockAdapter(axios);
const mockOfficerUser = {
  id: 1,
  roles: [USER_ROLE.RANGE_OFFICER],
};

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

    // can't inject match object with MemoryRouter to read planId
    // so register an endpoint without planId given
    mockAxios.onGet(API.GET_RUP(), config).reply(200, mockPlan);

    const RangeUsePlanWithRouter = withRouter(RangeUsePlan);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/range-use-plan/${mockPlan.id}`]}>
          <RangeUsePlanWithRouter user={mockOfficerUser} />
        </MemoryRouter>
      </Provider>,
    );

    await flushAllPromises();
    // Forces a re-render
    wrapper.update();

    const plansMap = getPlansMap(store.getState());
    const normalizedPlan = normalize(mockPlan, schema.plan).entities.plans[mockPlan.id];

    // see if the plan is stored correctly in Redux store
    expect(plansMap[mockPlan.id]).toEqual(normalizedPlan);
  });
});
