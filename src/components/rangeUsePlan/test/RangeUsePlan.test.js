import React from 'react';
import { shallow } from 'enzyme';
import { RangeUsePlan } from '../RangeUsePlan';
import { getMockRangeUsePlan } from '../../aagreement/test/mockValues'
import { COMPLETED, PENDING } from '../../../constants/variables';

const mockStatus = { id: 1, name: 'name' };

const props = {};
const setupProps = () => {
  props.agreement = getMockRangeUsePlan(2);
  props.statuses = [mockStatus];
  props.newStatus = { id: 2, name: 'name' };
  props.isUpdatingStatus = false;
  props.updateRupStatus = jest.fn(() => Promise.resolve({}));
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

    it('onYesSomethingClicked calls the right function', () => {
      const wrapper = shallow(<RangeUsePlan {...props} />);
      const instance = wrapper.instance();
      const updateStatusSpy = jest.spyOn(instance, 'updateStatus');
      const closeCompletedConfirmModalSpy = jest.spyOn(instance, 'closeCompletedConfirmModal');
      const closePendingConfirmModalSpy = jest.spyOn(instance, 'closePendingConfirmModal');

      instance.onYesCompletedClicked();
      expect(updateStatusSpy).toHaveBeenCalledWith(COMPLETED, closeCompletedConfirmModalSpy);

      instance.onYesPendingClicked();
      expect(updateStatusSpy).toHaveBeenCalledWith(PENDING, closePendingConfirmModalSpy);
    });

    it('updateStatus calls the right function', () => {
      const wrapper = shallow(<RangeUsePlan {...props } />);
      const instance = wrapper.instance();
      const mockCloseConfirmModal = jest.fn();

      instance.updateStatus({}, mockCloseConfirmModal);
      expect(props.updateRupStatus).not.toBeCalled();

      instance.updateStatus(mockStatus.name, mockCloseConfirmModal);
      const requestData = { 
        planId: props.agreement.plans[0].id,
        statusId: mockStatus.id,
      };
      expect(props.updateRupStatus).toHaveBeenCalledWith(requestData);
    });
  });
});