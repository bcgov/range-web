import React from 'react';
import { Icon, Popup } from 'semantic-ui-react';

type IconSizeProp = 'mini' | 'tiny' | 'small' | 'large' | 'big' | 'huge' | 'massive';

interface InfoTipProps {
  header?: string;
  content?: React.ReactNode;
  size?: IconSizeProp;
}

const style = {
  backgroundColor: '#002C71',
  color: 'white',
};

function InfoTip({ header, content, size = 'small' }: InfoTipProps) {
  return (
    <Popup
      basic
      wide={'very'}
      on={'click'}
      trigger={<Icon name="question" color="grey" size={size} circular />}
      style={style}
      header={header}
      content={content}
    />
  );
}

export default InfoTip;
