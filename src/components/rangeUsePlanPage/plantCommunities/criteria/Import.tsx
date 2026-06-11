import React, { useState } from 'react';
import { connect, getIn } from 'formik';
import ListModal from '../../../common/ListModal';
import { Button, Confirm, Modal } from 'semantic-ui-react';
import { oxfordComma } from '../../../../utils';
import { useReferences } from '../../../../providers/ReferencesProvider';
import { REFERENCE_KEY } from '../../../../constants/variables';

interface ImportProps {
  formik?: any;
  onSubmit: (data: { pasture: any; plantCommunity: any; criteria: string[] }) => void;
  excludedPlantCommunityId: any;
}

const initialState = {
  pasture: null as any,
  showPastureModal: false,
  plantCommunity: null as any,
  showPlantCommunityModal: false,
  showCriteriaModal: false,
  criteria: [] as any[],
  showConfirm: false,
};

const Import: React.FC<ImportProps> = ({ formik, onSubmit, excludedPlantCommunityId }) => {
  const [state, setState] = useState(initialState);

  const pastures = getIn(formik.values, 'pastures') || [];
  const communityTypes = (useReferences() as any)[REFERENCE_KEY.PLANT_COMMUNITY_TYPE] || [];

  const pasturesOptions = pastures.map((pasture: any, index: number) => ({
    value: pasture.id,
    text: pasture.name || `Unnamed pasture ${index + 1}`,
    key: pasture.id,
    disabled: pasture.plantCommunities.filter((community: any) => community.id !== excludedPlantCommunityId).length === 0,
    pasture,
  }));

  const close = () => {
    setState(initialState);
  };

  let plantCommunityOptions: any[] = [];
  if (state.pasture) {
    plantCommunityOptions = state.pasture.plantCommunities
      .filter((community: any) => community.id !== excludedPlantCommunityId)
      .map((pc: any) => ({
        value: pc.id,
        text: pc.name ?? communityTypes.find((type: any) => type.id === pc.communityTypeId)?.name,
        key: pc.id,
        plantCommunity: pc,
      }));
  }

  return (
    <>
      <Button
        primary
        type="button"
        onClick={() =>
          setState({
            ...state,
            showPastureModal: true,
          })
        }
      >
        Import
      </Button>
      <ListModal
        options={pasturesOptions}
        open={state.showPastureModal}
        title="Choose Pasture"
        onClose={close}
        onOptionClick={({ pasture }: any) =>
          setState({
            ...state,
            pasture,
            showPastureModal: false,
            showPlantCommunityModal: true,
          })
        }
      />
      <ListModal
        options={plantCommunityOptions}
        open={state.showPlantCommunityModal}
        title={state.pasture ? `Choose Plant Community from ${state.pasture.name}` : 'Choose Plant Community'}
        onClose={close}
        onOptionClick={({ plantCommunity }: any) => {
          setState((oldState) => ({
            ...oldState,
            plantCommunity,
            showPlantCommunityModal: false,
            showCriteriaModal: true,
          }));
        }}
      />
      <ListModal
        multiselect
        open={state.showCriteriaModal}
        title="Choose Criteria"
        options={[
          {
            key: 'rangeReadiness',
            value: 'rangeReadiness',
            text: 'Range Readiness Criteria',
          },
          {
            key: 'stubbleHeight',
            value: 'stubbleHeight',
            text: 'Stubble Height',
          },
          {
            key: 'shrubUse',
            value: 'shrubUse',
            text: 'Shrub Use',
          },
        ]}
        onClose={close}
        onSubmit={(criteria: any) => {
          setState((oldState) => ({
            ...oldState,
            showCriteriaModal: false,
            showConfirm: true,
            criteria,
          }));
        }}
      />
      <Confirm
        dimmer="blurring"
        content={
          <Modal.Content>
            <p>The following Criteria sections in the current plant community will be overwritten:</p>
            <p>{oxfordComma(state.criteria.map((c: any) => c.text))}.</p>
          </Modal.Content>
        }
        header="Overwrite Specified Criteria"
        open={state.showConfirm}
        onCancel={close}
        onConfirm={() => {
          onSubmit({
            pasture: state.pasture,
            plantCommunity: state.plantCommunity,
            criteria: state.criteria.map((c: any) => c.value),
          });
          close();
        }}
      />
    </>
  );
};

export default connect(Import);
