
import React, { useState, useEffect } from 'react';
import {
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Paper
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { proceedToPay } from '../api';

const PaymentConfirmation = ({ user, total, onExit }) => {
  const [processing, setProcessing] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState('');

  // Masking
  const maskEmail = (email) => email ? email.replace(/^(..)(.*)(@.*)$/, "$1***$3") : "your email";
  const maskPhone = (phone) => phone ? `******${phone.slice(-4)}` : "your mobile";

  const totalAmount = typeof total === 'object' ? (total.total || 0) : (total || 0);

  useEffect(() => {
    const handlePayment = async () => {
      try {
        setProcessing(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        const response = await proceedToPay(user.id);
        setPaymentData(response.data);
        setPaymentSuccess(true);
      } catch (err) {
        setError(err?.response?.data?.error || 'Payment Failed. Please try again or contact support.');
      } finally {
        setProcessing(false);
      }
    };
    handlePayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const displayEmail = maskEmail(paymentData?.recipientEmail || user?.email);
  const displayPhone = maskPhone(paymentData?.recipientPhone || user?.phone);
  const resolvedAmount = paymentData?.amount != null ? Number(paymentData.amount) : Number(totalAmount);

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Box sx={{ maxWidth: 600, width: '100%', mx: 'auto' }}>
        {processing && (
          <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 4, boxShadow: 5 }}>
            <CircularProgress size={70} sx={{ color: '#000048', mb: 3 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#000048' }}>Processing Payment...</Typography>
            <Typography variant="body1" sx={{ opacity: 0.7, mt: 1 }}>Please wait while we complete your transaction</Typography>
          </Paper>
        )}

        {paymentSuccess && !processing && (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4, boxShadow: 6 }}>
            <Box sx={{ mb: 3 }}>/logo/ApplicationMainLogo.png</Box>
            <CheckCircleIcon sx={{ fontSize: 90, color: '#4caf50', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#000048', mb: 1 }}>Success!</Typography>

            <Alert severity="success" icon={<MarkEmailReadIcon />} sx={{ my: 2, textAlign: 'left', borderRadius: 2, fontSize: '0.95rem' }}>
              The invoice has been sent to <strong>{displayEmail}</strong> and via SMS to <strong>{displayPhone}</strong>.
              <br />
              <small style={{ opacity: 0.7 }}>
                Email sent: {paymentData?.emailSent ? 'Yes' : 'No'}&nbsp;|&nbsp;
                SMS sent: {paymentData?.smsSent ? 'Yes' : 'No'}
              </small>
            </Alert>

            <Card sx={{ mb: 4, bgcolor: '#fcfcfc', border: '1px solid #eee', textAlign: 'left' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography color="textSecondary">Transaction ID</Typography>
                  <Typography fontWeight="bold">{paymentData?.transactionId || `TXN${Date.now()}`}</Typography>
                </Box>
                <Divider sx={{ mb: 1.5 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="textSecondary">Amount Paid</Typography>
                  <Typography variant="h6" fontWeight="bold" color="#4caf50">₹{Number(resolvedAmount).toFixed(2)}</Typography>
                </Box>
              </CardContent>
            </Card>

            <Button variant="contained" fullWidth onClick={onExit}
              sx={{ py: 2, fontSize: '1.1rem', bgcolor: '#000048', fontWeight: 'bold', borderRadius: 3, '&:hover': { bgcolor: '#000066' } }}>
              Done & New Session
            </Button>

            <Typography variant="body2" sx={{ mt: 3, opacity: 0.6 }}>Thank you for shopping with us!</Typography>
          </Paper>
        )}

        {error && !processing && (
          <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 4 }}>
            <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
            <Button variant="contained" fullWidth onClick={onExit}
              sx={{ bgcolor: '#000048', py: 1.5, fontWeight: 'bold' }}>
              Return to Home
            </Button>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default PaymentConfirmation;

