import React from 'react';
import { Oval } from 'react-loader-spinner';

const Loader = ({ visible }) => {
  if (!visible) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}>
      <Oval color="#3498db" height={60} width={60} />
    </div>
  );
};

export default Loader;
