import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      <span>Loading...</span>
    </div>
  );
};

export default Spinner;
