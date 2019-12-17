import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { CollapsibleBox } from '../../common'
import uuid from 'uuid-v4'
import {
  IMAGE_SRC,
  PURPOSE_OF_ACTION as PurposeOfAction,
  REFERENCE_KEY,
  PLANT_CRITERIA
} from '../../../constants/variables'
import { Icon, Form } from 'semantic-ui-react'
import RangeReadinessBox from './criteria/RangeReadinessBox'
import StubbleHeightBox from './criteria/StubbleHeightBox'
import ShrubUseBox from './criteria/ShrubUseBox'
import MonitoringAreaList from './monitoringArea'
import {
  ASPECT,
  ELEVATION,
  APPROVED_BY_MINISTER,
  PLANT_COMMUNITY_NOTES,
  COMMUNITY_URL,
  PURPOSE_OF_ACTION
} from '../../../constants/strings'
import PlantCommunityActionsBox from './PlantCommunityActionsBox'
import PermissionsField, { IfEditable } from '../../common/PermissionsField'
import { PLANT_COMMUNITY } from '../../../constants/fields'
import { connect, getIn } from 'formik'
import { Dropdown as PlainDropdown } from 'semantic-ui-react'
import { Input, Dropdown, Checkbox, TextArea } from 'formik-semantic-ui'
import { useReferences } from '../../../providers/ReferencesProvider'
import Import from './criteria/Import'
import InputModal from '../../common/InputModal'

const dropdownOptions = [{ key: 'delete', value: 'delete', text: 'Delete' }]

const PlantCommunityBox = ({
  plantCommunity,
  activeIndex,
  index,
  planId,
  pastureId,
  onClick,
  namespace,
  formik,
  onDelete
}) => {
  const {
    name,
    plantCommunityActions,
    purposeOfAction,
    aspect,
    elevationId,
    url,
    approved,
    notes,
    communityTypeId,
    monitoringAreas
  } = plantCommunity

  const [isModalOpen, setModalOpen] = useState(false)

  const communityTypes =
    useReferences()[REFERENCE_KEY.PLANT_COMMUNITY_TYPE] || []
  const otherType = communityTypes.find(t => t.name === 'Other')

  const communityTypeOptions = communityTypes
    .map(type =>
      type.id === otherType.id
        ? {
            ...type,
            name:
              communityTypeId === otherType.id ? `Other: ${name}` : type.name
          }
        : type
    )
    .map(type => ({
      key: type.id,
      value: type.id,
      text: type.name,
      id: type.id
    }))

  const communityType = communityTypeOptions.find(
    t => t.value === communityTypeId
  )

  const elevationTypes = useReferences()[
    REFERENCE_KEY.PLANT_COMMUNITY_ELEVATION
  ]
  const elevationOptions = elevationTypes.map(type => ({
    key: type.id,
    value: type.id,
    text: type.name
  }))

  const purposeOptions = [
    {
      key: PurposeOfAction.NONE,
      value: PurposeOfAction.NONE,
      text: 'None'
    },
    {
      key: 'maintain',
      value: 'maintain',
      text: 'Maintain Plant Community'
    },
    {
      key: 'establish',
      value: 'establish',
      text: 'Establish Plant Community'
    }
  ]

  const isError = !!getIn(formik.errors, namespace)

  return (
    <CollapsibleBox
      key={communityTypeId}
      contentIndex={index}
      activeContentIndex={activeIndex}
      onContentClick={onClick}
      scroll={true}
      error={isError}
      header={
        <div className="rup__plant-community__title">
          <div className="rup__plant-community__title__left">
            <div style={{ width: '30px' }}>
              {isError ? (
                <Icon name="warning sign" />
              ) : (
                <img
                  src={IMAGE_SRC.PLANT_COMMUNITY_ICON}
                  alt="community icon"
                />
              )}
            </div>
            <PermissionsField
              permission={index !== activeIndex ? '' : PLANT_COMMUNITY.NAME}
              name={`${namespace}.communityTypeId`}
              component={Dropdown}
              options={communityTypeOptions}
              displayValue={
                communityType.id === otherType.id ? name : communityType.text
              }
              fast
              inputProps={{
                onChange: (e, { value }) => {
                  if (value === otherType.id) {
                    setModalOpen(true)
                    formik.setFieldValue(
                      `${namespace}.communityTypeId`,
                      communityTypeId
                    )
                  } else {
                    formik.setFieldValue(`${namespace}.name`, null)
                  }
                }
              }}
            />
          </div>
          <div className="rup__plant-community__title__right">
            <div>
              {'Minister approval for inclusion obtained: '}
              {approved ? (
                <Icon name="check circle" color="green" />
              ) : (
                <Icon name="remove circle" color="red" />
              )}
            </div>
          </div>

          <IfEditable permission={PLANT_COMMUNITY.NAME}>
            <div>
              {activeIndex === index && (
                <PlainDropdown
                  className="rup__pasture__actions"
                  trigger={<i className="ellipsis vertical icon" />}
                  options={dropdownOptions}
                  icon={null}
                  pointing="right"
                  onClick={e => e.stopPropagation()}
                  onChange={(e, { value }) => {
                    if (value === 'delete') onDelete()
                  }}
                  selectOnBlur={false}
                />
              )}
            </div>
          </IfEditable>
        </div>
      }
      collapsibleContent={
        <>
          <div className="rup__plant-community__content-title">
            <span>Basic Plant Community Information</span>
          </div>

          <Form.Group widths="2">
            <PermissionsField
              name={`${namespace}.aspect`}
              permission={PLANT_COMMUNITY.ASPECT}
              component={Input}
              displayValue={aspect}
              label={ASPECT}
              fast
              inputProps={{
                placeholder: 'Ex. NW'
              }}
            />

            <PermissionsField
              permission={PLANT_COMMUNITY.ELEVATION}
              name={`${namespace}.elevationId`}
              component={Dropdown}
              options={elevationOptions}
              displayValue={
                elevationTypes.find(t => t.id === elevationId)
                  ? elevationTypes.find(t => t.id === elevationId).name
                  : ''
              }
              label={ELEVATION}
              fast
            />
          </Form.Group>

          <PermissionsField
            name={`${namespace}.approved`}
            permission={PLANT_COMMUNITY.APPROVED}
            component={Checkbox}
            displayValue={approved}
            label={APPROVED_BY_MINISTER}
            inputProps={{
              toggle: true
            }}
            fast
          />

          <PermissionsField
            name={`${namespace}.notes`}
            permission={PLANT_COMMUNITY.NOTES}
            component={TextArea}
            displayValue={notes}
            label={PLANT_COMMUNITY_NOTES}
            fast
            inputProps={{
              placeholder:
                'Description of the CURRENT community. Include a description of the INTENDED plant community if actions to establish a plant community are required. As basic or detailed as needed for the purposes required.'
            }}
            fieldProps={{ required: true }}
          />

          <Form.Group widths="2">
            <PermissionsField
              name={`${namespace}.url`}
              permission={PLANT_COMMUNITY.COMMUNITY_URL}
              component={Input}
              displayValue={url}
              label={COMMUNITY_URL}
              fast
              inputProps={{
                placeholder: 'Link to provincial plant community description'
              }}
            />

            <PermissionsField
              permission={PLANT_COMMUNITY.PURPOSE_OF_ACTION}
              name={`${namespace}.purposeOfAction`}
              component={Dropdown}
              options={purposeOptions}
              displayValue={purposeOfAction}
              label={PURPOSE_OF_ACTION}
              fast
              fieldProps={{ required: true }}
            />
          </Form.Group>

          {purposeOfAction !== PurposeOfAction.NONE && (
            <>
              <div className="rup__plant-community__content-title">
                <span>Plant Community Actions</span>
              </div>
              <PlantCommunityActionsBox
                actions={plantCommunityActions}
                planId={planId}
                pastureId={pastureId}
                communityId={plantCommunity.id}
                namespace={namespace}
              />
            </>
          )}

          <div className="rup__plant-community__content-title">
            <span>Criteria</span>
            <IfEditable permission={PLANT_COMMUNITY.IMPORT}>
              <Import
                excludedPlantCommunityId={plantCommunity.id}
                onSubmit={({ plantCommunity, criteria }) => {
                  const indicatorPlants = plantCommunity.indicatorPlants.filter(
                    ip => {
                      return (
                        (criteria.includes('rangeReadiness') &&
                          ip.criteria === PLANT_CRITERIA.RANGE_READINESS) ||
                        (criteria.includes('stubbleHeight') &&
                          ip.criteria === PLANT_CRITERIA.STUBBLE_HEIGHT)
                      )
                    }
                  )

                  formik.setFieldValue(
                    `${namespace}.indicatorPlants`,
                    indicatorPlants.map(ip => ({ ...ip, id: uuid() }))
                  )

                  if (criteria.includes('rangeReadiness')) {
                    formik.setFieldValue(
                      `${namespace}.rangeReadinessDay`,
                      plantCommunity.rangeReadinessDay
                    )
                    formik.setFieldValue(
                      `${namespace}.rangeReadinessMonth`,
                      plantCommunity.rangeReadinessMonth
                    )
                    formik.setFieldValue(
                      `${namespace}.rangeReadinessNote`,
                      plantCommunity.rangeReadinessNote
                    )
                  }

                  if (criteria.includes('shrubUse')) {
                    formik.setFieldValue(
                      `${namespace}.shrubUse`,
                      plantCommunity.shrubUse
                    )
                  }
                }}
              />
            </IfEditable>
          </div>

          <RangeReadinessBox
            plantCommunity={plantCommunity}
            namespace={namespace}
          />

          <StubbleHeightBox
            plantCommunity={plantCommunity}
            namespace={namespace}
          />

          <ShrubUseBox plantCommunity={plantCommunity} namespace={namespace} />

          <div className="rup__plant-community__content-title">
            <span>Monitoring Areas</span>
          </div>
          <MonitoringAreaList
            monitoringAreas={monitoringAreas}
            planId={planId}
            pastureId={pastureId}
            communityId={plantCommunity.id}
            namespace={`${namespace}.monitoringAreas`}
          />

          <InputModal
            open={isModalOpen}
            onClose={() => setModalOpen(false)}
            onSubmit={name => {
              formik.setFieldValue(`${namespace}.name`, name)
              formik.setFieldValue(`${namespace}.communityTypeId`, otherType.id)
              setModalOpen(false)
            }}
            title="Other plant community type"
            placeholder="Plant community name"
          />
        </>
      }
    />
  )
}

PlantCommunityBox.propTypes = {
  plantCommunity: PropTypes.shape({
    name: PropTypes.string,
    plantCommunityActions: PropTypes.array.isRequired,
    purposeOfAction: PropTypes.string,
    aspect: PropTypes.string,
    elevationId: PropTypes.number,
    url: PropTypes.string,
    approved: PropTypes.bool.isRequired,
    notes: PropTypes.string.isRequired,
    communityType: PropTypes.object,
    communityTypeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    monitoringAreas: PropTypes.array.isRequired
  }),
  index: PropTypes.number.isRequired,
  activeIndex: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  namespace: PropTypes.string.isRequired,
  formik: PropTypes.shape({
    setFieldValue: PropTypes.func.isRequired
  })
}

export default connect(PlantCommunityBox)
