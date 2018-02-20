import React from 'react';
import { shallow } from 'enzyme';
import { RangeUsePlanPage } from '../RangeUsePlanPage';

const props = {};
const setupProps = () => {
  props.rangeUsePlans = [];
  props.searchRangeUsePlans = jest.fn();
};

beforeEach(() => {
  setupProps();
});

describe('RangeUsePlanPage', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<RangeUsePlanPage {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders `RangeUsePlanSearch and RangeUsePlanList`', () => {
    const wrapper = shallow(<RangeUsePlanPage {...props} />);
    expect(wrapper.find('RangeUsePlanSearch').exists()).toBe(true);    
    expect(wrapper.find('RangeUsePlanList').exists()).toBe(true);    
  });

  describe('Event handlers', () => {
    it('`handleSearchInput` calls searchRangeUsePlans function', () => {
      const wrapper = shallow(<RangeUsePlanPage {...props} />);
      const instance = wrapper.instance();
      const mockSearchTerm = 'search';
      const searchRangeUsePlansSpy = jest.spyOn(instance, 'searchRangeUsePlans');
      
      instance.handleSearchInput(mockSearchTerm);
      expect(searchRangeUsePlansSpy).toHaveBeenCalledWith(mockSearchTerm);
    });
  });
});