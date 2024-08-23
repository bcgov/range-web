import React from 'react';
import { Dropdown } from 'formik-semantic-ui';
import { Popup, Icon } from 'semantic-ui-react';

const HelpfulDropdown = ({ help, ...props }) => {
  return (
    <>
      <Dropdown
        {...props}
        label={
          <>
            {props.label && <label style={{ display: 'inline', marginRight: 5 }}>{props.label}</label>}
            <Popup content={help} trigger={<Icon name="question circle outline" color="blue" />} />
          </>
        }
      />
    </>
  );
};

export default HelpfulDropdown;
