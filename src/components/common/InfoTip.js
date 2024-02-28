import React from 'react';
import { Icon, Popup } from 'semantic-ui-react';

const style = {
  backgroundColor: '#002C71',
  color: 'white',
};

const InfoTip = ({ header, content, size = 'small' }) => (
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

export default InfoTip;
