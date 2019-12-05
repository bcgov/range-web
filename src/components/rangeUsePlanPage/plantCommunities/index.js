import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import uuid from 'uuid-v4'
import PlantCommunityBox from './PlantCommunityBox'
import AddPlantCommunityButton from './AddPlantCommunityButton'
import { FieldArray } from 'formik'
import { NOT_PROVIDED } from '../../../constants/strings'
import { IfEditable } from '../../common/PermissionsField'
import { PLANT_COMMUNITY } from '../../../constants/fields'
import { Message, Icon } from 'semantic-ui-react'

const PlantCommunities = ({ plantCommunities = [], namespace }) => {
  const isEmpty = plantCommunities.length === 0
  const [activeIndex, setActiveIndex] = useState(-1)

  return (
    <FieldArray
      name={`${namespace}.plantCommunities`}
      render={({ push }) => (
        <div className="rup__plant-communities">
          <div className="rup__plant-communities__title">Plant Communities</div>
          <IfEditable permission={PLANT_COMMUNITY.NAME}>
            <>
              <Message warning style={{ display: 'flex' }} icon>
                <Icon name="warning" />
                <Message.Content>
                  <Message.Header>
                    Heads up! Plant communities can <em>not</em> be edited once
                    created
                  </Message.Header>
                  <p>
                    Don&apos;t worry, this is only temporary. If you need to
                    change the information for a plant community after creating
                    it, you are still able to use the iPad app.
                  </p>
                </Message.Content>
              </Message>
              <AddPlantCommunityButton
                onSubmit={plantCommunity => {
                  push({
                    ...plantCommunity,
                    communityTypeId: plantCommunity.id,
                    indicatorPlants: [],
                    plantCommunityActions: [],
                    purposeOfAction: 'none',
                    monitoringAreas: [],
                    aspect: '',
                    elevation: 0,
                    url: '',
                    approved: false,
                    notes: '',
                    rangeReadinessDate: '',
                    rangeReadinessNote: '',
                    id: uuid()
                  })
                }}
              />
            </>
          </IfEditable>

          <IfEditable permission={PLANT_COMMUNITY.NAME} invert>
            {isEmpty && (
              <div className="rup__plant-communities__not-provided">
                {NOT_PROVIDED}
              </div>
            )}
          </IfEditable>

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
                  index === activeIndex
                    ? setActiveIndex(-1)
                    : setActiveIndex(index)
                }}
                namespace={`${namespace}.plantCommunities.${index}`}
              />
            ))}
          </ul>
        </div>
      )}
    />
  )
}

PlantCommunities.propTypes = {
  plantCommunities: PropTypes.array.isRequired,
  namespace: PropTypes.string.isRequired
}

export default PlantCommunities
