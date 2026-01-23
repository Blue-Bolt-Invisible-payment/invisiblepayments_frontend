import React, { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress, IconButton } from '@mui/material';
import { authenticateUser } from '../api';
import {
  detectBiometricCapabilities,
  captureFingerprintUniversal,
  getBiometricStatus
} from '../utils/biometricUtils';
 
const PaymentScan = ({ onAuthorized, onClose }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState({ available: false, message: 'Detecting...', deviceType: 'None' });
 
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
    setError('');
    try {
      setLoading(true);
      if (!deviceStatus.available) {
        setLoading(false);
        setError('No fingerprint sensor detected. Please use an alternate payment method.');
        return;
      }
 
      const fingerprintData = await captureFingerprintUniversal();
      const response = await authenticateUser(fingerprintData);
 
      if (response.data && response.data.enabled) {
        onAuthorized && onAuthorized(response.data);
      } else {
        setError('Payment authorization failed or account disabled. Please contact support.');
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      const msg = err && err.message ? err.message.toLowerCase() : '';
      if (msg.includes('cancelled')) setError('Fingerprint scan was cancelled. Please try again.');
      else if (msg.includes('not available')) setError('No fingerprint sensor detected. Please use an alternate payment method.');
      else if (msg.includes('not enrolled') || msg.includes('no credentials')) setError('Biometric not enrolled on this device. Please use an alternate payment method.');
      else if (msg.includes('not recognized')) setError('Fingerprint not recognized. Please try again.');
      else setError(err.message || 'Payment authorization failed. Please try another payment method.');
    }
  };
 
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1400,
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.45)'
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 766,
          minHeight: 324,
          bgcolor: '#FFFFFF',
          borderRadius: '8px',
          p: { xs: 2, md: 3 },
          boxShadow: 6,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Header row */}
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1.5, gap: '12px' }}>
          <Box sx={{ width: 40, height: 40, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" role="img">
              <defs>
                <radialGradient id="paint0_radial_214_765" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(11.5 12) rotate(90) scale(12 11.5)">
                  <stop offset="0.173077" stopColor="white" />
                </radialGradient>
              </defs>
              <circle cx="20" cy="20" r="20" fill="#000048" />
              <g transform="translate(8.5,8) scale(1.0)">
                <path d="M4.06799 2.964C4.17023 2.964 4.27247 2.94 4.36193 2.892C6.81572 1.704 8.93721 1.2 11.4805 1.2C14.0109 1.2 16.4136 1.764 18.599 2.892C18.9057 3.048 19.2891 2.94 19.468 2.652C19.5477 2.51166 19.5656 2.34755 19.5178 2.19496C19.47 2.04237 19.3604 1.91348 19.2124 1.836C16.8353 0.624 14.2282 0 11.4805 0C8.75829 0 6.38119 0.564 3.77405 1.824C3.45455 1.98 3.33953 2.34 3.50567 2.628C3.5562 2.72803 3.63579 2.81264 3.73527 2.87208C3.83475 2.93152 3.95008 2.96338 4.06799 2.964ZM22.3563 9.264C22.4741 9.26503 22.5899 9.2354 22.6909 9.1784C22.7919 9.12139 22.874 9.03924 22.9283 8.94106C22.9826 8.84288 23.0068 8.7325 22.9983 8.62216C22.9899 8.51183 22.949 8.40586 22.8803 8.316C21.6151 6.636 20.0048 5.316 18.0878 4.392C14.0748 2.448 8.93721 2.436 4.91148 4.38C2.99446 5.304 1.38417 6.612 0.118938 8.28C0.0699043 8.34449 0.0349598 8.41746 0.0161228 8.4947C-0.00271606 8.57193 -0.00507355 8.65191 0.00918579 8.73001C0.0234432 8.80811 0.0540352 8.88278 0.0991955 8.94972C0.144356 9.01665 0.203188 9.07453 0.272299 9.12C0.56624 9.312 0.962425 9.252 1.16691 8.976C2.2861 7.48845 3.77272 6.27788 5.49936 5.448C9.16726 3.684 13.8576 3.684 17.5127 5.46C19.2508 6.3 20.7077 7.5 21.8579 9.012C21.9601 9.18 22.1518 9.264 22.3563 9.264ZM14.3688 23.748C14.4526 23.749 14.5357 23.7334 14.6127 23.7024C14.6897 23.6714 14.759 23.6256 14.8161 23.568C15.9279 22.524 16.5286 21.852 17.3849 20.4C18.2667 18.924 18.7268 17.124 18.7268 15.192C18.7268 11.628 15.4806 8.724 11.4932 8.724C7.50584 8.724 4.2597 11.628 4.2597 15.192C4.2597 15.528 4.54086 15.792 4.8987 15.792C5.25654 15.792 5.5377 15.528 5.5377 15.192C5.5377 12.288 8.20875 9.924 11.4932 9.924C14.7777 9.924 17.4488 12.288 17.4488 15.192C17.4488 16.92 17.0398 18.516 16.2602 19.812C15.4423 21.192 14.88 21.78 13.8959 22.716C13.6531 22.956 13.6531 23.328 13.8959 23.568C14.0365 23.688 14.2026 23.748 14.3688 23.748ZM5.20542 21.528C6.72626 21.528 8.06817 21.168 9.16726 20.46C11.0715 19.248 12.2089 17.28 12.2089 15.192C12.2089 14.856 11.9278 14.592 11.5699 14.592C11.2121 14.592 10.9309 14.856 10.9309 15.192C10.9309 16.884 10.0107 18.48 8.45157 19.464C7.54418 20.04 6.48343 20.316 5.20542 20.316C4.8987 20.316 4.3875 20.28 3.87629 20.196C3.53123 20.136 3.19894 20.352 3.13504 20.688C3.07114 21.012 3.30119 21.324 3.65903 21.384C4.3875 21.516 5.0265 21.528 5.20542 21.528ZM7.77422 24C7.82535 24 7.88925 23.988 7.94037 23.976C9.9724 23.448 11.3015 22.74 12.6946 21.456C13.5773 20.6376 14.2773 19.662 14.7535 18.5864C15.2297 17.5108 15.4725 16.3568 15.4678 15.192C15.4678 13.248 13.7042 11.664 11.5316 11.664C9.35896 11.664 7.5953 13.248 7.5953 15.192C7.5953 16.476 6.40675 17.52 4.93704 17.52C3.46733 17.52 2.27878 16.476 2.27878 15.192C2.27878 10.668 6.43231 6.996 11.5444 6.996C15.1739 6.996 18.4967 8.892 19.992 11.832C20.4904 12.804 20.746 13.944 20.746 15.192C20.746 16.128 20.6566 17.604 19.8898 19.524C19.762 19.836 19.9281 20.184 20.2604 20.292C20.5927 20.412 20.9633 20.244 21.0783 19.944C21.6941 18.4264 22.0103 16.8161 22.0113 15.192C22.0113 13.752 21.7173 12.444 21.1422 11.304C19.4425 7.956 15.6723 5.784 11.5444 5.784C5.72941 5.784 1.00077 9.996 1.00077 15.18C1.00077 17.124 2.76442 18.708 4.93704 18.708C7.10966 18.708 8.87331 17.124 8.87331 15.18C8.87331 13.896 10.0619 12.852 11.5316 12.852C13.0013 12.852 14.1898 13.896 14.1898 15.18C14.1898 17.232 13.3464 19.152 11.8 20.592C10.5858 21.72 9.42286 22.344 7.62086 22.812C7.2758 22.896 7.0841 23.232 7.17356 23.544C7.23746 23.82 7.50584 24 7.77422 24Z" fill="url(#paint0_radial_214_765)"/>
              </g>
            </svg>
          </Box>
 
          <Box sx={{ flexGrow: 1 }}>
            <Typography sx={{
                fontFamily: 'Gallix, sans-serif',
                fontWeight: 500,
                fontSize: { xs: '20px', md: '24px' },
                lineHeight: '1.2',
                letterSpacing: '-3%',
                color: '#000048'
              }}>
              Payment Authentication
            </Typography>
          </Box>
 
          <IconButton onClick={() => onClose && onClose()} sx={{ width: 32, height: 32, color: '#000048' }} size="small">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.113 8.99872L17.5567 2.56902C17.8389 2.2868 17.9974 1.90402 17.9974 1.5049C17.9974 1.10577 17.8389 0.722997 17.5567 0.440774C17.2745 0.158551 16.8918 0 16.4928 0C16.0937 0 15.711 0.158551 15.4288 0.440774L9 6.88546L2.57121 0.440774C2.28903 0.158551 1.90631 -2.9737e-09 1.50724 0C1.10817 2.9737e-09 0.725452 0.158551 0.443269 0.440774C0.161086 0.722997 0.00255743 1.10577 0.00255743 1.5049C0.00255743 1.90402 0.161086 2.2868 0.443269 2.56902L6.88704 8.99872L0.443269 15.4284C0.302812 15.5678 0.191329 15.7335 0.115249 15.9162C0.0391699 16.0988 0 16.2947 0 16.4925C0 16.6904 0.0391699 16.8863 0.115249 17.0689C0.191329 17.2516 0.302812 17.4173 0.443269 17.5567C0.582579 17.6971 0.74832 17.8086 0.930933 17.8847C1.11355 17.9608 1.30941 18 1.50724 18C1.70507 18 1.90094 17.9608 2.08355 17.8847C2.26616 17.8086 2.4319 17.6971 2.57121 17.5567L9 11.112L15.4288 17.5567C15.5681 17.6971 15.7338 17.8086 15.9165 17.8847C16.0991 17.9608 16.2949 18 16.4928 18C16.6906 18 16.8865 17.9608 17.0691 17.8847C17.2517 17.8086 17.4174 17.6971 17.5567 17.5567C17.6972 17.4173 17.8087 17.2516 17.8848 17.0689C17.9608 16.8863 18 16.6904 18 16.4925C18 16.2947 17.9608 16.0988 17.8848 15.9162C17.8087 15.7335 17.6972 15.5678 17.5567 15.4284L11.113 8.99872Z" fill="#000048"/>
            </svg>
          </IconButton>
        </Box>
 
        {/* Divider line */}
        <Box sx={{ width: '100%', height: '1.5px', bgcolor: '#000048' }} />
 
        {/* Updated Content area with tighter spacing */}
        <Box sx={{
            width: '100%',
            mt: { xs: 3, md: 4 }, // Reduced top margin from line
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: { xs: 3, md: 5 } // Reduced gap between text and fingerprint
          }}>
         
          {/* instruction text */}
          <Box sx={{ width: '100%', textAlign: 'center' }}>
            <Typography sx={{
                fontFamily: 'Gallix, sans-serif',
                fontWeight: 400,
                fontSize: { xs: '15px', md: '18px' },
                lineHeight: '1.4',
                color: error ? 'error.main' : '#000048'
              }}>
              {error ? error : "Place your finger to authenticate and complete payment instantly."}
            </Typography>
          </Box>
 
          {/* fingerprint animation area */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Box
              onClick={!loading ? handleFingerprintScan : undefined}
              sx={{
                width: 64,
                height: 92,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                cursor: loading ? 'default' : 'pointer'
              }}
            >
              <Box sx={{ position: 'absolute', width: 64, height: 92, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{
                  position: 'absolute', width: 64, height: 64, borderRadius: '50%',
                  boxSizing: 'border-box', border: '3px solid rgba(38,239,233,0.18)',
                  animation: 'ripple 2000ms infinite'
                }} />
              </Box>
 
              {loading ? (
                <CircularProgress sx={{ color: '#06a7cf' }} />
              ) : (
                <svg width="64" height="92" viewBox="0 0 64 92" xmlns="http://www.w3.org/2000/svg" role="img">
                  <defs>
                    <radialGradient id="paint0_radial_214_771" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(32 46) rotate(90) scale(46 32)">
                      <stop offset="0" stopColor="#000048" />
                      <stop offset="0.706731" stopColor="#2BB4D7" />
                      <stop offset="0.9999" stopColor="#26EFE9" />
                    </radialGradient>
                  </defs>
                  <path d="M52.6804 11.362C52.3959 11.362 52.1114 11.27 51.8624 11.086C45.0345 6.532 39.1312 4.6 32.0544 4.6C25.0131 4.6 18.3274 6.762 12.2463 11.086C11.3928 11.684 10.326 11.27 9.82811 10.166C9.60632 9.62801 9.55658 8.99893 9.68958 8.414C9.82258 7.82907 10.1277 7.335 10.5394 7.038C17.1539 2.392 24.4085 0 32.0544 0C39.6291 0 46.2436 2.162 53.4983 6.992C54.3873 7.59 54.7074 8.97 54.2451 10.074C54.1045 10.4575 53.883 10.7818 53.6062 11.0096C53.3294 11.2375 53.0085 11.3596 52.6804 11.362ZM1.79109 35.512C1.46328 35.516 1.14104 35.4024 0.860095 35.1839C0.579153 34.9653 0.350496 34.6504 0.199487 34.2741C0.0484785 33.8977 -0.0189796 33.4746 0.00459529 33.0516C0.0281702 32.6287 0.141857 32.2225 0.333045 31.878C3.85369 25.438 8.33451 20.378 13.6688 16.836C24.8353 9.384 39.1312 9.338 50.3333 16.79C55.6676 20.332 60.1484 25.346 63.669 31.74C63.8055 31.9872 63.9027 32.2669 63.9551 32.563C64.0076 32.8591 64.0141 33.1657 63.9744 33.465C63.9348 33.7644 63.8496 34.0507 63.724 34.3072C63.5983 34.5638 63.4346 34.7857 63.2423 34.96C62.4244 35.696 61.3219 35.466 60.753 34.408C57.6387 28.7057 53.502 24.0652 48.6974 20.884C38.4911 14.122 25.4398 14.122 15.2691 20.93C10.4327 24.15 6.37859 28.75 3.17801 34.546C2.89351 35.19 2.36008 35.512 1.79109 35.512ZM24.0174 91.034C23.7842 91.0377 23.5529 90.9782 23.3386 90.8594C23.1242 90.7405 22.9315 90.565 22.7727 90.344C19.6788 86.342 18.0074 83.766 15.6247 78.2C13.1709 72.542 11.8907 65.642 11.8907 58.236C11.8907 44.574 20.9235 33.442 32.0188 33.442C43.1142 33.442 52.1469 44.574 52.1469 58.236C52.1469 59.524 51.3646 60.536 50.3688 60.536C49.3731 60.536 48.5907 59.524 48.5907 58.236C48.5907 47.104 41.1583 38.042 32.0188 38.042C22.8794 38.042 15.4469 47.104 15.4469 58.236C15.4469 64.86 16.5849 70.978 18.7542 75.946C21.0302 81.236 22.5949 83.49 25.3332 87.078C26.0088 87.998 26.0088 89.424 25.3332 90.344C24.942 90.804 24.4797 91.034 24.0174 91.034ZM49.5153 82.524C45.2835 82.524 41.5494 81.144 38.4911 78.43C33.1924 73.784 30.0273 66.24 30.0273 58.236C30.0273 56.948 30.8097 55.936 31.8054 55.936C32.8012 55.936 33.5835 56.948 33.5835 58.236C33.5835 64.722 36.144 70.84 40.4826 74.612C43.0075 76.82 45.9591 77.878 49.5153 77.878C50.3688 77.878 51.7913 77.74 53.2138 77.418C54.174 77.188 55.0986 78.016 55.2764 79.304C55.4542 80.546 54.8141 81.742 53.8184 81.972C51.7913 82.478 50.0132 82.524 49.5153 82.524ZM42.3674 92C42.2251 92 42.0473 91.954 41.9051 91.908C36.2507 89.884 32.5523 87.17 28.676 82.248C26.2197 79.1107 24.2719 75.371 22.9468 71.2479C21.6217 67.1248 20.946 62.7011 20.959 58.236C20.959 50.784 25.8666 44.712 31.9121 44.712C37.9577 44.712 42.8652 50.784 42.8652 58.236C42.8652 63.158 46.1725 67.16 50.2621 67.16C54.3518 67.16 57.6591 63.158 57.6591 58.236C57.6591 40.894 46.1014 26.818 31.8766 26.818C21.777 26.818 12.5308 34.086 8.37007 45.356C6.98315 49.082 6.27191 53.452 6.27191 58.236C6.27191 61.824 6.52084 67.482 8.65456 74.842C9.01018 76.038 8.54788 77.372 7.62326 77.786C6.69865 78.246 5.66735 77.602 5.34729 76.452C3.6337 70.6344 2.75399 64.4616 2.75126 58.236C2.75126 52.716 3.56919 47.702 5.16948 43.332C9.89923 30.498 20.39 22.172 31.8766 22.172C48.0573 22.172 61.2153 38.318 61.2153 58.19C61.2153 65.642 56.3077 71.714 50.2621 71.714C44.2166 71.714 39.309 65.642 39.309 58.19C39.309 53.268 36.0018 49.266 31.9121 49.266C27.8225 49.266 24.5152 53.268 24.5152 58.19C24.5152 66.056 26.8623 73.416 31.1653 78.936C34.5437 83.26 37.7799 85.652 42.7941 87.446C43.7543 87.768 44.2877 89.056 44.0388 90.252C43.861 91.31 43.1142 92 42.3674 92Z" fill="url(#paint0_radial_214_771)"/>
                </svg>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
 
export default PaymentScan;