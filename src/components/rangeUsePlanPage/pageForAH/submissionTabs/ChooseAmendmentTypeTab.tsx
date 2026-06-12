import React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { AMENDMENT_TYPE, NUMBER_OF_LIMIT_FOR_NOTE } from '../../../../constants/variables';
import RightBtn from '../tab/RightBtn';
import LeftBtn from '../tab/LeftBtn';
import TabTemplate from '../tab/TabTemplate';

interface ChooseAmendmentTypeTabProps {
  isMandatory: boolean;
  isMinor: boolean;
  isAmendmentTypeDecided: boolean;
  currTabId: string;
  note: string;
  amendmentTypeCode: string | undefined;
  handleAmendmentTypeChange: (...args: any[]) => void;
  handleNoteChange: (...args: any[]) => void;
  handleTabChange: (...args: any[]) => void;
  onClose: () => void;
  tab: { id: string; title: string; next: string };
  [key: string]: any;
}

function ChooseAmendmentTypeTab(props: ChooseAmendmentTypeTabProps) {
  const {
    currTabId,
    tab,
    note,
    amendmentTypeCode,
    onClose,
    handleAmendmentTypeChange,
    handleNoteChange,
    isMandatory,
    isMinor,
    isAmendmentTypeDecided,
    handleTabChange,
  } = props;
  const { id, title } = tab;
  const isActive = id === currTabId;
  if (!isActive) return null;
  const onNextClicked = (e: any) => {
    handleTabChange(e, { value: tab.next });
  };
  const lengthOfNote = note ? `${note.length}/${NUMBER_OF_LIMIT_FOR_NOTE}` : `0/${NUMBER_OF_LIMIT_FOR_NOTE}`;
  return (
    <TabTemplate
      isActive={isActive}
      title={title}
      actions={
        <>
          <LeftBtn onClick={onClose} content="Cancel" />
          <RightBtn
            onClick={onNextClicked}
            disabled={amendmentTypeCode === undefined && !isAmendmentTypeDecided}
            content="Next"
          />
        </>
      }
      content={
        <FormControl component="fieldset" fullWidth>
          <RadioGroup
            value={amendmentTypeCode || ''}
            onChange={(e) => handleAmendmentTypeChange(e, { value: e.target.value })}
          >
            <div className="rup__multi-tab__radio-field">
              <FormControlLabel
                value={AMENDMENT_TYPE.MINOR}
                control={<Radio checked={isMinor} disabled={isAmendmentTypeDecided} />}
                label={
                  <label>
                    <b>Minor Amendment: </b>Otherwise conforms to this Act, the regulations and the standards, and does
                    not materially affect the likelihood of achieving the intended results specified in the plan.
                  </label>
                }
              />
            </div>
            <div className="rup__multi-tab__radio-field">
              <FormControlLabel
                value={AMENDMENT_TYPE.MANDATORY}
                control={<Radio checked={isMandatory} disabled={isAmendmentTypeDecided} />}
                label={
                  <label>
                    <b>Mandatory Amendment: </b>Does not meet the minor amendment criteria, or has been required by the
                    decision makers.
                  </label>
                }
              />
            </div>
          </RadioGroup>
          <div className="rup__multi-tab__note__title">
            Add Description ({NUMBER_OF_LIMIT_FOR_NOTE} characters). It will be visible to range staff and other
            agreement holders.
          </div>
          <TextField
            placeholder="Summarize what the proposed amendment includes."
            onChange={(e) => handleNoteChange(e, { value: e.target.value })}
            value={note}
            multiline
            fullWidth
            minRows={3}
          />
          <div className="rup__multi-tab__note__text-length">{lengthOfNote}</div>
        </FormControl>
      }
    />
  );
}
export default ChooseAmendmentTypeTab;
