import React, { useState } from 'react';
import { useReferences } from '../../../providers/ReferencesProvider';
import { REFERENCE_KEY } from '../../../constants/variables';
import { Button, Dropdown } from 'semantic-ui-react';
import InputModal from '../../common/InputModal';

interface AddPlantCommunityButtonProps {
  onSubmit: (plantCommunity: any) => void;
}

const AddPlantCommunityButton: React.FC<AddPlantCommunityButtonProps> = ({ onSubmit }) => {
  const types = (useReferences() as any)[REFERENCE_KEY.PLANT_COMMUNITY_TYPE] || [];

  return <PlantCommunityPicker onSubmit={onSubmit} types={types} />;
};

interface PlantCommunityPickerProps {
  types: any[];
  onSubmit: (plantCommunity: any) => void;
}

const PlantCommunityPicker = React.memo<PlantCommunityPickerProps>(
  ({ types, onSubmit }) => {
    const [isModalOpen, setModalOpen] = useState(false);

    const options = types.map((type: any) => ({
      key: type.id,
      value: type.id,
      text: type.name,
      id: type.id,
    }));

    const otherType = types.find((t: any) => t.name === 'Other');

    const onOptionClicked = (_e: any, { value: communityTypeId }: any) => {
      if (otherType && communityTypeId === otherType.id) {
        return setModalOpen(true);
      }

      const { ...plantCommunity } = types.find((t: any) => t.id === communityTypeId);

      onSubmit(plantCommunity);
    };

    return (
      <>
        <Dropdown
          trigger={
            <Button primary type="button" className="icon labeled rup__plant-communities__add-button">
              <i className="add circle icon" />
              Add Plant Community
            </Button>
          }
          options={options}
          icon={null}
          pointing="left"
          onChange={onOptionClicked}
          selectOnBlur={false}
          scrolling
          // Make the dropdown controlled so it doesn't remember the last option
          // picked and always fires `onChange`
          value={null as any}
        />
        <InputModal
          open={isModalOpen}
          onSubmit={(input: string) => {
            setModalOpen(false);
            onSubmit({ ...otherType, name: input });
          }}
          placeholder="Provincial community name or descriptive"
          onClose={() => setModalOpen(false)}
          title="Other Name"
        />
      </>
    );
  },
  (prevProps, nextProps) => prevProps.types === nextProps.types,
);

PlantCommunityPicker.displayName = 'PlantCommunityPicker';
export default AddPlantCommunityButton;
