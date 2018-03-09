import React from 'react';
import { shallow } from 'enzyme';
import { RangeUsePlansTableItem } from '../RangeUsePlansTableItem';
import { getMockRangeUsePlan } from './mockValues';
import { RANGE_USE_PLAN } from '../../../constants/routes';

const props = {};
const setupProps = () => {
  props.rangeUsePlan = getMockRangeUsePlan(1);
  props.history = {
    push: jest.fn(),
  }
};

beforeEach(() => {
  setupProps();
});

describe('RangeUsePlansTableItem', () => {
  xit('renders correctly', () => {
    const wrapper = shallow(<RangeUsePlansTableItem {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('push to the new route when clicking on Table.row', () => {
    const wrapper = shallow(<RangeUsePlansTableItem {...props} />);
    wrapper.simulate('click', {});

    expect(props.history.push).toHaveBeenCalledTimes(1);
    expect(props.history.push).toHaveBeenCalledWith(`${RANGE_USE_PLAN}/${props.rangeUsePlan.id}`);
  });

  describe('Event handlers', () => {
    it('onRowClicked is called to push to the new route', () => {
      const wrapper = shallow(<RangeUsePlansTableItem {...props} />);
      wrapper.instance().onRowClicked();

      expect(props.history.push).toHaveBeenCalledTimes(1);
      expect(props.history.push).toHaveBeenCalledWith(`${RANGE_USE_PLAN}/${props.rangeUsePlan.id}`);
    });
  });
});