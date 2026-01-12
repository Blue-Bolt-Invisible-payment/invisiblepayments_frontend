import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import CloseIcon from '@mui/icons-material/Close';
import { proceedToPay } from '../api';
import PaymentFailed from './PaymentFailed';

const PaymentConfirmation = ({ user, total, onExit }) => {
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState('');

  // We use useCallback to ensure the function reference is stable for the Retry button
  const handlePayment = useCallback(async () => {
    try {
      setError('');
      setProcessing(true);
      setPaymentSuccess(false);
      
      // Artificial delay for UX
      // await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await proceedToPay(user.id);
      
      if (response.data) {
        setPaymentSuccess(true);
      }
    } catch (err) {
      setError(err?.response?.data?.error || 'Payment Failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  }, [user.id]);

  // Initial call on mount
  useEffect(() => {
    handlePayment();
  }, [handlePayment]);

  return (
    <Box sx={{ position: 'relative', zIndex: 1400 }}>
      {/* 1. LOADING OVERLAY */}
      {/* {processing && (
        <Box sx={{ position: 'fixed', inset: 0, bgcolor: 'rgba(0,0,0,0.6)', zIndex: 1500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 4, minWidth: 360 }}>
            <CircularProgress size={70} sx={{ color: '#000048', mb: 3 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Processing Payment...</Typography>
          </Paper>
        </Box>
      )} */}

      {/* 2. SUCCESS OVERLAY */}
      {paymentSuccess && (
        <Box sx={{ position: 'fixed', inset: 0, bgcolor: 'rgba(0,0,0,0.45)', zIndex: 1600, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ width: 766, height: 350, bgcolor: '#FFFFFF', borderRadius: '8px', p: 3, border: '1px solid #000048' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <ThumbUpAltIcon sx={{ color: '#000048' }} />
                    <Typography variant="h5">Payment Successful</Typography>
                </Box>
                <IconButton onClick={onExit}><CloseIcon /></IconButton>
            </Box>
            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <CheckCircleIcon sx={{ color: '#2DB81F', fontSize: 80, mb: 2 }} />
                <Typography variant="h6">Thank you for shopping with us!</Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* 3. FAILED MODAL (The Retry Logic) */}
      {error && (
        <PaymentFailed 
          open={Boolean(error)} 
          onClose={() => setError('')} 
          onRetry={handlePayment} // This triggers the handlePayment function again
        />
      )}
    </Box>
  );
};

export default PaymentConfirmation;