import React from 'react';
import { shallow } from 'enzyme';
import RangeUsePlan from '../RangeUsePlan';
import { rangeUsePlan } from './mockValues';

const props = {};
const setupProps = () => {
  props.rangeUsePlan = rangeUsePlan(1);
  props.onViewClicked = jest.fn();
  props.index = 1;
  props.isActive = false;
};

beforeEach(() => {
  setupProps();
});

describe('RangeUsePlanPage', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<RangeUsePlan {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('bottom section becomes active when clicking on View button', () => {
    const wrapper = shallow(<RangeUsePlan {...props} />);
    expect(wrapper.find('.range-use-plan__bottom--hidden').exists()).toBe(true);    
    
    wrapper.find('Button').simulate('click', { preventDefault: jest.fn() });
    wrapper.setProps({ isActive: true });
    expect(props.onViewClicked).toHaveBeenCalledWith(props.index);
    expect(wrapper.find('.range-use-plan__bottom--hidden').exists()).toBe(false);    
  });

  describe('Event handlers', () => {
    it('`onViewClicked` calls props.onViewClicked', () => {
      const wrapper = shallow(<RangeUsePlan {...props} />);
      
      wrapper.instance().onViewClicked({ preventDefault: jest.fn() });
      expect(props.onViewClicked).toHaveBeenCalledWith(props.index);
    });
  });
});