import React from 'react';
import { shallow } from 'enzyme';
import EditRupGrazingScheduleEntry from '../edit/EditRupGrazingScheduleEntry';

const props = {};
const setupProps = () => {
  props.year = 2018;
  props.entry = {};
  props.entryIndex = 1;
  props.pastures = [{}];
  props.pastureOptions = [{}];
  props.livestockTypes = [{}];
  props.livestockTypeOptions = [{}];
  props.handleScheduleEntryChange = jest.fn();
  props.handleScheduleEntryCopy = jest.fn();
  props.handleScheduleEntryDelete = jest.fn();
  props.isDeletingScheduleEntry = false;
};

beforeEach(() => {
  setupProps();
});

describe('EditRupGrazingScheduleEntry', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<EditRupGrazingScheduleEntry {...props} />);
  });

  describe('Event handlers', () => {

  });
});
