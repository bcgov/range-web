import React from 'react';
import { shallow } from 'enzyme';
import { TenureAgreementTable } from '../TenureAgreementTable';
import { getMockRangeUsePlans } from './mockValues';

const props = {};
const setupProps = () => {
  props.tenureAgreements = getMockRangeUsePlans(3);
  props.isLoading = false;
};

beforeEach(() => {
  setupProps();
});

describe('TenureAgreementTable', () => {
  xit('renders correctly', () => {
    const wrapper = shallow(<TenureAgreementTable {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders `TenureAgreementTableItem` components correctly', () => {
    const wrapper = shallow(<TenureAgreementTable {...props} />);
    const numberOfAgreements = props.tenureAgreements.length;
    expect(wrapper.find('withRouter(TenureAgreementTableItem)').length).toEqual(numberOfAgreements);    
  });
});
