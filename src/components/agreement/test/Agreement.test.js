import React from 'react';
import { shallow } from 'enzyme';
import { Agreement } from '../Agreement';

const props = {};
const setupProps = () => {
  props.searchAgreements = jest.fn();
  props.agreements = [],
  props.isLoading = false;
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
      const mockSearchTerm = 'search';
      const searchAgreementSpy = jest.spyOn(instance, 'searchAgreements');
      
      instance.handleSearchInput(mockSearchTerm);
      expect(searchAgreementSpy).toHaveBeenCalledWith(mockSearchTerm);
    });
  });
});