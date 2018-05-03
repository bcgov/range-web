import React from 'react';
import { shallow } from 'enzyme';
import AgreementSearch from '../AgreementSearch';

const props = {};
const setupProps = () => {
  props.handleSearchInput = jest.fn();
  props.placeholder = 'placeholder';
  props.searchTerm = 'label';
};

beforeEach(() => {
  setupProps();
});

describe('AgreementSearch', () => {
  xit('renders correctly', () => {
    const wrapper = shallow(<AgreementSearch {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('set `search` state when typing terms for searching', () => {
    const wrapper = shallow(<AgreementSearch {...props} />);
    const mockTerm = 'hello';

    wrapper.find('input#searchTerm').simulate('change', { target: { id: 'search', value: mockTerm } });
    expect(wrapper.state().search).toEqual(mockTerm);
    expect(props.handleSearchInput).toHaveBeenCalledWith(mockTerm);
  });

  describe('Event handlers', () => {
    it('`handleInput` set state and calls handleSearchInput', () => {
      const wrapper = shallow(<AgreementSearch {...props} />);
      const mockId = 'id';
      const mockValue = 'value';

      wrapper.instance().handleInput({ target: { id: mockId, value: mockValue } });
      expect(wrapper.state()[mockId]).toEqual(mockValue);
      expect(props.handleSearchInput).toHaveBeenCalledWith(mockValue);
    });
  });
});
