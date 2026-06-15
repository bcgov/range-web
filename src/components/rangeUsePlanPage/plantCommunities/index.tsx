import React, { useState } from 'react';
import classnames from 'classnames';
import uuid from 'uuid-v4';
import PlantCommunityBox from './PlantCommunityBox';
import AddPlantCommunityButton from './AddPlantCommunityButton';
import { FieldArray } from 'formik';
import { NOT_PROVIDED } from '../../../constants/strings';
import { IfEditable } from '../../common/PermissionsField';
import { PLANT_COMMUNITY } from '../../../constants/fields';
import { deletePlantCommunity } from '../../../api';
import { resetPlantCommunityId } from '../../../utils/helper/plantCommunity';
import ImportPastureModal from '../ImportPastureModal';
import { PrimaryButton, MuiIcon } from '../../common';
import useConfirm from '../../../providers/ConfrimationModalProvider';

interface PlantCommunitiesProps {
  plantCommunities: any[];
  namespace: string;
  planId: any;
  pastureId: any;
}

function PlantCommunities({ plantCommunities = [], namespace, planId, pastureId }: PlantCommunitiesProps) {
  const isEmpty = plantCommunities.length === 0;
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const confirm = useConfirm()!;

  return (
    <FieldArray
      name={`${namespace}.plantCommunities`}
      validateOnChange={false}
      render={({ push, remove }) => (
        <div className="rup__plant-communities">
          <div className="rup__plant-communities__title">Plant Communities</div>
          <IfEditable permission={PLANT_COMMUNITY.NAME}>
            <div style={{ display: 'flex', gap: 8 }}>
              <PrimaryButton
                type="button"
                onClick={() => setIsImportModalOpen(true)}
                startIcon={<MuiIcon name="add circle" />}
              >
                Import Plant Community
              </PrimaryButton>
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
                onDelete={async () => {
                  const choice = await confirm({
                    titleText: `Delete plant community '${plantCommunity?.communityType?.name}'`,
                    contentText: 'Are you sure you want to delete this plant community?',
                  });
                  if (!choice) return;
                  const id = plantCommunity.id;
                  if (!uuid.isUUID(id)) {
                    await deletePlantCommunity(planId, pastureId, id);
                  }
                  const idx = plantCommunities.indexOf(plantCommunity);
                  if (idx !== -1) remove(idx);
                }}
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
