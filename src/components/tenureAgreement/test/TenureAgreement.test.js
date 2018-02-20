import React from 'react';
import { shallow } from 'enzyme';
import { TenureAgreement } from '../TenureAgreement';

const props = {};
const setupProps = () => {
  props.rangeUsePlans = [];
  props.searchTenureAgreements = jest.fn();
};

beforeEach(() => {
  setupProps();
});

describe('TenureAgreement', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<TenureAgreement {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders `TenureAgreementSearch and TenureAgreementList`', () => {
    const wrapper = shallow(<TenureAgreement {...props} />);
    expect(wrapper.find('TenureAgreementSearch').exists()).toBe(true);    
    expect(wrapper.find('TenureAgreementList').exists()).toBe(true);    
  });

  describe('Event handlers', () => {
    it('`handleSearchInput` calls searchTenureAgreements function', () => {
      const wrapper = shallow(<TenureAgreement {...props} />);
      const instance = wrapper.instance();
      const mockSearchTerm = 'search';
      const searchTenureAgreementsSpy = jest.spyOn(instance, 'searchTenureAgreements');
      
      instance.handleSearchInput(mockSearchTerm);
      expect(searchTenureAgreementsSpy).toHaveBeenCalledWith(mockSearchTerm);
    });
  });
});