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
import ReceiptIcon from '@mui/icons-material/Receipt';
import { proceedToPay } from '../api';
import jsPDF from 'jspdf';
 
const PaymentConfirmation = ({ user, total, cart, onExit }) => {
  const [processing, setProcessing] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState('');
  const [previousBalance, setPreviousBalance] = useState(0);
  const [newBalance, setNewBalance] = useState(0);

  // Handle total as object or number
  const totalAmount = typeof total === 'object' ? (total.total || 0) : (total || 0);
 
  useEffect(() => {
    // Automatically process payment when component mounts
    handlePayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Runs ONLY ONCE on mount
 
  const handlePayment = async () => {
    try {
      setProcessing(true);
      // Store previous balance before payment
      setPreviousBalance(user.walletBalance || 0);
     
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
     
      // Payments API: proceedToPay() --> Call Wallet Service to deduct the amount
      const response = await proceedToPay(user.id);
      setPaymentData(response.data);
     
      // Set new balance from response
      if (response.data && response.data.newBalance !== undefined) {
        setNewBalance(response.data.newBalance);
      } else {
        // Fallback calculation if backend doesn't return newBalance
        setNewBalance((user.walletBalance || 0) - totalAmount);
      }
     
      setPaymentSuccess(true);
      setProcessing(false);
    } catch (err) {
      setProcessing(false);
      setError('Payment failed. Please try again or contact support.');
    }
  };
 
  const handleDownloadReceipt = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const txnId = `TXN${Date.now()}`;
    const dateTime = new Date().toLocaleString();
   
    let yPos = 20;
   
    // Logo - Load and add to PDF
    const logo = new Image();
    logo.src = '/logo/ApplicationMainLogo.png';
    logo.onload = () => {
      // Add logo centered at top
      const logoWidth = 50;
      const logoHeight = 15;
      doc.addImage(logo, 'PNG', (pageWidth - logoWidth) / 2, yPos, logoWidth, logoHeight);
     
      yPos += logoHeight + 10;
     
      // Header - Company Name
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('COGNIZANT SMARTPAY', pageWidth / 2, yPos, { align: 'center' });
     
      yPos += 8;
     
      // Line separator
      doc.setLineWidth(0.5);
      doc.line(20, yPos, pageWidth - 20, yPos);
     
      yPos += 8;
     
      // Receipt Title
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Payment Receipt', pageWidth / 2, yPos, { align: 'center' });
     
      yPos += 10;
     
      // Transaction Details with better spacing
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
     
      doc.text('Transaction ID:', 20, yPos);
      doc.setFont('helvetica', 'bold');
      doc.text(txnId, 65, yPos);
     
      yPos += 7;
      doc.setFont('helvetica', 'normal');
      doc.text('Date & Time:', 20, yPos);
      doc.setFont('helvetica', 'bold');
      doc.text(dateTime, 65, yPos);
     
      yPos += 7;
      doc.setFont('helvetica', 'normal');
      doc.text('Customer:', 20, yPos);
      doc.setFont('helvetica', 'bold');
      doc.text(user.name, 65, yPos);
     
      yPos += 10;
     
      // Line separator
      doc.setLineWidth(0.3);
      doc.line(20, yPos, pageWidth - 20, yPos);
     
      yPos += 8;
     
      // Items Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('ITEMS:', 20, yPos);
     
      yPos += 7;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
     
      cart.forEach(item => {
        const itemText = `${item.item.name} x${item.quantity}`;
        const itemPrice = `Rs.${(item.item.price * item.quantity).toFixed(2)}`;
        doc.text(itemText, 20, yPos);
        doc.text(itemPrice, pageWidth - 20, yPos, { align: 'right' });
        yPos += 6;
      });
     
      yPos += 3;
     
      // Line separator
      doc.setLineWidth(0.3);
      doc.line(20, yPos, pageWidth - 20, yPos);
     
      yPos += 8;
     
      // Total Amount
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Total Amount:', 20, yPos);
      doc.text(`Rs.${totalAmount.toFixed(2)}`, pageWidth - 20, yPos, { align: 'right' });
     
      yPos += 10;
     
      // Line separator
      doc.setLineWidth(0.3);
      doc.line(20, yPos, pageWidth - 20, yPos);
     
      yPos += 8;
     
      // Wallet Balance Breakdown
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Previous Wallet Balance:', 20, yPos);
      doc.setFont('helvetica', 'bold');
      doc.text(`Rs.${previousBalance.toFixed(2)}`, pageWidth - 20, yPos, { align: 'right' });
     
      yPos += 7;
      doc.setFont('helvetica', 'normal');
      doc.text('Amount Paid:', 20, yPos);
      doc.setTextColor(220, 0, 78); // Red color for deduction
      doc.setFont('helvetica', 'bold');
      doc.text(`- Rs.${total.toFixed(2)}`, pageWidth - 20, yPos, { align: 'right' });
     
      yPos += 7;
      doc.setTextColor(0, 0, 0); // Reset to black
      doc.setFont('helvetica', 'normal');
      doc.text('Current Wallet Balance:', 20, yPos);
      doc.setTextColor(76, 175, 80); // Green color
      doc.setFont('helvetica', 'bold');
      doc.text(`Rs.${newBalance.toFixed(2)}`, pageWidth - 20, yPos, { align: 'right' });
     
      yPos += 10;
     
      // Line separator
      doc.setTextColor(0, 0, 0); // Reset to black
      doc.setLineWidth(0.3);
      doc.line(20, yPos, pageWidth - 20, yPos);
     
      yPos += 8;
     
      // Payment Details
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Payment Method:', 20, yPos);
      doc.setFont('helvetica', 'bold');
      doc.text('Wallet', 65, yPos);
     
      yPos += 7;
      doc.setFont('helvetica', 'normal');
      doc.text('Status:', 20, yPos);
      doc.setTextColor(76, 175, 80); // Green color
      doc.setFont('helvetica', 'bold');
      doc.text('SUCCESS', 65, yPos);
     
      // Footer
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const footerY = doc.internal.pageSize.getHeight() - 25;
     
      // Line separator above footer
      doc.setLineWidth(0.3);
      doc.line(20, footerY - 8, pageWidth - 20, footerY - 8);
     
      doc.text('Thank you for shopping with us!', pageWidth / 2, footerY, { align: 'center' });
      doc.text('Visit us again!', pageWidth / 2, footerY + 5, { align: 'center' });
     
      // Download PDF
      doc.save(`SmartPay_Receipt_${Date.now()}.pdf`);
    };
   
    // If logo fails to load, generate PDF without logo
    logo.onerror = () => {
      yPos = 20;
     
      // Header - Company Name
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('COGNIZANT SMARTPAY', pageWidth / 2, yPos, { align: 'center' });
     
      yPos += 8;
     
      // Line separator
      doc.setLineWidth(0.5);
      doc.line(20, yPos, pageWidth - 20, yPos);
     
      yPos += 8;
     
      // Receipt Title
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Payment Receipt', pageWidth / 2, yPos, { align: 'center' });
     
      yPos += 10;
     
      // Transaction Details
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
     
      doc.text('Transaction ID:', 20, yPos);
      doc.setFont('helvetica', 'bold');
      doc.text(txnId, 65, yPos);
     
      yPos += 7;
      doc.setFont('helvetica', 'normal');
      doc.text('Date & Time:', 20, yPos);
      doc.setFont('helvetica', 'bold');
      doc.text(dateTime, 65, yPos);
     
      yPos += 7;
      doc.setFont('helvetica', 'normal');
      doc.text('Customer:', 20, yPos);
      doc.setFont('helvetica', 'bold');
      doc.text(user.name, 65, yPos);
     
      yPos += 10;
     
      // Line separator
      doc.setLineWidth(0.3);
      doc.line(20, yPos, pageWidth - 20, yPos);
     
      yPos += 8;
     
      // Items Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('ITEMS:', 20, yPos);
     
      yPos += 7;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
     
      cart.forEach(item => {
        const itemText = `${item.item.name} x${item.quantity}`;
        const itemPrice = `Rs.${(item.item.price * item.quantity).toFixed(2)}`;
        doc.text(itemText, 20, yPos);
        doc.text(itemPrice, pageWidth - 20, yPos, { align: 'right' });
        yPos += 6;
      });
     
      yPos += 3;
     
      // Line separator
      doc.setLineWidth(0.3);
      doc.line(20, yPos, pageWidth - 20, yPos);
     
      yPos += 8;
     
      // Total Amount
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Total Amount:', 20, yPos);
      doc.text(`Rs.${totalAmount.toFixed(2)}`, pageWidth - 20, yPos, { align: 'right' });
     
      yPos += 10;
     
      // Line separator
      doc.setLineWidth(0.3);
      doc.line(20, yPos, pageWidth - 20, yPos);
     
      yPos += 8;
     
      // Wallet Balance Breakdown
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Previous Wallet Balance:', 20, yPos);
      doc.setFont('helvetica', 'bold');
      doc.text(`Rs.${previousBalance.toFixed(2)}`, pageWidth - 20, yPos, { align: 'right' });
     
      yPos += 7;
      doc.setFont('helvetica', 'normal');
      doc.text('Amount Paid:', 20, yPos);
      doc.setTextColor(220, 0, 78); // Red color for deduction
      doc.setFont('helvetica', 'bold');
      doc.text(`- Rs.${total.toFixed(2)}`, pageWidth - 20, yPos, { align: 'right' });
     
      yPos += 7;
      doc.setTextColor(0, 0, 0); // Reset to black
      doc.setFont('helvetica', 'normal');
      doc.text('Current Wallet Balance:', 20, yPos);
      doc.setTextColor(76, 175, 80); // Green color
      doc.setFont('helvetica', 'bold');
      doc.text(`Rs.${newBalance.toFixed(2)}`, pageWidth - 20, yPos, { align: 'right' });
     
      yPos += 10;
     
      // Line separator
      doc.setTextColor(0, 0, 0); // Reset to black
      doc.setLineWidth(0.3);
      doc.line(20, yPos, pageWidth - 20, yPos);
     
      yPos += 8;
     
      // Payment Details
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Payment Method:', 20, yPos);
      doc.setFont('helvetica', 'bold');
      doc.text('Wallet', 65, yPos);
     
      yPos += 7;
      doc.setFont('helvetica', 'normal');
      doc.text('Status:', 20, yPos);
      doc.setTextColor(76, 175, 80);
      doc.setFont('helvetica', 'bold');
      doc.text('SUCCESS', 65, yPos);
     
      // Footer
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const footerY = doc.internal.pageSize.getHeight() - 25;
     
      doc.setLineWidth(0.3);
      doc.line(20, footerY - 8, pageWidth - 20, footerY - 8);
     
      doc.text('Thank you for shopping with us!', pageWidth / 2, footerY, { align: 'center' });
      doc.text('Visit us again!', pageWidth / 2, footerY + 5, { align: 'center' });
     
      doc.save(`SmartPay_Receipt_${Date.now()}.pdf`);
    };
  };
 
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box
        sx={{
          maxWidth: { xs: '95%', sm: 600, md: 700, lg: 800 },
          width: '100%',
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 }
        }}
      >
        {/* Processing State */}
        {processing && (
          <Paper
            sx={{
              p: { xs: 2.5, sm: 3.5, md: 4.5, lg: 5 },
              textAlign: 'center',
              borderRadius: { xs: 2, sm: 2.5, md: 3 },
              boxShadow: { xs: 3, sm: 4, md: 5 }
            }}
          >
            <CircularProgress
              sx={{
                width: { xs: '50px !important', sm: '60px !important', md: '70px !important', lg: '80px !important' },
                height: { xs: '50px !important', sm: '60px !important', md: '70px !important', lg: '80px !important' },
                color: '#000048',
                mb: { xs: 2, sm: 2.5, md: 3 }
              }}
            />
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontFamily: 'Gallix, sans-serif',
                color: '#000048',
                fontWeight: 'bold',
                mb: { xs: 1.5, sm: 2 },
                fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem', lg: '1.8rem' }
              }}
            >
              Processing Payment...
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: 'Gallix, sans-serif',
                color: '#000048',
                opacity: 0.7,
                fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem', lg: '1.05rem' }
              }}
            >
              Please wait while we complete your transaction
            </Typography>
          </Paper>
        )}
 
        {/* Success State */}
        {paymentSuccess && !processing && (
          <Paper
            sx={{
              p: { xs: 2.5, sm: 3.5, md: 4, lg: 4.5 },
              borderRadius: { xs: 2, sm: 2.5, md: 3 },
              boxShadow: { xs: 3, sm: 4, md: 5 }
            }}
          >
            {/* Logo */}
            <Box sx={{ textAlign: 'center', mb: { xs: 2, sm: 2.5, md: 3 } }}>
              <Box
                component="img"
                src="/logo/ApplicationMainLogo.png"
                alt="Cognizant SmartPay Logo"
                sx={{
                  width: '100%',
                  maxWidth: { xs: '180px', sm: '220px', md: '260px', lg: '280px' },
                  height: 'auto',
                  objectFit: 'contain',
                  backgroundColor: 'transparent',
                  mixBlendMode: 'multiply'
                }}
              />
            </Box>
 
            {/* Success Icon */}
            <Box sx={{ textAlign: 'center', mb: { xs: 2, sm: 2.5, md: 3 } }}>
              <CheckCircleIcon
                sx={{
                  fontSize: { xs: 60, sm: 75, md: 90, lg: 100 },
                  color: '#4caf50'
                }}
              />
            </Box>
 
            {/* Success Message */}
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontFamily: 'Gallix, sans-serif',
                color: '#000048',
                fontWeight: 'bold',
                textAlign: 'center',
                mb: { xs: 1.5, sm: 2 },
                fontSize: { xs: '1.4rem', sm: '1.7rem', md: '2rem', lg: '2.2rem' }
              }}
            >
              Payment Successful!
            </Typography>
 
            <Typography
              variant="body1"
              sx={{
                fontFamily: 'Gallix, sans-serif',
                color: '#000048',
                textAlign: 'center',
                mb: { xs: 3, sm: 3.5, md: 4 },
                opacity: 0.8,
                fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem', lg: '1.05rem' }
              }}
            >
              Thank you for shopping with us!
            </Typography>
 
            <Divider sx={{ mb: { xs: 2, sm: 2.5, md: 3 } }} />
 
            {/* Receipt Details */}
            <Card sx={{
              mb: { xs: 2, sm: 2.5, md: 3 },
              bgcolor: '#f5f5f5',
              borderRadius: { xs: 1.5, sm: 2 }
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontFamily: 'Gallix, sans-serif',
                    color: '#000048',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 0.5, sm: 1 },
                    fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' }
                  }}
                >
                  <ReceiptIcon sx={{ fontSize: { xs: 20, sm: 24 } }} /> Payment Receipt
                </Typography>
                <Divider sx={{ my: { xs: 1.5, sm: 2 } }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: { xs: 0.8, sm: 1 }, gap: 1 }}>
                  <Typography sx={{ fontFamily: 'Gallix, sans-serif', color: '#000048', fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
                    Transaction ID:
                  </Typography>
                  <Typography sx={{ fontFamily: 'Gallix, sans-serif', color: '#000048', fontWeight: 'bold', fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
                    TXN{Date.now()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: { xs: 0.8, sm: 1 }, gap: 1 }}>
                  <Typography sx={{ fontFamily: 'Gallix, sans-serif', color: '#000048', fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
                    Date & Time:
                  </Typography>
                  <Typography sx={{ fontFamily: 'Gallix, sans-serif', color: '#000048', fontWeight: 'bold', fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
                    {new Date().toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: { xs: 0.8, sm: 1 }, gap: 1 }}>
                  <Typography sx={{ fontFamily: 'Gallix, sans-serif', color: '#000048', fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
                    Customer:
                  </Typography>
                  <Typography sx={{ fontFamily: 'Gallix, sans-serif', color: '#000048', fontWeight: 'bold', fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
                    {user.name}
                  </Typography>
                </Box>
                <Divider sx={{ my: { xs: 1.5, sm: 2 } }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                  <Typography variant="h6" sx={{ fontFamily: 'Gallix, sans-serif', color: '#000048', fontWeight: 'bold', fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' } }}>
                    Total Amount:
                  </Typography>
                  <Typography variant="h6" sx={{ fontFamily: 'Gallix, sans-serif', color: '#4caf50', fontWeight: 'bold', fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' } }}>
                    ₹{totalAmount.toFixed(2)}
                  </Typography>
                </Box>
                <Divider sx={{ my: { xs: 1.5, sm: 2 } }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: { xs: 0.8, sm: 1 }, gap: 1 }}>
                  <Typography sx={{ fontFamily: 'Gallix, sans-serif', color: '#000048', fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
                    Previous Wallet Balance:
                  </Typography>
                  <Typography sx={{ fontFamily: 'Gallix, sans-serif', color: '#000048', fontWeight: 'bold', fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
                    ₹{previousBalance.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: { xs: 0.8, sm: 1 }, gap: 1 }}>
                  <Typography sx={{ fontFamily: 'Gallix, sans-serif', color: '#000048', fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
                    Amount Paid:
                  </Typography>
                  <Typography sx={{ fontFamily: 'Gallix, sans-serif', color: '#dc004e', fontWeight: 'bold', fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
                    - ₹{totalAmount.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: { xs: 0.8, sm: 1 }, gap: 1 }}>
                  <Typography sx={{ fontFamily: 'Gallix, sans-serif', color: '#000048', fontWeight: 'bold', fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
                    Current Wallet Balance:
                  </Typography>
                  <Typography sx={{ fontFamily: 'Gallix, sans-serif', color: '#4caf50', fontWeight: 'bold', fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
                    ₹{newBalance.toFixed(2)}
                  </Typography>
                </Box>
                <Divider sx={{ my: { xs: 1.5, sm: 2 } }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: { xs: 0.8, sm: 1 }, gap: 1 }}>
                  <Typography sx={{ fontFamily: 'Gallix, sans-serif', color: '#000048', fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
                    Payment Method:
                  </Typography>
                  <Typography sx={{ fontFamily: 'Gallix, sans-serif', color: '#000048', fontWeight: 'bold', fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
                    Wallet
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: { xs: 0.8, sm: 1 }, gap: 1 }}>
                  <Typography sx={{ fontFamily: 'Gallix, sans-serif', color: '#000048', fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
                    Status:
                  </Typography>
                  <Typography sx={{ fontFamily: 'Gallix, sans-serif', color: '#4caf50', fontWeight: 'bold', fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
                    SUCCESS
                  </Typography>
                </Box>
              </CardContent>
            </Card>
 
            {/* Action Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
              <Button
                variant="outlined"
                startIcon={<ReceiptIcon sx={{ fontSize: { xs: 18, sm: 20, md: 24 } }} />}
                onClick={handleDownloadReceipt}
                fullWidth
                sx={{
                  py: { xs: 1.2, sm: 1.5, md: 2 },
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                  fontFamily: 'Gallix, sans-serif',
                  fontWeight: 'bold',
                  borderColor: '#000048',
                  color: '#000048',
                  borderRadius: { xs: 1.5, sm: 2 },
                  '&:hover': {
                    borderColor: '#000066',
                    bgcolor: 'rgba(0, 0, 72, 0.04)'
                  }
                }}
              >
                Download Receipt
              </Button>
              <Button
                variant="contained"
                onClick={onExit}
                fullWidth
                sx={{
                  py: { xs: 1.2, sm: 1.5, md: 2 },
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                  fontFamily: 'Gallix, sans-serif',
                  fontWeight: 'bold',
                  bgcolor: '#000048',
                  borderRadius: { xs: 1.5, sm: 2 },
                  '&:hover': {
                    bgcolor: '#000066'
                  }
                }}
              >
                Exit & Start New Session
              </Button>
            </Box>
 
            {/* Thank You Message */}
            <Typography
              variant="body2"
              sx={{
                mt: { xs: 3, sm: 3.5, md: 4 },
                textAlign: 'center',
                fontFamily: 'Gallix, sans-serif',
                color: '#000048',
                opacity: 0.7,
                fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.875rem' }
              }}
            >
              Thank you for shopping with us. Visit us again!
            </Typography>
          </Paper>
        )}
 
        {/* Error State */}
        {error && !processing && (
          <Paper
            sx={{
              p: { xs: 2.5, sm: 3.5, md: 4 },
              borderRadius: { xs: 2, sm: 2.5, md: 3 },
              boxShadow: { xs: 3, sm: 4 }
            }}
          >
            <Alert
              severity="error"
              sx={{
                mb: { xs: 2, sm: 2.5, md: 3 },
                fontFamily: 'Gallix, sans-serif',
                fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' }
              }}
            >
              {error}
            </Alert>
            <Button
              variant="contained"
              onClick={onExit}
              fullWidth
              sx={{
                py: { xs: 1.2, sm: 1.5, md: 2 },
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                fontFamily: 'Gallix, sans-serif',
                fontWeight: 'bold',
                bgcolor: '#000048',
                borderRadius: { xs: 1.5, sm: 2 },
                '&:hover': {
                  bgcolor: '#000066'
                }
              }}
            >
              Return to Home
            </Button>
          </Paper>
        )}
      </Box>
    </Box>
  );
};
 
export default PaymentConfirmation;