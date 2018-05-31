import React from 'react';
import { shallow } from 'enzyme';
import EditRupSchedule from '../edit/EditRupSchedule';

const props = {};
const setupProps = () => {
  props.schedule = { year: 2018 };
  props.scheduleIndex = 1;
  props.onScheduleClicked = jest.fn();
  props.activeScheduleIndex = 1;
  props.usages = [{}];
  props.yearOptions = [{}];
  props.pastures = [{}];
  props.handleScheduleChange = jest.fn();
  props.handleScheduleCopy = jest.fn();
  props.handleScheduleDelete = jest.fn();
  props.livestockTypes = [{}];
  props.deleteRupScheduleEntry = jest.fn();
  props.isDeletingSchedule = false;
  props.isDeletingScheduleEntry = false;
};

beforeEach(() => {
  setupProps();
});

describe('EditRupSchedule', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<EditRupSchedule {...props} />);
  });

  describe('Event handlers', () => {

  });
});
