import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

/**
 * Warning banner for inactivity session
 * @param {boolean} show - Whether banner is visible
 * @param {number} warningMs - Countdown duration (default: 5 minutes)
 * @param {function} onExpire - Callback when countdown reaches zero
 */
const SessionWarningBanner = ({ show, warningMs = 30000, onExpire }) => {
  const [remaining, setRemaining] = useState(warningMs);

  useEffect(() => {
    if (!show) return;

    setRemaining(warningMs);
    const interval = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1000) {
          clearInterval(interval);
          onExpire();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [show, warningMs, onExpire]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  if (!show) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        bgcolor: '#000048', // match primary color
        color: 'white',
        px: 2,
        py: 1,
        borderRadius: 1,
        boxShadow: 3,
        zIndex: 1300, // above header but not blocking clicks
      }}
    >
      <Typography variant="body1">
        Session will expire in {formatTime(remaining)}
      </Typography>
    </Box>
  );
};

export default SessionWarningBanner;
