import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Alert, CircularProgress, Chip } from '@mui/material';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import PhonelinkIcon from '@mui/icons-material/Phonelink';
import LaptopIcon from '@mui/icons-material/Laptop';
import UsbIcon from '@mui/icons-material/Usb';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { authenticateUser, enableTestMode } from '../api';
import { 
  detectBiometricCapabilities, 
  captureFingerprintUniversal,
  getBiometricStatus 
} from '../utils/biometricUtils';

const WelcomeKiosk = ({ onLogin, onRegister }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState({ available: false, message: 'Detecting...', deviceType: 'None' });

  // Detect biometric capabilities on component mount
  useEffect(() => {
    const detectDevice = async () => {
      try {
        await detectBiometricCapabilities();
        
        const status = await getBiometricStatus();
        setDeviceStatus(status);
      } catch (error) {
        console.error('Device detection failed:', error);
        setDeviceStatus({
          available: false,
          message: 'Unable to detect fingerprint sensor',
          deviceType: 'Unknown'
        });
      }
    };
    
    detectDevice();
  }, []);

  const handleFingerprintScan = async () => {
    // Backend is not ready yet, show helpful message instead of triggering WebAuthn
    setError('Authentication failed. Please try again.');
    
    // Uncomment below code when backend is ready:
    
    try {
      setLoading(true);
      setError('');
      
      // Check if device is available
      if (!deviceStatus.available) {
        setLoading(false);
        setError('No fingerprint sensor detected. Please use Test Mode below.');
        return;
      }
      
      // Universal fingerprint capture - works with ANY device
      // Automatically detects: Mobile, Laptop, Tablet, or External USB scanner
      const fingerprintData = await captureFingerprintUniversal();
      
      // Send captured fingerprint to backend for authentication
      const response = await authenticateUser(fingerprintData);
      
      // Check if user is enabled in the system
      if (response.data && response.data.enabled) {
        onLogin(response.data);
      } else {
        setError('User account is disabled. Please contact administrator.');
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      
      // User-friendly error messages
      if (err.message.includes('cancelled')) {
        setError('Fingerprint scan was cancelled. Please try again.');
      } else if (err.message.includes('not available')) {
        setError('No fingerprint sensor detected. Please use Test Mode below.');
      } else if (err.message.includes('not enrolled') || err.message.includes('No credentials')) {
        setError('⚠️ Biometric not enrolled. Backend integration required. Please use Test Mode for now.');
      } else if (err.message.includes('not recognized')) {
        setError('Fingerprint not recognized. Please try again or contact support.');
      } else {
        setError(err.message || 'Fingerprint authentication failed. Please use Test Mode below.');
      }
    }
    
  };

  // Get icon based on device type
  const getDeviceIcon = () => {
    const deviceName = deviceStatus.deviceType.toLowerCase();
    if (deviceName.includes('android') || deviceName.includes('touch id')) {
      return <PhonelinkIcon sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }} />;
    } else if (deviceName.includes('windows') || deviceName.includes('laptop')) {
      return <LaptopIcon sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }} />;
    } else if (deviceName.includes('external') || deviceName.includes('usb')) {
      return <UsbIcon sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }} />;
    }
    return <FingerprintIcon sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }} />;
  };

  return (
    <Box 
      sx={{ 
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        bgcolor: '#000048',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        p: { xs: 0.75, sm: 1.25, md: 1.75 }
      }}
    >
      <Box 
        sx={{ 
          maxWidth: { xs: '98%', sm: '88%', md: '630px', lg: '660px' },
          width: '100%',
          bgcolor: '#ffffff',
          borderRadius: { xs: 2, sm: 3 },
          boxShadow: { xs: 3, sm: 4 },
          p: { xs: 1.4, sm: 1.8, md: 2.3, lg: 2.8 },
          textAlign: 'center'
        }}
      >
        {/* Logo */}
        <Box sx={{ mb: { xs: 0.6, sm: 0.85, md: 1 } }}>
          <img 
            src="/logo/ApplicationMainLogo.png" 
            alt="Cognizant SmartPay Logo" 
            style={{ 
              width: '100%',
              maxWidth: '185px',
              height: 'auto',
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto',
              backgroundColor: 'transparent',
              mixBlendMode: 'multiply'
            }}
          />
        </Box>

        {/* Welcome Text */}
        <Typography 
          variant="h3" 
          sx={{ 
            fontFamily: 'Gallix, sans-serif',
            color: '#000048',
            fontWeight: 'bold',
            fontSize: { xs: '1.08rem', sm: '1.22rem', md: '1.37rem', lg: '1.52rem' },
            mb: { xs: 0.35, sm: 0.55, md: 0.65 },
            lineHeight: 1.2
          }}
        >
          Welcome To Cognizant-SmartPay
        </Typography>

        <Typography 
          variant="h6" 
          sx={{ 
            fontFamily: 'Gallix, sans-serif',
            color: '#000048',
            fontSize: { xs: '0.69rem', sm: '0.79rem', md: '0.84rem', lg: '0.89rem' },
            mb: { xs: 0.8, sm: 1, md: 1.2 },
            opacity: 0.8
          }}
        >
          Please scan your fingerprint to start
        </Typography>

        {/* Device Status Indicator */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 0.8, sm: 1, md: 1.2 } }}>
          <Chip
            icon={deviceStatus.available ? <CheckCircleIcon /> : getDeviceIcon()}
            label={deviceStatus.deviceType}
            size="small"
            color={deviceStatus.available ? "success" : "default"}
            sx={{
              fontFamily: 'Gallix, sans-serif',
              fontSize: { xs: '0.65rem', sm: '0.75rem' },
              fontWeight: 'bold',
              height: { xs: '22px', sm: '26px' },
              '& .MuiChip-icon': {
                fontSize: { xs: '0.85rem', sm: '0.95rem' }
              }
            }}
          />
        </Box>

        {/* Fingerprint Icon */}
        <Box 
          sx={{ 
            display: 'flex',
            justifyContent: 'center',
            mb: { xs: 0.9, sm: 1.15, md: 1.25 }
          }}
        >
          <Box
            sx={{
              width: { xs: 67, sm: 82, md: 97, lg: 107 },
              height: { xs: 67, sm: 82, md: 97, lg: 107 },
              borderRadius: '50%',
              bgcolor: loading ? '#000048' : '#e3f2fd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={!loading ? handleFingerprintScan : null}
          >
            {loading ? (
              <CircularProgress 
                sx={{ 
                  color: '#ffffff',
                  width: { xs: '33px !important', sm: '43px !important', md: '49px !important' },
                  height: { xs: '33px !important', sm: '43px !important', md: '49px !important' }
                }} 
              />
            ) : (
              <FingerprintIcon
                sx={{
                  fontSize: { xs: 43, sm: 53, md: 63, lg: 68 },
                  color: '#000048'
                }}
              />
            )}
          </Box>
        </Box>

        {/* Scan Button */}
        <Button 
          variant="contained" 
          onClick={handleFingerprintScan} 
          disabled={loading}
          startIcon={loading ? null : getDeviceIcon()}
          fullWidth
          sx={{ 
            mt: { xs: 0.45, sm: 0.7, md: 0.8 },
            py: { xs: 1.18, sm: 1.45, md: 1.65 },
            fontSize: { xs: '0.79rem', sm: '0.84rem', md: '0.93rem', lg: '0.99rem' },
            fontFamily: 'Gallix, sans-serif',
            fontWeight: 'bold',
            bgcolor: '#000048',
            '&:hover': {
              bgcolor: '#000066'
            },
            '&:disabled': {
              bgcolor: '#cccccc'
            }
          }}
        >
          {loading ? 'Scanning Fingerprint...' : 'TAP TO SCAN YOUR FINGERPRINT'}
        </Button>

        {/* Error Message */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mt: { xs: 0.7, sm: 0.92, md: 1 },
              fontFamily: 'Gallix, sans-serif',
              fontSize: { xs: '0.74rem', sm: '0.79rem' },
              py: { xs: 0.28, sm: 0.48 }
            }}
          >
            {error}
          </Alert>
        )}

       
        
        {/*        TESTING MODE SECTION - START       */}
        {/* Uncomment this block to enable test mode login */}
        {/* <Box sx={{ mt: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 3 }, borderTop: '1px dashed #ccc' }}>
          <Typography 
            variant="caption" 
            sx={{ 
              fontFamily: 'Gallix, sans-serif',
              color: '#dc004e',
              fontSize: { xs: '0.75rem', sm: '0.85rem' },
              display: 'block',
              mb: { xs: 1.5, sm: 2 }
            }}
          >
             TESTING MODE (Remove after backend integration)
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => {
              // Enable test mode to use mock data
              enableTestMode();
              // Mock Farheen user data for testing
              onLogin({
                id: 6,
                userId: 6,
                name: 'Farheen',
                email: 'farheen@smartpay.com',
                walletBalance: 550.00,
                biometricEnabled: true,
                status: 'ACTIVE'
              });
            }}
            fullWidth
            sx={{ 
              py: { xs: 1.2, sm: 1.5 },
              fontSize: { xs: '0.9rem', sm: '1rem' },
              fontFamily: 'Gallix, sans-serif',
              fontWeight: 'bold',
              borderColor: '#dc004e',
              color: '#dc004e',
              '&:hover': {
                borderColor: '#dc004e',
                bgcolor: 'rgba(220, 0, 78, 0.04)'
              }
            }}
          >
            🚀 TEST LOGIN AS FARHEEN (BYPASS FINGERPRINT)
          </Button>
        </Box> */}
        {/*          TESTING MODE SECTION - END         */}
        
        

        {/* Instructions */}
        
        
      </Box>
    </Box>
  );
};

export default WelcomeKiosk;
