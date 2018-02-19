import React from 'react';
import { shallow } from 'enzyme';
import RangeUsePlanList from '../RangeUsePlanList';
import { rangeUsePlans } from './mockValues';

const props = {};
const setupProps = () => {
  props.rangeUsePlans = rangeUsePlans; 
};

beforeEach(() => {
  setupProps();
});

describe('RangeUsePlanList', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<RangeUsePlanList {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders `RangeUsePlan` components correctly', () => {
    const wrapper = shallow(<RangeUsePlanList {...props} />);
    const numberOfPlans = props.rangeUsePlans.length;
    expect(wrapper.find('RangeUsePlan').length).toEqual(numberOfPlans);    
  });

  describe('Event handlers', () => {
    it('`handleActiveRow` set `activeIndex` state correctly', () => {
      const wrapper = shallow(<RangeUsePlanList {...props} />);
      const mockIndex = 0;
  
      wrapper.instance().handleActiveRow(mockIndex);
      expect(wrapper.state().activeIndex).toEqual(mockIndex);
  
      wrapper.instance().handleActiveRow(mockIndex);
      expect(wrapper.state().activeIndex).toEqual(-1);
    });
  });
});
