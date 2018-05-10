import React from 'react';
import { shallow } from 'enzyme';
import { Rup } from '../Rup';
import { getMockRangeUsePlan } from '../../agreement/test/mockValues';
import { COMPLETED, PENDING, PRIMARY_TYPE, OTHER_TYPE } from '../../../constants/variables';

const mockStatus = { id: 1, name: 'name' };
const mockPDFLinkClick = jest.fn();

const props = {};
const setupProps = () => {
  props.agreement = getMockRangeUsePlan(2);
  props.updateRupStatus = jest.fn(() => Promise.resolve({}));
  props.statuses = [mockStatus];
  props.isUpdatingStatus = false;
  props.isDownloadingPDF = false;
  props.livestockTypes = [{}];
  props.user = {};
};

beforeEach(() => {
  setupProps();
});

Rup.prototype.pdfLink = {
  click: mockPDFLinkClick,
};

describe('Rup', () => {
  xit('renders correctly', () => {
    const wrapper = shallow(<Rup {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  xit('`getAgreementHolders` returns agreementholders', () => {
    const wrapper = shallow(<Rup {...props} />);
    const instance = wrapper.instance();
    let mockClients;
    const primaryAgreementHolder = {};
    const otherAgreementHolders = [];
    expect(instance.getAgreementHolders(mockClients))
      .toEqual({ primaryAgreementHolder, otherAgreementHolders });

    primaryAgreementHolder.clientTypeCode = PRIMARY_TYPE;
    const mockOtherAgreementHolder = { clientTypeCode: OTHER_TYPE };
    otherAgreementHolders.push(mockOtherAgreementHolder);
    mockClients = [
      primaryAgreementHolder,
      mockOtherAgreementHolder,
    ];
    expect(instance.getAgreementHolders(mockClients))
      .toEqual({ primaryAgreementHolder, otherAgreementHolders });
  });

  describe('Event handlers', () => {
    it('opening and closing modal events change states correctly', () => {
      const wrapper = shallow(<Rup {...props} />);
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

      instance.closeUpdateZoneModal();
      expect(wrapper.state().isUpdateZoneModalOpen).toEqual(false);

      instance.openUpdateZoneModal();
      expect(wrapper.state().isUpdateZoneModalOpen).toEqual(true);
    });

    it('onViewPDFClicked calls the right function', () => {
      const wrapper = shallow(<Rup {...props} />);
      global.window.URL.createObjectURL = jest.fn();
      wrapper.instance().onViewPDFClicked();
      expect(mockPDFLinkClick).toHaveBeenCalled();

      mockPDFLinkClick.mockClear();
      wrapper.setState({
        plan: { id: null },
      });
      wrapper.instance().onViewPDFClicked();
      expect(mockPDFLinkClick).not.toHaveBeenCalled();
    });

    it('onYesSomethingClicked calls the right function', () => {
      const wrapper = shallow(<Rup {...props} />);
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
      const wrapper = shallow(<Rup {...props} />);
      const instance = wrapper.instance();
      const mockCloseConfirmModal = jest.fn();

      instance.updateStatus({}, mockCloseConfirmModal);
      expect(props.updateRupStatus).not.toBeCalled();

      instance.updateStatus(mockStatus.name, mockCloseConfirmModal);
      const requestData = {
        planId: props.agreement.plan.id,
        statusId: mockStatus.id,
      };
      expect(props.updateRupStatus).toHaveBeenCalledWith(requestData);
    });

    it('onZoneClicked calls the right function', () => {
      const wrapper = shallow(<Rup {...props} />);
      const instance = wrapper.instance();
      const openUpdateZoneModalModalSpy = jest.spyOn(instance, 'openUpdateZoneModal');
      instance.onZoneClicked();
      expect(openUpdateZoneModalModalSpy).toHaveBeenCalled();
    });

    it('onZoneUpdated calls right the function', () => {
      const wrapper = shallow(<Rup {...props} />);
      const mockZone = { mock: 'zone' };
      wrapper.instance().onZoneUpdated(mockZone);
      expect(wrapper.state().zone).toEqual(mockZone);
    });
  });
});
