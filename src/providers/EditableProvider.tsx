import React, { useContext } from 'react';

export const EditableContext = React.createContext<boolean>(false);

export const useEditable = (): boolean => useContext(EditableContext);

interface EditableProviderProps {
  children: React.ReactNode;
  editable: boolean;
}

function EditableProvider({ children, editable }: EditableProviderProps) {
  return <EditableContext.Provider value={editable}>{children}</EditableContext.Provider>;
}

export default EditableProvider;
