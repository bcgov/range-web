import React, { useEffect, useState } from 'react';

const EnvironmentRibbon = () => {
  const [environment, setEnvironment] = useState(null);

  useEffect(() => {
    // Detect environment based on URL
    const hostname = window.location.hostname;

    if (hostname.includes('-dev.')) {
      setEnvironment('development');
    } else if (hostname.includes('-test.')) {
      setEnvironment('test');
    } else if (hostname === 'myrangebc.gov.bc.ca') {
      setEnvironment('production');
    } else {
      // Fallback for local development or unknown environments
      setEnvironment('local');
    }
  }, []);

  // Only show ribbon in non-production environments
  if (!environment || environment === 'production') return null;

  const ribbonContainerStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 9999,
    overflow: 'hidden',
    height: '90px',
    width: '90px',
    pointerEvents: 'none', // So it doesn't interfere with clicks
  };

  const ribbonStyles = {
    position: 'absolute',
    top: '15px',
    left: '-35px',
    transform: 'rotate(-45deg)',
    backgroundColor: getEnvironmentColor(environment),
    color: 'white',
    padding: '5px 35px',
    fontSize: '12px',
    fontWeight: 'bold',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
    width: '140px',
  };

  return (
    <div style={ribbonContainerStyles}>
      <div style={ribbonStyles}>{environment.toUpperCase()}</div>
    </div>
  );
};

const getEnvironmentColor = (env) => {
  switch (env) {
    case 'development':
      return '#ff7f50'; // Coral
    case 'test':
      return '#4682b4'; // Steel Blue
    case 'local':
      return '#9932cc'; // Dark Orchid
    default:
      return '#3cb371'; // Medium Sea Green
  }
};

export default EnvironmentRibbon;
