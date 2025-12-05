import React from 'react';
import { Box } from '@mui/material';

/**
 * Reusable Logo Component - Responsive across all screen sizes
 * Automatically adjusts size based on screen width (mobile, tablet, laptop, desktop)
 */
const Logo = ({ variant = 'default' }) => {
  const sizes = {
    small: {
      height: { xs: '40px', sm: '50px', md: '60px', lg: '70px' },
      maxWidth: { xs: '200px', sm: '250px', md: '300px', lg: '350px' }
    },
    default: {
      height: { xs: '60px', sm: '80px', md: '100px', lg: '120px' },
      maxWidth: { xs: '250px', sm: '350px', md: '450px', lg: '550px' }
    },
    large: {
      height: { xs: '80px', sm: '100px', md: '140px', lg: '180px' },
      maxWidth: { xs: '300px', sm: '400px', md: '550px', lg: '700px' }
    }
  };

  const selectedSize = sizes[variant] || sizes.default;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
      }}
    >
      <img
        src="/logo/ApplicationMainLogo.png"
        alt="Cognizant SmartPay Logo"
        style={{
          width: '100%',
          objectFit: 'contain',
          display: 'block'
        }}
        sx={{
          height: selectedSize.height,
          maxWidth: selectedSize.maxWidth
        }}
      />
    </Box>
  );
};

export default Logo;
