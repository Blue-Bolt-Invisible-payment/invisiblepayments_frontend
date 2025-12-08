import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  Chip,
  IconButton
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { registerNewUser } from '../api';
import {
  detectBiometricCapabilities,
  enrollFingerprint,
  getBiometricStatus
} from '../utils/biometricUtils';

/**
 * UserRegistration Component
 * Register new users with fingerprint enrollment
 * 
 * USAGE: Uncomment the route in App.js to enable this page
 * Route: /register
 * 
 * TO REMOVE: Comment out the route and this component will not affect the app
 */
const UserRegistration = ({ onBack, onRegistrationComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deviceStatus, setDeviceStatus] = useState({
    available: false,
    message: 'Detecting...',
    deviceType: 'None'
  });

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    initialBalance: 1000.0,
    fingerprintData: null
  });

  const steps = ['User Details', 'Fingerprint Enrollment', 'Wallet Setup'];

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

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
    setError('');
  };

  const handleNext = () => {
    // Validate current step
    if (activeStep === 0) {
      if (!formData.name || !formData.email) {
        setError('Please fill in all required fields');
        return;
      }
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }
    }

    if (activeStep === 1) {
      if (!formData.fingerprintData) {
        setError('Please enroll your fingerprint first');
        return;
      }
    }

    setActiveStep((prevStep) => prevStep + 1);
    setError('');
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError('');
  };

  const handleFingerprintEnroll = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Check if device is available
      if (!deviceStatus.available) {
        setLoading(false);
        setError(
          'No fingerprint sensor detected. Please ensure your device has a biometric sensor and try again.'
        );
        return;
      }

      // Enroll fingerprint
      const fingerprintData = await enrollFingerprint(
        Date.now(), // Temporary ID until user is created
        formData.name
      );

      setFormData({
        ...formData,
        fingerprintData: fingerprintData
      });

      setSuccess('Fingerprint enrolled successfully! ✓');
      setLoading(false);
    } catch (err) {
      setLoading(false);

      // User-friendly error messages
      if (err.message.includes('cancelled')) {
        setError('Fingerprint enrollment was cancelled. Please try again.');
      } else if (err.message.includes('not available')) {
        setError(
          'Fingerprint sensor not available. Please check your device settings.'
        );
      } else {
        setError(
          err.message ||
            'Fingerprint enrollment failed. Please try again or contact support.'
        );
      }
    }
  };

  const handleSubmitRegistration = async () => {
    try {
      setLoading(true);
      setError('');

      // Prepare registration data
      const registrationData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        initialWalletBalance: parseFloat(formData.initialBalance),
        fingerprintData: formData.fingerprintData,
        deviceType: deviceStatus.deviceType,
        enrolledAt: new Date().toISOString()
      };

      // Call API to register user
      const response = await registerNewUser(registrationData);

      setSuccess(
        `Registration successful! User ID: ${response.data.userId}. You can now login.`
      );
      setLoading(false);

      // Notify parent component
      if (onRegistrationComplete) {
        setTimeout(() => {
          onRegistrationComplete(response.data);
        }, 2000);
      }
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message ||
          err.message ||
          'Registration failed. Please try again.'
      );
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Enter User Details
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Provide your basic information to create an account
            </Typography>

            <TextField
              fullWidth
              label="Full Name *"
              value={formData.name}
              onChange={handleInputChange('name')}
              margin="normal"
              placeholder="Enter your full name"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonAddIcon />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              fullWidth
              label="Email Address *"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              margin="normal"
              placeholder="your.email@example.com"
              helperText="We'll use this for account recovery"
            />

            <TextField
              fullWidth
              label="Phone Number (Optional)"
              value={formData.phone}
              onChange={handleInputChange('phone')}
              margin="normal"
              placeholder="10-digit mobile number"
              inputProps={{ maxLength: 15 }}
            />
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Enroll Your Fingerprint
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Scan your fingerprint to enable biometric authentication
            </Typography>

            {/* Device Status */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Chip
                icon={
                  deviceStatus.available ? (
                    <CheckCircleIcon />
                  ) : (
                    <FingerprintIcon />
                  )
                }
                label={`Device: ${deviceStatus.deviceType}`}
                color={deviceStatus.available ? 'success' : 'default'}
                sx={{ fontWeight: 'bold' }}
              />
            </Box>

            {/* Fingerprint Icon */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  bgcolor: formData.fingerprintData ? '#4caf50' : '#e3f2fd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
                onClick={
                  !loading && !formData.fingerprintData
                    ? handleFingerprintEnroll
                    : null
                }
              >
                {loading ? (
                  <CircularProgress sx={{ color: '#ffffff' }} />
                ) : formData.fingerprintData ? (
                  <CheckCircleIcon sx={{ fontSize: 60, color: '#ffffff' }} />
                ) : (
                  <FingerprintIcon sx={{ fontSize: 60, color: '#000048' }} />
                )}
              </Box>
            </Box>

            {!formData.fingerprintData && (
              <Button
                variant="contained"
                onClick={handleFingerprintEnroll}
                disabled={loading || !deviceStatus.available}
                startIcon={<FingerprintIcon />}
                fullWidth
                sx={{
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  bgcolor: '#000048',
                  '&:hover': { bgcolor: '#000066' }
                }}
              >
                {loading ? 'Enrolling Fingerprint...' : 'Scan Fingerprint'}
              </Button>
            )}

            {formData.fingerprintData && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Fingerprint enrolled successfully! You can proceed to the next
                step.
              </Alert>
            )}

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', textAlign: 'center', mt: 2 }}
            >
              {deviceStatus.available
                ? 'Place your finger on the sensor when prompted'
                : 'No biometric sensor detected. Please use a device with fingerprint capability.'}
            </Typography>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Setup Wallet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add initial balance to your wallet
            </Typography>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mb: 3
              }}
            >
              <AccountBalanceWalletIcon
                sx={{ fontSize: 80, color: '#000048' }}
              />
            </Box>

            <TextField
              fullWidth
              label="Initial Wallet Balance"
              type="number"
              value={formData.initialBalance}
              onChange={handleInputChange('initialBalance')}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
                inputProps: { min: 0, step: 100 }
              }}
              helperText="Minimum balance: ₹0, Recommended: ₹1000"
            />

            <Box
              sx={{
                mt: 3,
                p: 2,
                bgcolor: '#f5f5f5',
                borderRadius: 2,
                border: '1px solid #e0e0e0'
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                Registration Summary:
              </Typography>
              <Typography variant="body2">
                <strong>Name:</strong> {formData.name}
              </Typography>
              <Typography variant="body2">
                <strong>Email:</strong> {formData.email}
              </Typography>
              {formData.phone && (
                <Typography variant="body2">
                  <strong>Phone:</strong> {formData.phone}
                </Typography>
              )}
              <Typography variant="body2">
                <strong>Biometric:</strong>{' '}
                {formData.fingerprintData ? '✓ Enrolled' : '✗ Not Enrolled'}
              </Typography>
              <Typography variant="body2">
                <strong>Wallet Balance:</strong> ₹{formData.initialBalance}
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={handleSubmitRegistration}
              disabled={loading}
              fullWidth
              sx={{
                mt: 3,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold',
                bgcolor: '#4caf50',
                '&:hover': { bgcolor: '#45a049' }
              }}
            >
              {loading ? 'Registering...' : 'Complete Registration'}
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        bgcolor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'auto',
        p: 2
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 600,
          width: '100%',
          p: 4,
          borderRadius: 3
        }}
      >
        {/* Back Button */}
        {onBack && (
          <IconButton
            onClick={onBack}
            sx={{ mb: 2 }}
            aria-label="go back"
          >
            <ArrowBackIcon />
          </IconButton>
        )}

        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <PersonAddIcon sx={{ fontSize: 50, color: '#000048', mb: 1 }} />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: '#000048',
              mb: 1
            }}
          >
            User Registration
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create a new account with biometric authentication
          </Typography>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Error/Success Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
            onClose={() => setSuccess('')}
          >
            {success}
          </Alert>
        )}

        {/* Step Content */}
        {renderStepContent(activeStep)}

        {/* Navigation Buttons */}
        {activeStep < 2 && (
          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0 || loading}
              sx={{ flex: 1 }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
              sx={{
                flex: 2,
                bgcolor: '#000048',
                '&:hover': { bgcolor: '#000066' }
              }}
            >
              Next
            </Button>
          </Box>
        )}

        {/* Footer Note */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', textAlign: 'center', mt: 3 }}
        >
          By registering, you agree to SmartPay's Terms of Service
        </Typography>
      </Paper>
    </Box>
  );
};

export default UserRegistration;
