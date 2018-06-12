import React from 'react';
import { shallow } from 'enzyme';
import EditRupGrazingSchedule from '../edit/EditRupGrazingSchedule';

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

describe('EditRupGrazingSchedule', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<EditRupGrazingSchedule {...props} />);
  });

  describe('Event handlers', () => {

  });
});
