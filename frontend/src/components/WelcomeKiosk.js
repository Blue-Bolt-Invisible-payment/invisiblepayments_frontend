import React, { useState, useEffect } from 'react';

import {

  // Button,

  Typography,

  Box,

  Alert,

  Link

} from '@mui/material';

// import FingerprintIcon from '@mui/icons-material/Fingerprint';

// import PhonelinkIcon from '@mui/icons-material/Phonelink';

// import LaptopIcon from '@mui/icons-material/Laptop';

// import UsbIcon from '@mui/icons-material/Usb';

import { authenticateUser } from '../api';

import AnimatedFingerprint from './AnimatedFingerprint'; // adjust path

import BG_EFFORT_GIF_URL from '../assets/fingerprint_effort.gif';
 
import {

  detectBiometricCapabilities,

  captureFingerprintUniversal,

  getBiometricStatus

} from '../utils/biometricUtils';
 
const WelcomeKiosk = ({ onLogin, onRegister }) => {

  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  const [showBgEffort, setShowBgEffort] = useState(false);
 
  const [deviceStatus, setDeviceStatus] = useState({

    available: false,

    message: 'Detecting...',

    deviceType: 'None'

  });
 
  // Detect biometric capabilities on mount

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

    try {

      setLoading(true);

      setError('');
 
      if (!deviceStatus.available) {

        throw new Error('not available');

      }
 
      const fingerprintData = await captureFingerprintUniversal();

      const response = await authenticateUser(fingerprintData);
 
      if (response?.data?.enabled) {

        onLogin(response.data);

      } else {

        setError('User account is disabled. Please contact administrator.');

      }

    } catch (err) {

      const msg = err?.message || '';

      if (msg.includes('cancelled')) {

        setError('Fingerprint scan was cancelled. Please try again.');

      } else if (msg.includes('not available')) {

        setError('No fingerprint sensor detected. Please use Test Mode below.');

      } else if (msg.includes('not enrolled') || msg.includes('No credentials')) {

        setError('⚠️ Biometric not enrolled. Backend integration required. Please use Test Mode for now.');

      } else if (msg.includes('not recognized')) {

        setError('Fingerprint not recognized. Please try again or contact support.');

      } else {

        setError(msg || 'Fingerprint authentication failed. Please use Test Mode below.');

      }
 
  } finally {

    setLoading(false);

    setShowBgEffort(false);

  }

};
 
// const getDeviceIcon = () => {

//   const deviceName = deviceStatus.deviceType.toLowerCase();

//   if (deviceName.includes('android') || deviceName.includes('touch id')) {

//     return <PhonelinkIcon sx={{ fontSize: { xs: '0.95rem', sm: '1.05rem' } }} />;

//   } else if (deviceName.includes('windows') || deviceName.includes('laptop')) {

//     return <LaptopIcon sx={{ fontSize: { xs: '0.95rem', sm: '1.05rem' } }} />;

//   } else if (deviceName.includes('external') || deviceName.includes('usb')) {

//     return <UsbIcon sx={{ fontSize: { xs: '0.95rem', sm: '1.05rem' } }} />;

//   }

//   return <FingerprintIcon sx={{ fontSize: { xs: '0.95rem', sm: '1.05rem' } }} />;

// };
 
return (
<Box

    sx={{

      width: '100vw',

      height: '100vh',

      position: 'fixed',

      top: 0,

      left: 0,

      bgcolor: '#f5f7fb', // Light page background

      display: 'flex',

      alignItems: 'center',

      justifyContent: 'center',

      overflow: 'hidden',

      p: { xs: 1, sm: 1.75 }

    }}
>

    {/* Main Card */}
<Box

      sx={{

        maxWidth: { xs: '96%', sm: '85%', md: '680px', lg: '720px' },

        width: '100%',

        bgcolor: 'transparent',

        borderRadius: { xs: 2, sm: 3 },

        p: { xs: 2, sm: 3, md: 3.5 },

        textAlign: 'center',

        position: 'relative'

      }}
>

      {/* Logo */}
<Box sx={{ mb: { xs: 1.25, sm: 4.75 }, display: 'flex', justifyContent: 'center' }}>
<img

          src="/logo/ApplicationMainLogo.png"

          alt="Cognizant SmartPay Logo"

          style={{

            width: '100%',

            maxWidth: '476px',

            height: 'auto',

            objectFit: 'contain',

            display: 'block'

          }}

        />
</Box>
 
      {/* Headline */}
<Typography

        variant="h3"

        sx={{

          fontFamily: 'Gallix, sans-serif',

          color: '#000048', // deep navy

          fontWeight: 600,                       // ↗ match the design

          fontSize: { xs: '1.6rem', sm: '1.8rem', md: '2.5rem' },

          lineHeight: 1.2,

          mb: { xs: 0.75, sm: 1 }               // ↘ slightly closer to subtext

        }}
>

        Welcome to Smartpay
</Typography>
 
      {/* Subtext */}
<Typography

        sx={{

          fontFamily: 'Gallix, sans-serif',

          color: '#000048',

          fontWeight: 400,

          fontSize: { xs: '0.95rem', sm: '1rem', md: '1.3rem' },

          lineHeight: 1.3,

          opacity: 0.85,

          mb: { xs: 2, sm: 2.2 }                // ↘ balanced gap to fingerprint icon

        }}
>

        One touch to begin your shopping experience
</Typography>

 
        {/* Fingerprint Icon - Interactive */}
<Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 1.6, sm: 2.4 } }}>
<Box

            role="button"

            aria-label="Scan fingerprint to sign in"

            tabIndex={0}

            sx={{

width: '66.73782348632812px',

    height: '95.83333587646484px',
 
              borderRadius: '50%',

              bgcolor: 'transparent',

              display: 'flex',

              alignItems: 'center',

              justifyContent: 'center',

              cursor: loading ? 'default' : 'pointer',

              transition: 'all 0.25s ease',

              border: 'none',

              position: 'relative',
 
              '&:focus-visible': {

                outline: '2px solid #1bb0ff',

                outlineOffset: '3px'

              }

            }}

            onClick={() => {

              if (!loading) {

                setShowBgEffort(true);

                handleFingerprintScan();

              }

            }}

            onKeyDown={(e) => {

              if (!loading && (e.key === 'Enter' || e.key === ' ')) {

                e.preventDefault();

                setShowBgEffort(true);

                handleFingerprintScan();

              }

            }}
>

            {/* Background effort animation (shows while scanning) */}

            {(showBgEffort || loading) && (
<Box

                component="img"

                src={BG_EFFORT_GIF_URL}

                alt="Fingerprint scan background animation"

                sx={{

                  position: 'absolute',

                  inset: 0,

                  width: '100%',

                  height: '100%',

                  objectFit: 'cover',

                  borderRadius: '50%',

                  zIndex: 0,

                  pointerEvents: 'none',

                  mixBlendMode: 'screen',

                  opacity: 0.7,

                  '@media (prefers-reduced-motion: reduce)': {

                    display: 'none',

                  }

                }}

                draggable={false}

              />

            )}
 
            {/* Foreground content (animated while loading, static when idle) */}
<Box

              sx={{

                position: 'relative',

                zIndex: 1,

                width: '100%',

                height: '100%',

                display: 'flex',

                alignItems: 'center',

                justifyContent: 'center'

              }}
>
 
      {loading ? (
<AnimatedFingerprint size={50} />

      ) : (
<Box

          component="svg"

          xmlns="http://www.w3.org/2000/svg"

          viewBox="0 0 67 96"

          sx={{

            width: { xs: 50, sm: 60, md: 50 },

            height: 'auto',

            display: 'inline-block'

          }}
>
<path

            d="M54.934 11.8354C54.6373 11.8354 54.3406 11.7396 54.081 11.5479C46.961 6.80417 40.8052 4.79167 33.4256 4.79167C26.0831 4.79167 19.1115 7.04375 12.7702 11.5479C11.8802 12.1708 10.7677 11.7396 10.2485 10.5896C10.0173 10.0292 9.96539 9.37389 10.1041 8.76459C10.2428 8.15528 10.5609 7.64063 10.9902 7.33125C17.8877 2.49167 25.4527 0 33.4256 0C41.3244 0 48.2219 2.25208 55.7869 7.28333C56.714 7.90625 57.0477 9.34375 56.5656 10.4938C56.419 10.8932 56.1881 11.231 55.8994 11.4684C55.6107 11.7057 55.2761 11.833 54.934 11.8354ZM1.86771 36.9917C1.52588 36.9958 1.18985 36.8775 0.896889 36.6499C0.603929 36.4222 0.36549 36.0942 0.208021 35.7022C0.0505523 35.3101 -0.0197916 34.8693 0.00479187 34.4288C0.0293753 33.9882 0.147925 33.5651 0.347292 33.2063C4.01854 26.4979 8.69104 21.2271 14.2535 17.5375C25.8977 9.775 40.8052 9.72708 52.4865 17.4896C58.049 21.1792 62.7215 26.4021 66.3927 33.0625C66.535 33.32 66.6364 33.6114 66.691 33.9198C66.7457 34.2282 66.7525 34.5476 66.7112 34.8594C66.6698 35.1713 66.581 35.4694 66.45 35.7367C66.319 36.004 66.1482 36.2351 65.9477 36.4167C65.0948 37.1833 63.9452 36.9437 63.3519 35.8417C60.1044 29.9018 55.7907 25.0679 50.7806 21.7542C40.1377 14.7104 26.5281 14.7104 15.9223 21.8021C10.879 25.1563 6.65146 29.9479 3.31396 35.9854C3.01729 36.6563 2.46104 36.9917 1.86771 36.9917ZM25.0448 94.8271C24.8016 94.8309 24.5605 94.769 24.337 94.6452C24.1134 94.5214 23.9124 94.3385 23.7469 94.1083C20.5206 89.9396 18.7777 87.2563 16.2931 81.4583C13.7344 75.5646 12.3994 68.3771 12.3994 60.6625C12.3994 46.4313 21.8185 34.8354 33.3885 34.8354C44.9585 34.8354 54.3777 46.4313 54.3777 60.6625C54.3777 62.0042 53.5619 63.0583 52.5235 63.0583C51.4852 63.0583 50.6694 62.0042 50.6694 60.6625C50.6694 49.0667 42.919 39.6271 33.3885 39.6271C23.8581 39.6271 16.1077 49.0667 16.1077 60.6625C16.1077 67.5625 17.2944 73.9354 19.5565 79.1104C21.9298 84.6208 23.5615 86.9688 26.4169 90.7063C27.1215 91.6646 27.1215 93.15 26.4169 94.1083C26.009 94.5875 25.5269 94.8271 25.0448 94.8271ZM51.6335 85.9625C47.2206 85.9625 43.3269 84.525 40.1377 81.6979C34.6123 76.8583 31.3119 69 31.3119 60.6625C31.3119 59.3208 32.1277 58.2667 33.166 58.2667C34.2044 58.2667 35.0202 59.3208 35.0202 60.6625C35.0202 67.4188 37.6902 73.7917 42.2144 77.7208C44.8473 80.0208 47.9252 81.1229 51.6335 81.1229C52.5235 81.1229 54.0069 80.9792 55.4902 80.6438C56.4915 80.4042 57.4556 81.2667 57.641 82.6083C57.8265 83.9021 57.159 85.1479 56.1206 85.3875C54.0069 85.9146 52.1527 85.9625 51.6335 85.9625ZM44.1798 95.8333C44.0315 95.8333 43.846 95.7854 43.6977 95.7375C37.8015 93.6292 33.9448 90.8021 29.9027 85.675C27.3413 82.407 25.3102 78.5115 23.9285 74.2166C22.5467 69.9217 21.842 65.3137 21.8556 60.6625C21.8556 52.9 26.9731 46.575 33.2773 46.575C39.5815 46.575 44.699 52.9 44.699 60.6625C44.699 65.7896 48.1477 69.9583 52.4123 69.9583C56.6769 69.9583 60.1256 65.7896 60.1256 60.6625C60.1256 42.5979 48.0735 27.9354 33.2402 27.9354C22.7085 27.9354 13.0669 35.5063 8.72812 47.2458C7.28187 51.1271 6.54021 55.6792 6.54021 60.6625C6.54021 64.4 6.79979 70.2938 9.02479 77.9604C9.39562 79.2063 8.91354 80.5958 7.94937 81.0271C6.98521 81.5063 5.90979 80.8354 5.57604 79.6375C3.78914 73.5775 2.8718 67.1475 2.86896 60.6625C2.86896 54.9125 3.72187 49.6896 5.39062 45.1375C10.3227 31.7688 21.2623 23.0958 33.2402 23.0958C50.1131 23.0958 63.834 39.9146 63.834 60.6146C63.834 68.3771 58.7164 74.7021 52.4123 74.7021C46.1081 74.7021 40.9906 68.3771 40.9906 60.6146C40.9906 55.4875 37.5419 51.3188 33.2773 51.3188C29.0127 51.3188 25.564 55.4875 25.564 60.6146C25.564 68.8083 28.0115 76.475 32.4985 82.225C36.0215 86.7292 39.396 89.2208 44.6248 91.0896C45.626 91.425 46.1823 92.7667 45.9227 94.0125C45.7373 95.1146 44.9585 95.8333 44.1798 95.8333Z"

            fill="url(#paint0_radial_187_5)"

          />
<defs>
<radialGradient

              id="paint0_radial_187_5"

              cx="0"

              cy="0"

              r="1"

              gradientUnits="userSpaceOnUse"

              gradientTransform="translate(33.3689 47.9167) rotate(90) scale(47.9167 33.3689)"
>
<stop stopColor="#000048" />
<stop offset="0.706731" stopColor="#2BB4D7" />
<stop offset="0.9999" stopColor="#26EFE9" />
</radialGradient>
</defs>
</Box>

      )}
</Box>
</Box>
</Box>
 
        {/* CTA Inline Text (visual only) */}
<Box sx={{ textAlign: 'center', mb: { xs: 1.4, sm: 3.1 } }}>
<Box

            component="span"

            sx={{

              background: 'linear-gradient(93.2deg, #000048 15.93%, #26EFE9 57.44%, #000048 95.53%)',

              WebkitBackgroundClip: 'text',

              WebkitTextFillColor: 'transparent',

              fontFamily: 'Poppins, sans-serif',

              fontWeight: 600,

              fontStyle: 'normal',

              fontSize: { xs: '1.8rem', sm: '2rem', md: '2.25rem' },

              lineHeight: '100%',

              letterSpacing: '-0.03em',

              userSelect: 'none',

              pointerEvents: 'none'

            }}
>

            Scan your fingerprint to start Shopping
</Box>
</Box>
 
        {/* Error Message */}

        {error && (
<Alert

            severity="error"

            sx={{

              mt: { xs: 1, sm: 1.2 },

              fontFamily: 'Gallix, sans-serif',

              fontSize: { xs: '0.82rem', sm: '0.86rem' },

              py: { xs: 0.5, sm: 0.6 }

            }}
>

            {error}
</Alert>

        )}
 
      

{/* Privacy Note */}
<Typography

  sx={{

    mt: { xs: 4, sm: 8 }, // Increased spacing from CTA

    fontFamily: 'Poppins, sans-serif',

    fontWeight: 400, // Regular

    fontSize: '14px',

    lineHeight: '100%',

    letterSpacing: '-0.03em',

    color: 'rgba(151, 153, 155, 1)',

    display: 'inline-block',

  }}
>

  Your fingerprint is verified securely on this device. We never collect or store your biometric data.

  {/* Add space before Privacy Policy link */}
<Box component="span" sx={{ ml: 2 }}>
<Link

      href="#"

      underline="always" // underline always visible

      sx={{

        fontFamily: 'Poppins, sans-serif',

        fontWeight: 600, // SemiBold

        fontSize: '14px',

        lineHeight: '100%',

        letterSpacing: '-0.03em',

        color: 'rgba(47, 120, 196, 1)',

        textDecorationColor: 'rgba(47, 120, 196, 1)',

        textDecorationStyle: 'solid',

        textDecorationThickness: '2px', // px for consistency

        textUnderlineOffset: '4px', // push underline slightly down

        '&:hover': {

          color: 'rgba(47, 120, 196, 1)',

          textDecorationColor: 'rgba(47, 120, 196, 1)',

        },
 
        '&:visited': {

          color: 'rgba(47, 120, 196, 1)',

        },

        '&:focus': { outline: 'none' },

      }}
>

      Privacy Policy
</Link>
</Box>
</Typography>
 
      </Box>
</Box>

  );

};
 
export default WelcomeKiosk;
 