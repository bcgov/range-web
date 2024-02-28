import React, { useState, useEffect } from 'react';
import { UserContext } from '../../src/providers/UserProvider';
import user from '../mocks/user';
import addons from '@storybook/addons';

const UserProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState('myra_range_officer');

  const channel = addons.getChannel();

  const handleChange = (role) => {
    setCurrentRole(role);
  };

  useEffect(() => {
    channel.on('role/change', handleChange);

    return () => {
      channel.removeListener('role/change', handleChange);
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        ...user,
        roles: [currentRole],
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
