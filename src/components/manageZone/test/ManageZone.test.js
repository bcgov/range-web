import React from 'react';
import { shallow } from 'enzyme';
import { ManageZone } from '../ManageZone';

const props = {};
const setupProps = () => {
  // props.
};

beforeEach(() => {
  setupProps();
});

describe('ManageZone', () => {
  xit('renders correctly', () => {
    const wrapper = shallow(<ManageZone {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  describe('Event handlers', () => {
    xit('`closeUpdateConfirmationModal` updates the state `isUpdateModalOpen` correctly', () => {
      const wrapper = shallow(<ManageZone {...props} />);
      wrapper.instance().closeUpdateConfirmationModal();
      expect(wrapper.state().isUpdateModalOpen).toEqual(false);

      wrapper.instance().openUpdateConfirmationModal();
      expect(wrapper.state().isUpdateModalOpen).toEqual(true);
    });

    xit('`onContactChanged` updates the state `newContact` correctly', () => {
      const wrapper = shallow(<ManageZone {...props} />);
      const mockValue = 'mockValue';
      wrapper.instance().onContactChanged({}, { value: mockValue });

      expect(wrapper.state().newContact).toEqual(mockValue);      
    });

    xit('`onZoneChanged` updates the state `zone` and `currContact` correctly', () => {
      const wrapper = shallow(<ManageZone {...props} />);
      const mockValue = 'mockValue';
      expect(wrapper.state().currContact).toEqual(null);    
      
      wrapper.instance().onZoneChanged({}, { value: mockValue });
      expect(wrapper.state().zone).toEqual(mockValue);
      expect(wrapper.state().currContact).not.toEqual(null);    
    });
  });
});
