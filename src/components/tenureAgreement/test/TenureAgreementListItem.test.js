import React from 'react';
import { shallow } from 'enzyme';
import TenureAgreementListItem from '../TenureAgreementListItem';
import { getMockTenureAgreement } from './mockValues';

const props = {};
const setupProps = () => {
  props.tenureAgreement = getMockTenureAgreement(1);
  props.onViewClicked = jest.fn();
  props.index = 1;
  props.isActive = false;
};

beforeEach(() => {
  setupProps();
});

describe('TenureAgreementListItem', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<TenureAgreementListItem {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});