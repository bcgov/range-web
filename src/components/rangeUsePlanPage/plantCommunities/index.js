import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import PlantCommunityBox from './PlantCommunityBox'
import AddPlantCommunityButton from './AddPlantCommunityButton'
import { FieldArray } from 'formik'
import { NOT_PROVIDED } from '../../../constants/strings'

const PlantCommunities = ({ plantCommunities, canEdit, namespace }) => {
  const isEmpty = plantCommunities.length === 0
  const [activeIndex, setActiveIndex] = useState(-1)

  return (
    <FieldArray
      name={`${namespace}.plantCommunities`}
      render={({ push }) => (
        <div className="rup__plant-communities">
          <div className="rup__plant-communities__title">Plant Communities</div>
          {canEdit && (
            <AddPlantCommunityButton
              onSubmit={plantCommunity => {
                console.log(plantCommunity)

                push({
                  ...plantCommunity,
                  communityTypeId: new Date().toISOString(),
                  indicatorPlants: [],
                  plantCommunityActions: [],
                  purposeOfAction: 'none',
                  monitoringAreas: [],
                  aspect: 0,
                  elevation: 0,
                  url: '',
                  approved: false,
                  notes: ''
                })
              }}
            />
          )}
          {isEmpty && !canEdit ? (
            <div className="rup__plant-communities__not-provided">
              {NOT_PROVIDED}
            </div>
          ) : (
            <ul
              className={classnames('collaspible-boxes', {
                'collaspible-boxes--empty': isEmpty
              })}>
              {plantCommunities.map((plantCommunity, index) => (
                <PlantCommunityBox
                  key={plantCommunity.id}
                  plantCommunity={plantCommunity}
                  activeIndex={activeIndex}
                  index={index}
                  onClick={() => {
                    console.log('click')
                    setActiveIndex(index)
                  }}
                  namespace={`${namespace}.plantCommunities.${index}`}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    />
  )
}

PlantCommunities.propTypes = {
  plantCommunities: PropTypes.array.isRequired,
  namespace: PropTypes.string.isRequired,
  canEdit: PropTypes.bool
}

export default PlantCommunities
