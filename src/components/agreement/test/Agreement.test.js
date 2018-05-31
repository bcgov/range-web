import React from 'react';
import { shallow } from 'enzyme';
import { Agreement } from '../Agreement';
import { getMockAgreements } from './mockValues';

const props = {};
const setupProps = () => {
  props.agreementsState = {
    isLoading: false,
    currentPage: 1,
    totalPages: 1,
    data: getMockAgreements(3),
  };
  props.user = {};
  props.history = {
    push: jest.fn(),
    location: {
      pathname: 'mockPathname',
      search: '?mock=search',
    },
  };
};

beforeEach(() => {
  setupProps();
});

describe('Agreement', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<Agreement {...props} />);
    
  });

  it('renders `AgreementSearch and AgreementTable`', () => {
    const wrapper = shallow(<Agreement {...props} />);
    expect(wrapper.find('AgreementSearch').exists()).toBe(true);    
    expect(wrapper.find('AgreementTable').exists()).toBe(true);    
  });

  describe('Event handlers', () => {
    it('`handleSearchInput` and `handlePaginationChange` push to a different route', () => {
      const wrapper = shallow(<Agreement {...props} />);
      const instance = wrapper.instance();
      const mockSearchTerm = 'mock';
      const mockPage = 'mockPage';
      instance.handleSearchInput(mockSearchTerm);
      expect(props.history.push).toHaveBeenCalled();

      instance.handlePaginationChange(mockPage);
      expect(props.history.push).toHaveBeenCalled();
    });
  });
});
