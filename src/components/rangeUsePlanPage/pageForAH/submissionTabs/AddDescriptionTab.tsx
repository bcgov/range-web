import React from 'react';
import TextField from '@mui/material/TextField';
import RightBtn from '../tab/RightBtn';
import LeftBtn from '../tab/LeftBtn';
import TabTemplate from '../tab/TabTemplate';
import { NUMBER_OF_LIMIT_FOR_NOTE } from '../../../../constants/variables';

interface AddDescriptionTabProps {
  currTabId: string;
  note: string;
  onClose: () => void;
  onNextClicked: (...args: any[]) => void;
  handleNoteChange: (...args: any[]) => void;
  tab: { id: string; title: string; next: string; placeholder: string };
}

function AddDescriptionTab({ currTabId, tab, onClose, handleNoteChange, note, onNextClicked }: AddDescriptionTabProps) {
  const { id, title, placeholder } = tab;
  const lengthOfNote = `${note.length}/${NUMBER_OF_LIMIT_FOR_NOTE}`;
  const isActive = id === currTabId;
  if (!isActive) return null;
  const handleNext = (e: any) => {
    onNextClicked(e, { value: tab.next });
  };
  return (
    <TabTemplate
      isActive={isActive}
      title={title}
      actions={
        <>
          <LeftBtn onClick={onClose} content="Cancel" />
          <RightBtn onClick={handleNext} content="Next" />
        </>
      }
      content={
        <div>
          <div className="rup__multi-tab__note">
            <div className="rup__multi-tab__note__title">
              Add Description ({NUMBER_OF_LIMIT_FOR_NOTE} characters). It will be visible to range staff and other
              agreement holders.
            </div>
            <TextField
              placeholder={placeholder}
              onChange={(e) => handleNoteChange(e, { value: e.target.value })}
              value={note}
              multiline
              fullWidth
              minRows={3}
            />
            <div className="rup__multi-tab__note__text-length">{lengthOfNote}</div>
          </div>
        </div>
      }
    />
  );
}
export default AddDescriptionTab;
