import React from 'react';
import { useReferences } from '../../../providers/ReferencesProvider';
import { REFERENCE_KEY } from '../../../constants/variables';
import { Button, Dropdown } from 'semantic-ui-react';

interface AddMinisterIssueButtonProps {
  onSubmit: (ministerIssue: any) => void;
}

const AddMinisterIssueButton: React.FC<AddMinisterIssueButtonProps> = ({ onSubmit }) => {
  const types = (useReferences() as any)[REFERENCE_KEY.MINISTER_ISSUE_TYPE] || [];

  return <MinisterIssuePicker types={types} onSubmit={onSubmit} />;
};

interface MinisterIssuePickerProps {
  types: any[];
  onSubmit: (ministerIssue: any) => void;
}

const MinisterIssuePicker = React.memo<MinisterIssuePickerProps>(({ types, onSubmit }) => {
  const options = types.map((type: any) => ({
    key: type.id,
    value: type.id,
    text: type.name,
    id: type.id,
  }));

  const onOptionClicked = (_e: any, { value: ministerIssueTypeId }: any) => {
    const ministerIssue = types.find((t: any) => t.id === ministerIssueTypeId);

    onSubmit(ministerIssue);
  };

  return (
    <>
      <Dropdown
        trigger={
          <Button basic primary type="button" className="icon labeled rup__add-button">
            <i className="add circle icon" />
            Add Minister Issue
          </Button>
        }
        options={options}
        icon={null}
        pointing="right"
        onChange={onOptionClicked}
        selectOnBlur={false}
        value={null as any}
      />
    </>
  );
});

MinisterIssuePicker.displayName = 'MinisterIssuePicker';
export default AddMinisterIssueButton;
