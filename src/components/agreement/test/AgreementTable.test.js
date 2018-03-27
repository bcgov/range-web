import React from 'react';
import { shallow } from 'enzyme';
import { AgreementTable } from '../AgreementTable';
import { getMockRangeUsePlans } from './mockValues';

const props = {};
const setupProps = () => {
  props.agreements = getMockRangeUsePlans(3);
  props.isLoading = false;
};

beforeEach(() => {
  setupProps();
});

describe('AgreementTable', () => {
  xit('renders correctly', () => {
    const wrapper = shallow(<AgreementTable {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders `AgreementTableItem` components correctly', () => {
    const wrapper = shallow(<AgreementTable {...props} />);
    const numberOfAgreements = props.agreements.length;
    expect(wrapper.find('withRouter(AgreementTableItem)').length).toEqual(numberOfAgreements);    
  });
});
