import React, { useState } from 'react';
import { CollapsibleBox, InfoTip, InputModal } from '../../common';
import uuid from 'uuid-v4';
import {
  IMAGE_SRC,
  PURPOSE_OF_ACTION as PurposeOfAction,
  REFERENCE_KEY,
  PLANT_CRITERIA,
} from '../../../constants/variables';
import { CRITERIA_TIP } from '../../../constants/strings';
import { Icon, Form, Dropdown as PlainDropdown } from 'semantic-ui-react';
import RangeReadinessBox from './criteria/RangeReadinessBox';
import StubbleHeightBox from './criteria/StubbleHeightBox';
import ShrubUseBox from './criteria/ShrubUseBox';
import MonitoringAreaList from './monitoringArea';
import * as strings from '../../../constants/strings';
import PlantCommunityActionsBox from './PlantCommunityActionsBox';
import PermissionsField, { IfEditable } from '../../common/PermissionsField';
import { PLANT_COMMUNITY } from '../../../constants/fields';
import { connect, getIn } from 'formik';
import { Input, Dropdown, Checkbox, TextArea } from 'formik-semantic-ui';
import { useReferences } from '../../../providers/ReferencesProvider';
import Import from './criteria/Import';
import MultiParagraphDisplay from '../../common/MultiParagraphDisplay';

const dropdownOptions = [{ key: 'delete', value: 'delete', text: 'Delete' }];

interface PlantCommunityBoxProps {
  plantCommunity: any;
  activeIndex: number;
  index: number;
  planId: any;
  pastureId: any;
  onClick: () => void;
  namespace: string;
  formik?: any;
  onDelete: () => void;
}

const PlantCommunityBox: React.FC<PlantCommunityBoxProps> = ({
  plantCommunity,
  activeIndex,
  index,
  planId,
  pastureId,
  onClick,
  namespace,
  formik,
  onDelete,
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
    monitoringAreas,
  } = plantCommunity;

  const [isModalOpen, setModalOpen] = useState(false);

  const communityTypes = (useReferences() as any)[REFERENCE_KEY.PLANT_COMMUNITY_TYPE] || [];
  const otherType = communityTypes.find((t: any) => t.name === 'Other');

  const communityTypeOptions = communityTypes
    .map((type: any) =>
      type.id === otherType.id
        ? {
            ...type,
            name: communityTypeId === otherType.id ? `Other: ${name}` : type.name,
          }
        : type,
    )
    .map((type: any) => ({
      key: type.id,
      value: type.id,
      text: type.name,
      id: type.id,
    }));

  const communityType = communityTypeOptions.find((t: any) => t.value === communityTypeId);

  const elevationTypes = (useReferences() as any)[REFERENCE_KEY.PLANT_COMMUNITY_ELEVATION];
  const elevationOptions = elevationTypes.map((type: any) => ({
    key: type.id,
    value: type.id,
    text: type.name,
  }));

  const purposeOptions = [
    {
      key: PurposeOfAction.NONE,
      value: PurposeOfAction.NONE,
      text: 'None',
    },
    {
      key: 'maintain',
      value: 'maintain',
      text: 'Maintain Plant Community',
    },
    {
      key: 'establish',
      value: 'establish',
      text: 'Establish Plant Community',
    },
    {
      key: 'improve',
      value: 'improve',
      text: 'Improve Plant Community',
    },
  ];

  const isError = !!getIn(formik.errors, namespace);

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
                <img src={IMAGE_SRC.PLANT_COMMUNITY_ICON} alt="community icon" />
              )}
            </div>
            <PermissionsField
              permission={index !== activeIndex ? '' : PLANT_COMMUNITY.NAME}
              name={`${namespace}.communityTypeId`}
              component={Dropdown}
              options={communityTypeOptions}
              displayValue={communityType?.id === otherType?.id ? name : communityType?.text}
              fast
              inputProps={{
                onChange: (_e: any, { value }: any) => {
                  if (value === otherType.id) {
                    setModalOpen(true);
                    formik.setFieldValue(`${namespace}.communityTypeId`, communityTypeId);
                  } else {
                    formik.setFieldValue(`${namespace}.name`, null);
                  }
                },
              }}
            />
          </div>
          <div className="rup__plant-community__title__right">
            <div>
              {'Minister approval for inclusion obtained: '}
              {approved ? <Icon name="check circle" color="green" /> : <Icon name="remove circle" color="red" />}
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
                  value={null as any}
                  pointing="right"
                  onClick={(e: any) => e.stopPropagation()}
                  onChange={(_e: any, { value }: any) => {
                    if (value === 'delete') onDelete();
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
              label={strings.ASPECT}
              fast
              inputProps={{
                placeholder: 'Ex. NW',
              }}
            />

            <PermissionsField
              permission={PLANT_COMMUNITY.ELEVATION}
              name={`${namespace}.elevationId`}
              component={Dropdown}
              options={elevationOptions}
              displayValue={
                elevationTypes.find((t: any) => t.id === elevationId)
                  ? elevationTypes.find((t: any) => t.id === elevationId).name
                  : ''
              }
              label={strings.ELEVATION}
              fast
            />
          </Form.Group>

          <PermissionsField
            name={`${namespace}.approved`}
            permission={PLANT_COMMUNITY.APPROVED}
            component={Checkbox}
            displayValue={approved}
            label={strings.APPROVED_BY_MINISTER}
            tip={strings.APPROVED_BY_MINISTER_TIP}
            inputProps={{
              toggle: true,
            }}
            fast
          />

          <PermissionsField
            name={`${namespace}.notes`}
            permission={PLANT_COMMUNITY.NOTES}
            component={TextArea}
            displayComponent={MultiParagraphDisplay}
            displayValue={notes}
            label={strings.PLANT_COMMUNITY_NOTES}
            fast
            inputProps={{
              placeholder:
                'Description of the CURRENT community. Include a description of the INTENDED plant community if actions to establish a plant community are required. As basic or detailed as needed for the purposes required.',
            }}
            fieldProps={{ required: true }}
          />

          <Form.Group widths="2">
            <PermissionsField
              name={`${namespace}.url`}
              permission={PLANT_COMMUNITY.COMMUNITY_URL}
              component={Input}
              displayValue={url}
              label={strings.COMMUNITY_URL}
              fast
              inputProps={{
                placeholder: 'Link to provincial plant community description',
              }}
            />

            <PermissionsField
              permission={PLANT_COMMUNITY.PURPOSE_OF_ACTION}
              name={`${namespace}.purposeOfAction`}
              component={Dropdown}
              options={purposeOptions}
              displayValue={purposeOfAction}
              label={strings.PURPOSE_OF_ACTION}
              fast
              fieldProps={{ required: true }}
            />
          </Form.Group>

          {purposeOfAction !== PurposeOfAction.NONE && (
            <>
              <div className="rup__plant-community__content-title">
                <div className="rup__popup-header">
                  <span>Plant Community Actions</span>
                  <InfoTip header={'Plant Community Actions'} content={strings.PLANT_COMMUNITY_ACTIONS_TIP} />
                </div>
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
            <div className="rup__popup-header">
              <span>Criteria</span>
              <InfoTip header={'Criteria'} content={CRITERIA_TIP} />
            </div>
            <IfEditable permission={PLANT_COMMUNITY.IMPORT}>
              <Import
                excludedPlantCommunityId={plantCommunity.id}
                onSubmit={({ plantCommunity: sourcePlantCommunity, criteria }: any) => {
                  const indicatorPlants = sourcePlantCommunity.indicatorPlants
                    // Filter indicator plants from source plant community based on selected criteria
                    .filter((ip: any) => {
                      return (
                        (criteria.includes('rangeReadiness') && ip.criteria === PLANT_CRITERIA.RANGE_READINESS) ||
                        (criteria.includes('stubbleHeight') && ip.criteria === PLANT_CRITERIA.STUBBLE_HEIGHT)
                      );
                    })
                    // Filter indicator plants from this plant community based on selected criteria
                    .concat(
                      plantCommunity.indicatorPlants.filter((ip: any) => {
                        return (
                          criteria.includes('rangeReadiness') &&
                          ip.criteria !== PLANT_CRITERIA.RANGE_READINESS &&
                          criteria.includes('stubbleHeight') &&
                          ip.criteria !== PLANT_CRITERIA.STUBBLE_HEIGHT
                        );
                      }),
                    );

                  formik.setFieldValue(
                    `${namespace}.indicatorPlants`,
                    indicatorPlants.map((ip: any) => ({ ...ip, id: uuid() })),
                  );

                  if (criteria.includes('rangeReadiness')) {
                    formik.setFieldValue(`${namespace}.rangeReadinessDay`, sourcePlantCommunity.rangeReadinessDay);
                    formik.setFieldValue(`${namespace}.rangeReadinessMonth`, sourcePlantCommunity.rangeReadinessMonth);
                    formik.setFieldValue(`${namespace}.rangeReadinessNote`, sourcePlantCommunity.rangeReadinessNote);
                  }

                  if (criteria.includes('shrubUse')) {
                    formik.setFieldValue(`${namespace}.shrubUse`, sourcePlantCommunity.shrubUse);
                  }
                }}
              />
            </IfEditable>
          </div>

          <RangeReadinessBox
            plantCommunity={plantCommunity}
            namespace={namespace}
            planId={planId}
            pastureId={pastureId}
          />

          <StubbleHeightBox
            plantCommunity={plantCommunity}
            namespace={namespace}
            planId={planId}
            pastureId={pastureId}
          />

          <ShrubUseBox plantCommunity={plantCommunity} namespace={namespace} />

          <div className="rup__plant-community__content-title">
            <div className="rup__popup-header">
              <span>Monitoring Areas</span>
              <InfoTip header={'Monitoring Areas'} content={strings.MONITORING_AREAS_TIP} />
            </div>
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
            onSubmit={(name: string) => {
              formik.setFieldValue(`${namespace}.name`, name);
              formik.setFieldValue(`${namespace}.communityTypeId`, otherType.id);
              setModalOpen(false);
            }}
            title="Other plant community type"
            placeholder="Plant community name"
          />
        </>
      }
    />
  );
};

export default connect(PlantCommunityBox);
