import React, { useState } from 'react';
import { useReferences } from '../../../providers/ReferencesProvider';
import { REFERENCE_KEY } from '../../../constants/variables';
import { MuiIcon } from '../../common';
import InputModal from '../../common/InputModal';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

interface AddPlantCommunityButtonProps {
  onSubmit: (plantCommunity: any) => void;
}

function AddPlantCommunityButton({ onSubmit }: AddPlantCommunityButtonProps) {
  const types = (useReferences() as any)[REFERENCE_KEY.PLANT_COMMUNITY_TYPE] || [];

  return <PlantCommunityPicker onSubmit={onSubmit} types={types} />;
}

interface PlantCommunityPickerProps {
  types: any[];
  onSubmit: (plantCommunity: any) => void;
}

const PlantCommunityPicker = React.memo<PlantCommunityPickerProps>(
  ({ types, onSubmit }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

    const options = types.map((type: any) => ({
      key: type.id,
      value: type.id,
      text: type.name,
      id: type.id,
    }));

    const otherType = types.find((t: any) => t.name === 'Other');

    const onOptionClicked = (communityTypeId: any) => {
      if (otherType && communityTypeId === otherType.id) {
        return setModalOpen(true);
      }

      const { ...plantCommunity } = types.find((t: any) => t.id === communityTypeId);

      onSubmit(plantCommunity);
    };

    return (
      <>
        <IconButton onClick={(e) => setMenuAnchorEl(e.currentTarget)}>
          <MuiIcon name="add circle" />
        </IconButton>
        <Menu anchorEl={menuAnchorEl} open={!!menuAnchorEl} onClose={() => setMenuAnchorEl(null)}>
          {options.map((opt) => (
            <MenuItem
              key={opt.key}
              onClick={() => {
                setMenuAnchorEl(null);
                onOptionClicked(opt.value);
              }}
            >
              {opt.text}
            </MenuItem>
          ))}
        </Menu>
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
