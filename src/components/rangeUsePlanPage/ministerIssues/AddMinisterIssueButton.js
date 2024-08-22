import React from 'react';
import PropTypes from 'prop-types';
import { useReferences } from '../../../providers/ReferencesProvider';
import { REFERENCE_KEY } from '../../../constants/variables';
import { Button, Dropdown } from 'semantic-ui-react';

const AddMinisterIssueButton = ({ onSubmit }) => {
  const types = useReferences()[REFERENCE_KEY.MINISTER_ISSUE_TYPE] || [];

  return <MinisterIssuePicker types={types} onSubmit={onSubmit} />;
};

const MinisterIssuePicker = React.memo(({ types, onSubmit }) => {
  const options = types.map((type) => ({
    key: type.id,
    value: type.id,
    text: type.name,
    id: type.id,
  }));

  const onOptionClicked = (e, { value: ministerIssueTypeId }) => {
    const ministerIssue = types.find((t) => t.id === ministerIssueTypeId);

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
        value={null}
      />
    </>
  );
});

AddMinisterIssueButton.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
MinisterIssuePicker.displayName = 'MinisterIssuePicker';
export default AddMinisterIssueButton;
