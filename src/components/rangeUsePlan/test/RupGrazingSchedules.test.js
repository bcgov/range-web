import React from 'react';
import { shallow } from 'enzyme';
import RupGrazingSchedules from '../view/RupGrazingSchedules';
import { getMockRangeUsePlan } from '../../agreement/test/mockValues';

const mockStatus = { id: 1, name: 'name' };

const props = {};
const setupProps = () => {
  props.plan = getMockRangeUsePlan(2).plan;
  props.status = mockStatus;
  props.livestockTypes = [{}];
  props.usages = [{}];
};

beforeEach(() => {
  setupProps();
});

describe('RupGrazingSchedules', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<RupGrazingSchedules {...props} />);
  });

  describe('Event handlers', () => {

  });
});
