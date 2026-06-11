import React from 'react';
import { Radio, Form as SUIForm, TextArea } from 'semantic-ui-react';
const Form = SUIForm as any;
import { AMENDMENT_TYPE, NUMBER_OF_LIMIT_FOR_NOTE } from '../../../../constants/variables';
import RightBtn from '../tab/RightBtn';
import LeftBtn from '../tab/LeftBtn';
import TabTemplate from '../tab/TabTemplate';

interface ChooseAmendmentTypeTabProps { isMandatory: boolean; isMinor: boolean; isAmendmentTypeDecided: boolean; currTabId: string; note: string; amendmentTypeCode: string | undefined; handleAmendmentTypeChange: (...args: any[]) => void; handleNoteChange: (...args: any[]) => void; handleTabChange: (...args: any[]) => void; onClose: () => void; tab: { id: string; title: string; next: string }; [key: string]: any; }

const ChooseAmendmentTypeTab: React.FC<ChooseAmendmentTypeTabProps> = (props) => {
  const { currTabId, tab, note, amendmentTypeCode, onClose, handleAmendmentTypeChange, handleNoteChange, isMandatory, isMinor, isAmendmentTypeDecided, handleTabChange } = props;
  const { id, title } = tab;
  const isActive = id === currTabId;
  if (!isActive) return null;
  const onNextClicked = (e: any) => { handleTabChange(e, { value: tab.next }); };
  const lengthOfNote = note ? `${note.length}/${NUMBER_OF_LIMIT_FOR_NOTE}` : `0/${NUMBER_OF_LIMIT_FOR_NOTE}`;
  return (
    <TabTemplate isActive={isActive} title={title}
      actions={<><LeftBtn onClick={onClose} content="Cancel" /><RightBtn onClick={onNextClicked} disabled={amendmentTypeCode === undefined && !isAmendmentTypeDecided} content="Next" /></>}
      content={<Form><Form.Field className="rup__multi-tab__radio-field"><Radio className="rup__multi-tab__radio" label={<label><b>Minor Amendment: </b>Otherwise conforms to this Act, the regulations and the standards, and does not materially affect the likelihood of achieving the intended results specified in the plan.</label>} name="radioGroup" value={AMENDMENT_TYPE.MINOR} checked={isMinor} onChange={handleAmendmentTypeChange} disabled={isAmendmentTypeDecided} /></Form.Field><Form.Field className="rup__multi-tab__radio-field"><Radio className="rup__multi-tab__radio" label={<label><b>Mandatory Amendment: </b>Does not meet the minor amendment criteria, or has been required by the decision makers.</label>} name="radioGroup" value={AMENDMENT_TYPE.MANDATORY} checked={isMandatory} onChange={handleAmendmentTypeChange} disabled={isAmendmentTypeDecided} /></Form.Field><div className="rup__multi-tab__note__title">Add Description ({NUMBER_OF_LIMIT_FOR_NOTE} characters). It will be visible to range staff and other agreement holders.</div><TextArea placeholder="Summarize what the proposed amendment includes." onChange={handleNoteChange} value={note} /><div className="rup__multi-tab__note__text-length">{lengthOfNote}</div></Form>}
    />
  );
};
export default ChooseAmendmentTypeTab;
