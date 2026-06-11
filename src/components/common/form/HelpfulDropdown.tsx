import React from 'react';
import { Dropdown as FormikDropdown } from 'formik-semantic-ui';
import { Popup, Icon } from 'semantic-ui-react';

// Cast to work around formik-semantic-ui strict prop requirements
const Dropdown = FormikDropdown as any;

interface HelpfulDropdownProps {
  help: string;
  label?: string;
  name: string;
  [key: string]: any;
}

const HelpfulDropdown: React.FC<HelpfulDropdownProps> = ({ help, ...props }) => {
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
