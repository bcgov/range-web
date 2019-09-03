import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'

const LocationButton = ({ children, onLocation, ...props }) => {
  const [loading, setLoading] = useState(false)

  return (
    <Button
      type="button"
      {...props}
      loading={loading}
      onClick={() => {
        if ('geolocation' in navigator) {
          setLoading(true)
          navigator.geolocation.getCurrentPosition((...args) => {
            setLoading(false)
            onLocation(...args)
          })
        }
      }}>
      {children}
    </Button>
  )
}

LocationButton.propTypes = {
  children: PropTypes.any,
  onLocation: PropTypes.func.isRequired
}

export default LocationButton
