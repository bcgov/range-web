import React from 'react';
import { shallow } from 'enzyme';
import { EditRupSchedules } from '../edit/EditRupSchedules';
import { getMockRangeUsePlan } from '../../agreement/test/mockValues';

const props = {};
const setupProps = () => {
  props.plan = getMockRangeUsePlan(2);
  props.usages = [{}];
  props.livestockTypes = [{}];
  props.handleSchedulesChange = jest.fn();
  props.deleteRupSchedule = jest.fn();
  props.deleteRupScheduleEntry = jest.fn();
  props.isDeletingSchedule = false;
  props.isDeletingScheduleEntry = false;
};

beforeEach(() => {
  setupProps();
});

describe('EditRupSchedules', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<EditRupSchedules {...props} />);
  });

  describe('Event handlers', () => {

  });
});
