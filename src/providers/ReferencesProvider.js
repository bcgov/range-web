import React, { useContext } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { getReferences } from '../reducers/rootReducer'

export const ReferencesContext = React.createContext({})

export const useReferences = () => useContext(ReferencesContext)

const ReferencesProvider = ({ references, children }) => {
  return (
    <ReferencesContext.Provider value={references}>
      {children}
    </ReferencesContext.Provider>
  )
}

ReferencesProvider.propTypes = {
  references: PropTypes.shape({}).isRequired,
  children: PropTypes.node
}

// Just take references from redux store and make it accessible via ReferencesContext for now
// Eventually handle retrieving and storing the references in this component w/o redux
const mapStateToProps = state => ({
  references: getReferences(state)
})

export default connect(mapStateToProps)(ReferencesProvider)
