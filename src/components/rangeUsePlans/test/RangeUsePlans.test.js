import React from 'react';
import { shallow } from 'enzyme';
import { RangeUsePlans } from '../RangeUsePlans';

const props = {};
const setupProps = () => {
  props.rangeUsePlans = [];
  props.getRangeUsePlans = jest.fn();
  props.rangeUsePlanState = {
    isLoading: false,
    rangeUsePlans: [],
    success: false,
    totalPages: 1,
    currentPage: 1,
    errorResponse: {},
  }
};

beforeEach(() => {
  setupProps();
});

describe('RangeUsePlans', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<RangeUsePlans {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders `RangeUsePlanSearch and RangeUsePlanTable`', () => {
    const wrapper = shallow(<RangeUsePlans {...props} />);
    expect(wrapper.find('RangeUsePlansSearch').exists()).toBe(true);    
    expect(wrapper.find('RangeUsePlansTable').exists()).toBe(true);    
  });

  describe('Event handlers', () => {
    it('`handleSearchInput` calls getRangeUsePlans function', () => {
      const wrapper = shallow(<RangeUsePlans {...props} />);
      const instance = wrapper.instance();
      const mockSearchTerm = 'search';
      const searchTenureAgreementsSpy = jest.spyOn(instance, 'searchRangeUsePlans');
      
      instance.handleSearchInput(mockSearchTerm);
      expect(searchTenureAgreementsSpy).toHaveBeenCalledWith(mockSearchTerm);
    });
  });
});