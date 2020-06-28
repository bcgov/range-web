import React, { useContext, useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { getReferences } from '../reducers/rootReducer'
import { fetchReferences } from '../actionCreators'
import { useUser } from './UserProvider'

export const ReferencesContext = React.createContext({})

export const useReferences = () => useContext(ReferencesContext)

const ReferencesProvider = ({ references, fetchReferences, children }) => {
  const user = useUser()

  useEffect(() => {
    fetchReferences()
  }, [user])

  return (
    <ReferencesContext.Provider value={references}>
      {children}
    </ReferencesContext.Provider>
  )
}

ReferencesProvider.propTypes = {
  references: PropTypes.shape({}).isRequired,
  fetchReferences: PropTypes.func.isRequired,
  children: PropTypes.node
}

// Just take references from redux store and make it accessible via ReferencesContext for now
// Eventually handle retrieving and storing the references in this component w/o redux
const mapStateToProps = state => ({
  references: getReferences(state)
})

const mapDispatchToProps = {
  fetchReferences
}

export default connect(mapStateToProps, mapDispatchToProps)(ReferencesProvider)
