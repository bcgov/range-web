import React from 'react';
import { Form } from '@storybook/components';
import { ADDON_ID } from './constants';
import { useAddonState, useChannel } from '@storybook/api';
import { STORY_RENDERED } from '@storybook/core-events';

const roleOptions = [
  {
    key: 'myra_range_officer',
    value: 'myra_range_officer',
    text: 'Range Officer',
  },
  {
    key: 'myra_client',
    value: 'myra_client',
    text: 'Agreement Holder',
  },
];

const ViewportTool = () => {
  const [role, setRole] = useAddonState(ADDON_ID, 'myra_range_officer');

  const emit = useChannel({
    [STORY_RENDERED]: () => {
      setTimeout(() => {
        emit('role/change', role);
      }, 100);
    },
  });

  const handleChange = (e) => {
    setRole(e.target.value);
    emit('role/change', e.target.value);
  };

  return (
    <Form.Select
      placeholder="Select role"
      style={{
        margin: 'auto 0 auto 15px',
      }}
      onChange={handleChange}
      value={role}
    >
      {roleOptions.map((role) => (
        <option key={role.key} value={role.value}>
          {role.text}
        </option>
      ))}
    </Form.Select>
  );
};

export default ViewportTool;
