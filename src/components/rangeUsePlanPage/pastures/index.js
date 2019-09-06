import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Button } from 'semantic-ui-react'
import { FieldArray } from 'formik'
import PastureBox from './PastureBox'
import { IfEditable } from '../../common/PermissionsField'
import { PASTURES } from '../../../constants/fields'

const Pastures = ({ pastures }) => {
  const [activeIndex, setActiveIndex] = useState(-1)

  return (
    <FieldArray
      name="pastures"
      render={({ push }) => (
        <div className="rup__pastures">
          <div className="rup__content-title--editable">
            Pastures
            <IfEditable permission={PASTURES.NAME}>
              <Button
                type="button"
                basic
                primary
                onClick={() => {
                  push({
                    name: '',
                    allowableAum: '',
                    graceDays: '',
                    pldPercent: '',
                    notes: '',
                    plantCommunities: [],
                    id: new Date().toISOString()
                  })
                }}
                className="icon labeled rup__pastures__add-button">
                <i className="add circle icon" />
                Add Pasture
              </Button>
            </IfEditable>
          </div>

          <div className="rup__divider" />
          {pastures.length === 0 ? (
            <div className="rup__section-not-found">No pasture provided.</div>
          ) : (
            <ul
              className={classnames('collaspible-boxes', {
                'collaspible-boxes--empty': pastures.length === 0
              })}>
              {pastures.map((pasture, index) => (
                <PastureBox
                  key={pasture.id || `pasture_${index}`}
                  pasture={pasture}
                  index={index}
                  activeIndex={activeIndex}
                  onClick={() => {
                    setActiveIndex(activeIndex === index ? -1 : index)
                  }}
                  onCopy={() => console.log('copy')}
                  namespace={`pastures.${index}`}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    />
  )
}

Pastures.propTypes = {
  pastures: PropTypes.array.isRequired
}

export default Pastures
