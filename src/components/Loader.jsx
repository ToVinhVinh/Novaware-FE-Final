import React from 'react';
import { CircularProgress } from '@material-ui/core';

const Loader = ({ my = 40 }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        marginTop: my,
        marginBottom: my,
      }}
    >
      <CircularProgress color='secondary' />
    </div>
  );
};

export default Loader;
