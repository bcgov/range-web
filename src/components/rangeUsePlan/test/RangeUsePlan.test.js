import React from 'react';
import { shallow } from 'enzyme';
import { RangeUsePlan } from '../RangeUsePlan';

const props = {};
const setupProps = () => {
  props.match = {
    params: {
      id: 'mockId',
    },
  }
};

const mockClick = jest.fn();

beforeEach(() => {
  setupProps();
});

RangeUsePlan.prototype.pdfLink = {
  click: mockClick,
}

describe('RangeUsePlan', () => {
  xit('renders correctly', () => {
    const wrapper = shallow(<RangeUsePlan {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  describe('Life cycles', () => {
    it('componentDidMount', () => {
      const wrapper = shallow(<RangeUsePlan {...props} />);
      expect(wrapper.state().id).toEqual(props.match.params.id);
    });
  });

  describe('Event handlers', () => {
    it('opening and closing modal events change states correctly', () => {
      const wrapper = shallow(<RangeUsePlan {...props} />);
      const instance = wrapper.instance();
      expect(wrapper.state().isCompletedModalOpen).toEqual(false);
      expect(wrapper.state().isPendingModalOpen).toEqual(false);

      instance.openCompletedConfirmModal();
      expect(wrapper.state().isCompletedModalOpen).toEqual(true);

      instance.closeCompletedConfirmModal();
      expect(wrapper.state().isCompletedModalOpen).toEqual(false);
      
      instance.openPendingConfirmModal();
      expect(wrapper.state().isPendingModalOpen).toEqual(true);
      
      instance.closePendingConfirmModal();
      expect(wrapper.state().isPendingModalOpen).toEqual(false);
    });

    it('onViewClicked calls the right function', () => {
      const wrapper = shallow(<RangeUsePlan {...props} />);
      wrapper.instance().onViewClicked();

      expect(mockClick).toHaveBeenCalled();
    });
  });
});