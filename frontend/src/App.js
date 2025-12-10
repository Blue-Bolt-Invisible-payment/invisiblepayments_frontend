import React, { useState, useCallback, useMemo } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import WelcomeKiosk from './components/WelcomeKiosk';
import WalletDisplay from './components/WalletDisplay';
import ShoppingHandheld from './components/ShoppingHandheld';
import CartReview from './components/CartReview';
import PaymentConfirmation from './components/PaymentConfirmation';
import InstallPrompt from './components/InstallPrompt';
// REGISTRATION: Uncomment below to enable user registration page
import UserRegistration from './components/UserRegistration';
import { disableTestMode, getCart, getCartTotal } from './api';

function App() {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  // REGISTRATION: Uncomment below to enable registration flow
  const [showRegistration, setShowRegistration] = useState(false);

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

  const handleEndShopping = useCallback(async () => {
    // Refresh cart data from database before showing review
    if (user) {
      try {
        const cartResponse = await getCart(user.id);
        const totalResponse = await getCartTotal(user.id);
        setCart(cartResponse.data);
        setTotal(totalResponse.data);
      } catch (error) {
        console.error('Failed to refresh cart for review:', error);
      }
    }
    setCurrentStep('review');
  }, [user]);

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

  const handleBackToShopping = useCallback(async () => {
    // Refresh cart data from database when going back to shopping
    if (user) {
      try {
        const cartResponse = await getCart(user.id);
        const totalResponse = await getCartTotal(user.id);
        setCart(cartResponse.data);
        setTotal(totalResponse.data);
      } catch (error) {
        console.error('Failed to refresh cart:', error);
      }
    }
    setCurrentStep('shopping');
  }, [user]);

  const updateCart = useCallback((newCart, newTotal) => {
    setCart(newCart);
    setTotal(newTotal);
  }, []);

  // REGISTRATION: Uncomment below functions to enable registration flow
  const handleShowRegistration = useCallback(() => {
    setShowRegistration(true);
  }, []);

  const handleRegistrationBack = useCallback(() => {
    setShowRegistration(false);
  }, []);

  const handleRegistrationComplete = useCallback((userData) => {
    setShowRegistration(false);
    // Optionally auto-login the user
    // setUser(userData);
    // setCurrentStep('wallet');
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
        {/* REGISTRATION: Uncomment below to show registration page */}
        {showRegistration ? (
          <UserRegistration 
            onBack={handleRegistrationBack}
            onRegistrationComplete={handleRegistrationComplete}
          />
        ) : currentStep === 'shopping' || currentStep === 'confirmation' ? (
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
              <WelcomeKiosk onLogin={handleLogin} onRegister={handleShowRegistration} />
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
