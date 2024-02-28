import React, { useContext } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getUser } from '../reducers/rootReducer';

export const UserContext = React.createContext({});

export const useUser = () => useContext(UserContext);

const UserProvider = ({ user, children }) => {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

UserProvider.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    givenName: PropTypes.string.isRequired,
    familyName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  }),
  children: PropTypes.node,
};

// Just take user from redux store and make it accessible via UserContext for now
// Eventually handle retrieving and storing the user in this component w/o redux
const mapStateToProps = (state) => ({
  user: getUser(state),
});

export default connect(mapStateToProps)(UserProvider);
