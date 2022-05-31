import React from 'react'
import { Select } from 'formik-semantic-ui-react'
import { Popup, Icon } from 'semantic-ui-react'

const HelpfulDropdown = ({ help, ...props }) => {
  return (
    <>
      <Select
        {...props}
        label={
          <>
            {props.label && (
              <label style={{ display: 'inline', marginRight: 5 }}>
                {props.label}
              </label>
            )}
            <Popup
              content={help}
              trigger={<Icon name="question circle outline" color="blue" />}
            />
          </>
        }
      />
    </>
  )
}

export default HelpfulDropdown
