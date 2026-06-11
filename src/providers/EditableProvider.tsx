import React, { useContext } from 'react';

export const EditableContext = React.createContext<boolean>(false);

export const useEditable = (): boolean => useContext(EditableContext);

interface EditableProviderProps {
  children: React.ReactNode;
  editable: boolean;
}

const EditableProvider: React.FC<EditableProviderProps> = ({ children, editable }) => {
  return <EditableContext.Provider value={editable}>{children}</EditableContext.Provider>;
};

export default EditableProvider;
