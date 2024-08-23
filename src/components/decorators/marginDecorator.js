import React from 'react';

const marginDecorator = (story) => <div style={{ margin: '10px' }}>{story()}</div>;

export default marginDecorator;
