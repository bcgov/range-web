import React, { useState } from 'react';
import classnames from 'classnames';
import uuid from 'uuid-v4';
import { Button, Confirm } from 'semantic-ui-react';
import PlantCommunityBox from './PlantCommunityBox';
import AddPlantCommunityButton from './AddPlantCommunityButton';
import { FieldArray } from 'formik';
import { NOT_PROVIDED } from '../../../constants/strings';
import { IfEditable } from '../../common/PermissionsField';
import { PLANT_COMMUNITY } from '../../../constants/fields';
import { deletePlantCommunity } from '../../../api';
import { resetPlantCommunityId } from '../../../utils/helper/plantCommunity';
import ImportPastureModal from '../ImportPastureModal';

interface PlantCommunitiesProps {
  plantCommunities: any[];
  namespace: string;
  planId: any;
  pastureId: any;
}

function PlantCommunities({ plantCommunities = [], namespace, planId, pastureId }: PlantCommunitiesProps) {
  const isEmpty = plantCommunities.length === 0;
  const [activeIndex, setActiveIndex] = useState(-1);
  const [idToRemove, setIdToRemove] = useState<any>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const communityToRemove = plantCommunities.find((c: any) => c.id === idToRemove);

  return (
    <FieldArray
      name={`${namespace}.plantCommunities`}
      validateOnChange={false}
      render={({ push, remove }) => (
        <div className="rup__plant-communities">
          <div className="rup__plant-communities__title">Plant Communities</div>
          <IfEditable permission={PLANT_COMMUNITY.NAME}>
            <div>
              <Button
                type="button"
                primary
                onClick={() => setIsImportModalOpen(true)}
                className="icon labeled rup__plant-communities__add-button"
              >
                <i className="add circle icon" />
                Import Plant Community
              </Button>
              <AddPlantCommunityButton
                onSubmit={(plantCommunity: any) => {
                  push({
                    ...plantCommunity,
                    communityTypeId: plantCommunity.id,
                    indicatorPlants: [],
                    plantCommunityActions: [],
                    purposeOfAction: 'none',
                    monitoringAreas: [],
                    aspect: '',
                    elevationId: null,
                    url: '',
                    approved: false,
                    notes: '',
                    rangeReadinessDay: null,
                    rangeReadinessMonth: null,
                    rangeReadinessNote: null,
                    shrubUse: '',
                    id: uuid(),
                  });
                }}
              />
            </div>
            <ImportPastureModal
              dialogOpen={isImportModalOpen}
              onClose={() => setIsImportModalOpen(false)}
              onImport={(plantCommunity: any) => {
                setIsImportModalOpen(false);
                push(resetPlantCommunityId(plantCommunity));
              }}
              mode="plantCommunity"
            />
          </IfEditable>

          <IfEditable permission={PLANT_COMMUNITY.NAME} invert>
            {isEmpty && <div className="rup__plant-communities__not-provided">{NOT_PROVIDED}</div>}
          </IfEditable>

          <Confirm
            header={`Delete plant community '${communityToRemove?.communityType?.name}'`}
            open={idToRemove !== null}
            onCancel={() => {
              setIdToRemove(null);
            }}
            onConfirm={async () => {
              if (!uuid.isUUID(idToRemove)) {
                await deletePlantCommunity(planId, pastureId, idToRemove);
              }

              remove(plantCommunities.indexOf(communityToRemove));
              setIdToRemove(null);
            }}
          />

          <ul
            className={classnames('collaspible-boxes', {
              'collaspible-boxes--empty': isEmpty,
            })}
          >
            {plantCommunities.map((plantCommunity: any, index: number) => (
              <PlantCommunityBox
                key={plantCommunity.id}
                plantCommunity={plantCommunity}
                activeIndex={activeIndex}
                index={index}
                planId={planId}
                pastureId={pastureId}
                onClick={() => {
                  index === activeIndex ? setActiveIndex(-1) : setActiveIndex(index);
                }}
                onDelete={() => setIdToRemove(plantCommunity.id)}
                namespace={`${namespace}.plantCommunities.${index}`}
              />
            ))}
          </ul>
        </div>
      )}
    />
  );
}

export default PlantCommunities;
