import React, { useState } from 'react';
import { useReferences } from '../../../providers/ReferencesProvider';
import { REFERENCE_KEY } from '../../../constants/variables';
import { Button, Dropdown } from 'semantic-ui-react';
import InputModal from '../../common/InputModal';

interface AddMinisterIssueActionButtonProps {
  onSubmit: (action: any) => void;
}

function AddMinisterIssueActionButton({ onSubmit }: AddMinisterIssueActionButtonProps) {
  const [isModalOpen, setModalOpen] = useState(false);

  const types = (useReferences() as any)[REFERENCE_KEY.MINISTER_ISSUE_ACTION_TYPE] || [];
  const options = types.map((type: any) => ({
    key: type.id,
    value: type.id,
    text: type.name,
    id: type.id,
  }));

  const otherType = types.find((t: any) => t.name === 'Other');

  const onOptionClicked = (_e: any, { value: ministerIssueActionTypeId }: any) => {
    if (otherType && ministerIssueActionTypeId === otherType.id) {
      return setModalOpen(true);
    }

    const ministerIssueAction = types.find((t: any) => t.id === ministerIssueActionTypeId);

    onSubmit(ministerIssueAction);
  };

  return (
    <>
      <Dropdown
        trigger={
          <Button primary type="button" className="icon labeled">
            <i className="add circle icon" />
            Add Action
          </Button>
        }
        options={options}
        icon={null}
        pointing="left"
        onChange={onOptionClicked}
        selectOnBlur={false}
        value={null as any}
      />
      <InputModal
        open={isModalOpen}
        onSubmit={(input: string) => {
          setModalOpen(false);
          onSubmit({ ...otherType, other: input });
        }}
        onClose={() => setModalOpen(false)}
        title="Other Name"
      />
    </>
  );
}

export default AddMinisterIssueActionButton;
