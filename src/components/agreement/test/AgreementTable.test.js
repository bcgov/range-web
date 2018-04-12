import React from 'react';
import { shallow } from 'enzyme';
import { AgreementTable } from '../AgreementTable';
import { getMockAgreements } from './mockValues';

const props = {};
const setupProps = () => {
  props.agreementsState = {
    isLoading: false,
    currentPage: 1,
    totalPages: 1,
    data: getMockAgreements(3),
  };
  props.handlePaginationChange = jest.fn();
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
    const numberOfAgreements = props.agreementsState.data.length;
    expect(wrapper.find('withRouter(AgreementTableItem)').length).toEqual(numberOfAgreements);
  });

  describe('Event handlers', () => {
    it('`handlePaginationChange` calls the right function', () => {
      const wrapper = shallow(<AgreementTable {...props} />);
      const mockCurrentPage = '1';
      wrapper.instance().handlePaginationChange({}, { activePage: mockCurrentPage });
      expect(props.handlePaginationChange).toHaveBeenCalledWith(mockCurrentPage);
    });
  });
});
