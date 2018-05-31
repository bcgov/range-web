import React from 'react';
import { shallow } from 'enzyme';
import { ManageZone } from '../ManageZone';

const props = {};
const setupProps = () => {
  props.users = [];
  props.zones = [];
  props.getZones = jest.fn();
  props.assignStaffToZone = jest.fn(() => Promise.resolve({}));
  props.isAssigning = false;
  props.staffAssignedToZone = jest.fn();
};

beforeEach(() => {
  setupProps();
});

describe('ManageZone', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<ManageZone {...props} />);
    
  });

  describe('Event handlers', () => {
    it('`closeUpdateConfirmationModal` updates the state `isUpdateModalOpen` correctly', () => {
      const wrapper = shallow(<ManageZone {...props} />);
      wrapper.instance().closeUpdateConfirmationModal();
      expect(wrapper.state().isUpdateModalOpen).toEqual(false);

      wrapper.instance().openUpdateConfirmationModal();
      expect(wrapper.state().isUpdateModalOpen).toEqual(true);
    });

    it('`onContactChanged` updates the state `newContactId` correctly', () => {
      const wrapper = shallow(<ManageZone {...props} />);
      const mockContactId = 'mockContactId';
      wrapper.instance().onContactChanged({}, { value: mockContactId });

      expect(wrapper.state().newContactId).toEqual(mockContactId);
    });

    it('`onZoneChanged` updates the state `zone` and `currContactName` correctly', () => {
      const wrapper = shallow(<ManageZone {...props} />);
      const mockZoneId = 'mockZoneId';
      expect(wrapper.state().currContactName).toEqual(null);

      wrapper.instance().onZoneChanged({}, { value: mockZoneId });
      expect(wrapper.state().zoneId).toEqual(mockZoneId);
      expect(wrapper.state().currContactName).not.toEqual(null);
    });

    it('`assignStaffToZone` calls the right function', () => {
      const wrapper = shallow(<ManageZone {...props} />);
      wrapper.instance().assignStaffToZone();
      const { zoneId, newContactId: userId } = wrapper.state();

      expect(props.assignStaffToZone).toHaveBeenCalledWith(zoneId, userId);
    });
  });
});
