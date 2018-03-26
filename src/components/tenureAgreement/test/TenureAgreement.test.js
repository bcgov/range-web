import React from 'react';
import { shallow } from 'enzyme';
import { TenureAgreement } from '../TenureAgreement';

const props = {};
const setupProps = () => {
  props.searchTenureAgreements = jest.fn();
  props.tenureAgreements = [],
  props.isLoading = false;
};

beforeEach(() => {
  setupProps();
});

describe('TenureAgreement', () => {
  xit('renders correctly', () => {
    const wrapper = shallow(<TenureAgreement {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders `TenureAgreementSearch and TenureAgreementTable`', () => {
    const wrapper = shallow(<TenureAgreement {...props} />);
    expect(wrapper.find('TenureAgreementSearch').exists()).toBe(true);    
    expect(wrapper.find('TenureAgreementTable').exists()).toBe(true);    
  });

  describe('Event handlers', () => {
    it('`handleSearchInput` calls searchTenureAgreement function', () => {
      const wrapper = shallow(<TenureAgreement {...props} />);
      const instance = wrapper.instance();
      const mockSearchTerm = 'search';
      const searchTenureAgreementSpy = jest.spyOn(instance, 'searchTenureAgreements');
      
      instance.handleSearchInput(mockSearchTerm);
      expect(searchTenureAgreementSpy).toHaveBeenCalledWith(mockSearchTerm);
    });
  });
});