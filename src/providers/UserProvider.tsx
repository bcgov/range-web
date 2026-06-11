import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { getUser } from '../reducers/rootReducer';
import type { User } from '../types';
import type { RootState } from '../configureStore';

export const UserContext = React.createContext<User | undefined>(undefined);

export const useUser = (): User | undefined => useContext(UserContext);

interface UserProviderProps {
  user?: User;
  children: React.ReactNode;
}

function UserProvider({ user, children }: UserProviderProps) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

// Just take user from redux store and make it accessible via UserContext for now
// Eventually handle retrieving and storing the user in this component w/o redux
const mapStateToProps = (state: RootState) => ({
  user: getUser(state),
});

export default connect(mapStateToProps)(UserProvider);
