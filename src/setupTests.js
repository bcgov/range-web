import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-localstorage-mock';

// set up adapter
configure({ adapter: new Adapter() });
