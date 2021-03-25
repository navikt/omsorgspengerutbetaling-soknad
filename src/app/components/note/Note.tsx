import React from 'react';

const Note: React.FunctionComponent = ({ children }) => (
    <span style={{ backgroundColor: '#fff2e0', fontStyle: 'italic', padding: '0 .25rem' }}>{children}</span>
);

export default Note;
