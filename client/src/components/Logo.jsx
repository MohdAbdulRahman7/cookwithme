import React from 'react';
import { Box } from '@mui/material';
import logo from '../assets/teddy.gif'; // Path to your logo image

const Logo = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 16,
        left: 16,
        padding: '10px',
        zIndex: 10,
        '@media (max-width: 768px)': {
          top: 8,
          left: 8,
        },
      }}
    >
      <img
        src={logo} 
        alt="Logo"
        style={{
          width: 'auto',
          height: '100px', 
          maxWidth: '100%',
          maxHeight: '100%',
          '@media (maxWidth: 768px)': {
            height: '80px', 
          },
          '@media (maxWidth: 480px)': {
            height: '60px', 
          },
        }}
      />
    </Box>
  );
};

export default Logo;
