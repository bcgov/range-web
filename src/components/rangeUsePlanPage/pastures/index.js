import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { getPasturesMap } from '../../../reducers/rootReducer'
import { Form } from 'formik-semantic-ui'
import Effect from '../../common/form/Effect'
import { FieldArray } from 'formik'
import PastureBox from './PastureBox'
import debounce from 'lodash.debounce'

const Pastures = ({ plan, pasturesMap }) => {
  const pastureIds = Object.keys(pasturesMap)
  const initialPastures = pastureIds
    .map(id => {
      const isNumber = Number(id)
      if (plan.pastures.includes(Number(id)) || !isNumber)
        return pasturesMap[id]
      return null
    })
    .filter(Boolean)
    .sort((a, b) => {
      // Sort unsubmitted pastures before pre-exisiting pastures
      if (a.id.toString().length !== b.id.toString().length)
        return b.id.toString().length - a.id.toString().length

      // Sort pastures with newer timestamp before older pastures
      if (a.id < b.id) return 1

      return -1
    })

  const onChange = debounce(values => {
    console.log('form change', values)
  }, 1000)

  const [activeIndex, setActiveIndex] = useState(-1)

  return (
    <Form
      initialValues={{ pastures: initialPastures }}
      validateOnChange={true}
      render={({ values: { pastures }, errors }) => (
        <>
          <Effect onChange={onChange} />

          <FieldArray
            name="pastures"
            render={({ push }) => (
              <div className="rup__pastures">
                <div className="rup__content-title--editable">
                  Pastures (refactored)
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
                        planId: plan.id,
                        plantCommunities: [],
                        id: new Date().toISOString()
                      })
                    }}
                    className="icon labeled rup__pastures__add-button">
                    <i className="add circle icon" />
                    Add Pasture
                  </Button>
                </div>

                <div className="rup__divider" />
                {pastures.length === 0 ? (
                  <div className="rup__section-not-found">
                    No pasture provided.
                  </div>
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
        </>
      )}
    />
  )
}

Pastures.propTypes = {
  plan: PropTypes.shape({ id: PropTypes.number }).isRequired,
  pasturesMap: PropTypes.shape({}).isRequired
}

const mapStateToProps = state => ({
  pasturesMap: getPasturesMap(state)
})

export default connect(mapStateToProps)(Pastures)
