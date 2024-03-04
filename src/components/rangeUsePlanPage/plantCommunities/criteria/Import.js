import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect, getIn } from 'formik';
import ListModal from '../../../common/ListModal';
import { Button, Confirm, Modal } from 'semantic-ui-react';
import { oxfordComma } from '../../../../utils';
import { useReferences } from '../../../../providers/ReferencesProvider';
import { REFERENCE_KEY } from '../../../../constants/variables';

const initialState = {
  pasture: null,
  showPastureModal: false,
  plantCommunity: null,
  showPlantCommunityModal: false,
  showCriteriaModal: false,
  criteria: [],
  showConfirm: false,
};

const Import = ({ formik, onSubmit, excludedPlantCommunityId }) => {
  const [state, setState] = useState(initialState);

  const pastures = getIn(formik.values, 'pastures') || [];
  const communityTypes =
    useReferences()[REFERENCE_KEY.PLANT_COMMUNITY_TYPE] || [];

  const pasturesOptions = pastures.map((pasture, index) => ({
    value: pasture.id,
    text: pasture.name || `Unnamed pasture ${index + 1}`,
    key: pasture.id,
    disabled:
      pasture.plantCommunities.filter(
        (community) => community.id !== excludedPlantCommunityId,
      ).length === 0,
    pasture,
  }));

  const close = () => {
    setState(initialState);
  };

  let plantCommunityOptions = [];
  if (state.pasture) {
    plantCommunityOptions = state.pasture.plantCommunities
      .filter((community) => community.id !== excludedPlantCommunityId)
      .map((pc) => ({
        value: pc.id,
        text:
          pc.name ??
          communityTypes.find((type) => type.id === pc.communityTypeId)?.name,
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
        onOptionClick={({ pasture }) =>
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
        title={
          state.pasture
            ? `Choose Plant Community from ${state.pasture.name}`
            : 'Choose Plant Community'
        }
        onClose={close}
        onOptionClick={({ plantCommunity }) => {
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
        onSubmit={(criteria) => {
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
            <p>
              The following Criteria sections in the current plant community
              will be overwritten:
            </p>
            <p>{oxfordComma(state.criteria.map((c) => c.text))}.</p>
          </Modal.Content>
        }
        header="Overwrite Specified Criteria"
        open={state.showConfirm}
        onCancel={close}
        onConfirm={() => {
          onSubmit({
            pasture: state.pasture,
            plantCommunity: state.plantCommunity,
            criteria: state.criteria.map((c) => c.value),
          });
          close();
        }}
      />
    </>
  );
};

Import.propTypes = {
  formik: PropTypes.shape({
    values: PropTypes.shape({
      pastures: PropTypes.array.isRequired,
    }),
  }),
  onSubmit: PropTypes.func.isRequired,
};

export default connect(Import);
