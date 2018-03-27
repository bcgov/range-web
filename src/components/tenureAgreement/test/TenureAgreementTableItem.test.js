import React from 'react';
import { shallow } from 'enzyme';
import { TenureAgreementTableItem } from '../TenureAgreementTableItem';
import { getMockRangeUsePlan } from './mockValues';
import { RANGE_USE_PLAN } from '../../../constants/routes';

const props = {};
const setupProps = () => {
  props.tenureAgreement = getMockRangeUsePlan(1);
  props.history = {
    push: jest.fn(),
  }
};

beforeEach(() => {
  setupProps();
});

describe('tenureAgreementTableItem', () => {
  xit('renders correctly', () => {
    const wrapper = shallow(<TenureAgreementTableItem {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  xit('push to the new route when clicking on Table.row', () => {
    const wrapper = shallow(<TenureAgreementTableItem {...props} />);
    wrapper.simulate('click', {});

    expect(props.history.push).toHaveBeenCalledTimes(1);
    expect(props.history.push).toHaveBeenCalledWith(`${RANGE_USE_PLAN}/${props.tenureAgreement.id}`);
  });

  describe('Event handlers', () => {
    xit('onRowClicked is called to push to the new route', () => {
      const wrapper = shallow(<TenureAgreementTableItem {...props} />);
      wrapper.instance().onRowClicked();

      expect(props.history.push).toHaveBeenCalledTimes(1);
      expect(props.history.push).toHaveBeenCalledWith(`${RANGE_USE_PLAN}/${props.tenureAgreement.id}`);
    });
  });
});