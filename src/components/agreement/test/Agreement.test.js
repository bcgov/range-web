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
  props.history = {
    location: {
      search: '',
    },
  };
};

beforeEach(() => {
  setupProps();
});

describe('Agreement', () => {
  xit('renders correctly', () => {
    const wrapper = shallow(<Agreement {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders `AgreementSearch and AgreementTable`', () => {
    const wrapper = shallow(<Agreement {...props} />);
    expect(wrapper.find('AgreementSearch').exists()).toBe(true);    
    expect(wrapper.find('AgreementTable').exists()).toBe(true);    
  });

  describe('Event handlers', () => {
    it('`handleSearchInput` calls searchTenureAgreement function', () => {
      const wrapper = shallow(<Agreement {...props} />);
      const instance = wrapper.instance();
      // const mockSearchTerm = 'search';
      // const searchAgreementSpy = jest.spyOn(instance, 'searchAgreements');
      
      // instance.handleSearchInput(mockSearchTerm);
      // expect(searchAgreementSpy).toHaveBeenCalledWith(mockSearchTerm);
    });
  });
});