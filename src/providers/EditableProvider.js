import React, { useContext } from 'react'
import PropTypes from 'prop-types'

export const EditableContext = React.createContext({})

export const useEditable = () => useContext(EditableContext)

const EditableProvider = ({ children, editable }) => {
  return (
    <EditableContext.Provider value={editable}>
      {children}
    </EditableContext.Provider>
  )
}

EditableProvider.propTypes = {
  children: PropTypes.node
}

export default EditableProvider
