import React, { useContext, useEffect } from 'react';
import { connect } from 'react-redux';
import { getReferences } from '../reducers/rootReducer';
import { fetchReferences } from '../actionCreators';
import { useUser } from './UserProvider';
import type { RootState } from '../configureStore';
import type { References } from '../reducers/commonStoreReducer';

export const ReferencesContext = React.createContext<References>({});

export const useReferences = (): References => useContext(ReferencesContext);

interface ReferencesProviderProps {
  references: References;
  fetchReferences: () => void;
  children: React.ReactNode;
}

const ReferencesProvider: React.FC<ReferencesProviderProps> = ({ references, fetchReferences, children }) => {
  const user = useUser();

  useEffect(() => {
    fetchReferences();
  }, [user]);

  return <ReferencesContext.Provider value={references}>{children}</ReferencesContext.Provider>;
};

// Just take references from redux store and make it accessible via ReferencesContext for now
// Eventually handle retrieving and storing the references in this component w/o redux
const mapStateToProps = (state: RootState) => ({
  references: getReferences(state),
});

const mapDispatchToProps = {
  fetchReferences,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReferencesProvider);
