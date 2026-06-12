import React, { useState } from 'react';
import { connect, getIn } from 'formik';
import ListModal from '../../../common/ListModal';
import { PrimaryButton } from '../../../common';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
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

function Import({ formik, onSubmit, excludedPlantCommunityId }: ImportProps) {
  const [state, setState] = useState(initialState);

  const pastures = getIn(formik.values, 'pastures') || [];
  const communityTypes = (useReferences() as any)[REFERENCE_KEY.PLANT_COMMUNITY_TYPE] || [];

  const pasturesOptions = pastures.map((pasture: any, index: number) => ({
    value: pasture.id,
    text: pasture.name || `Unnamed pasture ${index + 1}`,
    key: pasture.id,
    disabled:
      pasture.plantCommunities.filter((community: any) => community.id !== excludedPlantCommunityId).length === 0,
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
      <PrimaryButton
        type="button"
        onClick={() =>
          setState({
            ...state,
            showPastureModal: true,
          })
        }
      >
        Import
      </PrimaryButton>
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
      <Dialog open={state.showConfirm} onClose={close}>
        <DialogTitle>Overwrite Specified Criteria</DialogTitle>
        <DialogContent>
          <p>The following Criteria sections in the current plant community will be overwritten:</p>
          <p>{oxfordComma(state.criteria.map((c: any) => c.text))}.</p>
        </DialogContent>
        <DialogActions>
          <PrimaryButton inverted onClick={close}>
            Cancel
          </PrimaryButton>
          <PrimaryButton
            onClick={() => {
              onSubmit({
                pasture: state.pasture,
                plantCommunity: state.plantCommunity,
                criteria: state.criteria.map((c: any) => c.value),
              });
              close();
            }}
          >
            OK
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default connect(Import);
