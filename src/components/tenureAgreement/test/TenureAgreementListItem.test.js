import React from 'react';
import { shallow } from 'enzyme';
import { TenureAgreementListItem } from '../TenureAgreementListItem';
import { getMockTenureAgreement } from './mockValues';
import { TENURE_AGREEMENT } from '../../../constants/routes';

const props = {};
const setupProps = () => {
  props.tenureAgreement = getMockTenureAgreement(1);
  props.history = {
    push: jest.fn(),
  }
};

beforeEach(() => {
  setupProps();
});

describe('TenureAgreementListItem', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<TenureAgreementListItem {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('push to the new route when clicking on Table.row', () => {
    const wrapper = shallow(<TenureAgreementListItem {...props} />);
    wrapper.simulate('click', {});

    expect(props.history.push).toHaveBeenCalledTimes(1);
    expect(props.history.push).toHaveBeenCalledWith(`${TENURE_AGREEMENT}/${props.tenureAgreement.id}`);
  });

  describe('Event handlers', () => {
    it('onRowClicked is called to push to the new route', () => {
      const wrapper = shallow(<TenureAgreementListItem {...props} />);
      wrapper.instance().onRowClicked();

      expect(props.history.push).toHaveBeenCalledTimes(1);
      expect(props.history.push).toHaveBeenCalledWith(`${TENURE_AGREEMENT}/${props.tenureAgreement.id}`);
    });
  });
});