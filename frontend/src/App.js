import React, { useState, useCallback, useMemo } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import WelcomeKiosk from './components/WelcomeKiosk';
import WalletDisplay from './components/WalletDisplay';
import ShoppingHandheld from './components/ShoppingHandheld';
import CartReview from './components/CartReview';
import PaymentConfirmation from './components/PaymentConfirmation';
import InstallPrompt from './components/InstallPrompt';
import { disableTestMode } from './api';

function App() {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  // Create theme once and memoize it
  const theme = useMemo(() => createTheme({
    palette: {
      primary: {
        main: '#000048',
      },
      secondary: {
        main: '#dc004e',
      },
    },
    typography: {
      fontFamily: 'Gallix, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
  }), []);

  const handleLogin = useCallback((loggedUser) => {
    setUser(loggedUser);
    setCurrentStep('wallet');
  }, []);

  const handleContinueShopping = useCallback(() => {
    setCurrentStep('shopping');
  }, []);

  const handleEndShopping = useCallback(() => {
    setCurrentStep('review');
  }, []);

  const handlePayment = useCallback(() => {
    setCurrentStep('confirmation');
  }, []);

  const handleExit = useCallback(() => {
    disableTestMode(); // Reset test mode on logout
    setCurrentStep('welcome');
    setUser(null);
    setCart([]);
    setTotal(0);
  }, []);

  const handleBackToShopping = useCallback(() => {
    setCurrentStep('shopping');
  }, []);

  const updateCart = useCallback((newCart, newTotal) => {
    setCart(newCart);
    setTotal(newTotal);
  }, []);

  // Memoize container styles to prevent recreation
  const containerStyles = useMemo(() => ({
    px: { xs: 1, sm: 2, md: 3 },
    py: { xs: 2, sm: 3, md: 4 },
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: '#f5f5f5'
  }), []);

  return (
    <ThemeProvider theme={theme}>
      <div>
        {currentStep === 'shopping' || currentStep === 'confirmation' ? (
          // Full screen for shopping and confirmation
          <>
            {currentStep === 'shopping' && user && (
              <ShoppingHandheld
                userId={user.id}
                user={user}
                cart={cart}
                total={total}
                onUpdateCart={updateCart}
                onEndShopping={handleEndShopping}
              />
            )}
            {currentStep === 'confirmation' && user && (
              <PaymentConfirmation
                user={user}
                cart={cart}
                total={total}
                onExit={handleExit}
              />
            )}
          </>
        ) : (
          // Centered container for welcome, wallet, and review
          <Box
            sx={containerStyles}
          >
            {currentStep === 'welcome' && (
              <WelcomeKiosk onLogin={handleLogin} />
            )}
            {currentStep === 'wallet' && user && (
              <WalletDisplay user={user} onContinue={handleContinueShopping} />
            )}
            {currentStep === 'review' && user && (
              <CartReview
                user={user}
                cart={cart}
                total={total}
                onPayment={handlePayment}
                onBack={handleBackToShopping}
              />
            )}
          </Box>
        )}

        {/* Install Prompt - Shows across all screens */}
        <InstallPrompt />
      </div>
    </ThemeProvider>
  );
}

export default App;
