import React from 'react';
import { shallow } from 'enzyme';
import { Home } from '../Home';

const props = {};
const setupProps = () => {

};

beforeEach(() => {
  setupProps();
});

describe('Home', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Home {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders TenureAgreement', () => {
    const wrapper = shallow(<Home {...props} />);
    expect(wrapper.find('Component').exists()).toBe(true);    
  });
});
