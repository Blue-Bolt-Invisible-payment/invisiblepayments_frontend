import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, Paper, Typography, Slide } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GetAppIcon from '@mui/icons-material/GetApp';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';

/**
 * InstallPrompt Component
 * Shows a popup banner prompting users to install the PWA
 * Appears automatically on first visit or when app is installable
 */
const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Check if user has already dismissed the prompt
    const promptDismissed = localStorage.getItem('installPromptDismissed');
    const alreadyInstalled = localStorage.getItem('appInstalled');

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the default browser install prompt
      e.preventDefault();
      
      // Save the event for later use
      setDeferredPrompt(e);
      
      // Show our custom install prompt if not dismissed before
      if (!promptDismissed && !alreadyInstalled) {
        setTimeout(() => {
          setShowPrompt(true);
        }, 1000); // Show after 3 seconds
      }
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      localStorage.setItem('appInstalled', 'true');
      setShowPrompt(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      localStorage.setItem('appInstalled', 'true');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback: Show manual install instructions
      alert('To install:\n\n' +
        'Chrome/Edge: Click the install icon (⊕) in the address bar\n' +
        'Safari (iOS): Tap Share → Add to Home Screen\n' +
        'Android: Tap menu → Install App'
      );
      return;
    }

    // Show the browser's install prompt
    deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      localStorage.setItem('appInstalled', 'true');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('installPromptDismissed', 'true');
    
    // Show again after 7 days
    setTimeout(() => {
      localStorage.removeItem('installPromptDismissed');
    }, 7 * 24 * 60 * 60 * 1000);
  };

  if (!showPrompt) return null;

  return (
    <Slide direction="up" in={showPrompt} mountOnEnter unmountOnExit>
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: { xs: 0, sm: 16, md: 20 },
          left: { xs: 0, sm: '50%' },
          right: { xs: 0, sm: 'auto' },
          transform: { xs: 'none', sm: 'translateX(-50%)' },
          width: { xs: '100%', sm: '85%', md: '480px', lg: '500px' },
          maxWidth: '100%',
          bgcolor: 'white',
          zIndex: 9999,
          borderRadius: { xs: '16px 16px 0 0', sm: '16px' },
          boxShadow: '0 -4px 20px rgba(0, 0, 72, 0.3)',
          overflow: 'hidden'
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={handleDismiss}
          sx={{
            position: 'absolute',
            top: { xs: 6, sm: 8 },
            right: { xs: 6, sm: 8 },
            color: 'gray',
            zIndex: 1,
            padding: { xs: '6px', sm: '8px' }
          }}
        >
          <CloseIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.5rem' } }} />
        </IconButton>

        {/* Content */}
        <Box
          sx={{
            p: { xs: 2, sm: 2.5, md: 3 },
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 1.5, sm: 2 }
          }}
        >
          {/* Icon and Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pr: 4 }}>
            <Box
              component="img"
              src="/logo/ApplicationMainLogo1.png"
              alt="Cognizant SmartPay"
              sx={{
                width: { xs: 50, sm: 60, md: 70 },
                height: { xs: 50, sm: 60, md: 70 },
                objectFit: 'contain',
                flexShrink: 0
              }}
            />
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: '#000048',
                  fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' }
                }}
              >
                Install Cognizant SmartPay
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' }
                }}
              >
                Add to your device for faster access
              </Typography>
            </Box>
          </Box>

          {/* Features */}
          <Box sx={{ pl: { xs: 0, sm: 1 } }}>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '0.85rem', sm: '0.9rem' },
                lineHeight: 1.6
              }}
            >
              ✓ Instant access from home screen{'\n'}
              ✓ Faster load times and smoother experience{'\n'}
              ✓ Seamless checkout with RFID technology{'\n'}
              ✓ Direct installation - no app store needed
            </Typography>
          </Box>

          {/* Install Button */}
          <Button
            variant="contained"
            onClick={handleInstallClick}
            startIcon={<GetAppIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem' } }} />}
            sx={{
              bgcolor: '#000048',
              color: 'white',
              py: { xs: 1.2, sm: 1.4, md: 1.5 },
              px: { xs: 2, sm: 2.5, md: 3 },
              fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
              fontWeight: 'bold',
              borderRadius: '8px',
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#000066'
              }
            }}
          >
            Install App
          </Button>

          {/* Dismiss Link */}
          <Button
            onClick={handleDismiss}
            sx={{
              color: 'text.secondary',
              fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
              textTransform: 'none',
              py: { xs: 0.5, sm: 0.75 },
              '&:hover': {
                bgcolor: 'transparent',
                textDecoration: 'underline'
              }
            }}
          >
            Maybe later
          </Button>
        </Box>
      </Paper>
    </Slide>
  );
};

export default InstallPrompt;
