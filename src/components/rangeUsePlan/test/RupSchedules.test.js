import React from 'react';
import { shallow } from 'enzyme';
import RupSchedules from '../view/RupSchedules';
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

describe('RupSchedules', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<RupSchedules {...props} />);
  });

  describe('Event handlers', () => {

  });
});
