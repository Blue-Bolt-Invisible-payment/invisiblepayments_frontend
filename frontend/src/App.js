import React, { useState, useCallback, useMemo, useEffect } from "react";
import useInactivityTimeout from "./hooks/useInactivityTimeout";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";

import WelcomeKiosk from "./components/WelcomeKiosk";
import WalletDisplay from "./components/WalletDisplay";
import ShoppingHandheld from "./components/ShoppingHandheld";
import CartReview from "./components/CartReview";
import PaymentConfirmation from "./components/PaymentConfirmation";
import InstallPrompt from "./components/InstallPrompt";
import { disableTestMode, getCart, getCartTotal } from "./api";
import SessionWarningBanner from "./components/SessionWarningBanner";
import SessionLocked from "./components/SessionLocked";

function App() {
  const [currentStep, setCurrentStep] = useState("welcome");
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [sessionLocked, setSessionLocked] = useState(false);

  /**
   * SESSION MANAGEMENT
   */
  const resetSession = useCallback(() => {
    setUser(null);
    setCart([]);
    setTotal(0);
    setCurrentStep("welcome");

    disableTestMode();
  }, []);

  // Dynamic inactivity timeout: 30s after payment, 15m otherwise
  const timeoutMs = currentStep === "confirmation" ? 30000 : 60000;

  // Show lock overlay on inactivity instead of immediately resetting session
  const resetInactivity = useInactivityTimeout(
    () => {
      // when timer expires: if we're on the payment confirmation step (30s),
      // perform the automatic logout/redirect; otherwise show the session lock modal.
      if (currentStep === "confirmation") {
        resetSession();
      } else {
        setSessionLocked(true);
      }
    },
    timeoutMs,
    !!user
  );

  useEffect(() => {
    if (!user) return;

    let activityTimer;
    const resetActivity = () => {
      clearTimeout(activityTimer);
      setShowWarning(false);
      activityTimer = setTimeout(() => {
        setShowWarning(true);
      }, 10 * 60 * 1000);
    };

    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];
    events.forEach((e) => document.addEventListener(e, resetActivity, true));
    resetActivity();

    return () => {
      clearTimeout(activityTimer);
      events.forEach((e) =>
        document.removeEventListener(e, resetActivity, true)
      );
    };
  }, [user]);

  /**
   * THEME CONFIGURATION
   */
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: { main: "#000048" },
          secondary: { main: "#dc004e" },
        },
        typography: {
          fontFamily:
            'Gallix, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
      }),
    []
  );

  /**
   * NAVIGATION HANDLERS
   */
  const handleLogin = useCallback((loggedUser) => {
    setUser(loggedUser);
    setCurrentStep("wallet");
  }, []);

  // REVERTED: Now goes directly to shopping regardless of cart state
  const handleContinueShopping = useCallback(() => {
    setCurrentStep("shopping");
  }, []);

  const handleEndShopping = useCallback(async () => {
    if (user) {
      try {
        const cartResponse = await getCart(user.id);
        const totalResponse = await getCartTotal(user.id);
        setCart(cartResponse.data);
        setTotal(totalResponse.data);
      } catch (error) {
        console.error("Failed to refresh cart for review:", error);
      }
    }
    setCurrentStep("review");
  }, [user]);

  const handlePayment = useCallback(() => {
    setCurrentStep("confirmation");
  }, []);

  const handleBackToShopping = useCallback(async () => {
    if (user) {
      try {
        const cartResponse = await getCart(user.id);
        const totalResponse = await getCartTotal(user.id);
        setCart(cartResponse.data);
        setTotal(totalResponse.data);
      } catch (error) {
        console.error("Failed to refresh cart:", error);
      }
    }
    setCurrentStep("shopping");
  }, [user]);

  const updateCart = useCallback((newCart, newTotal) => {
    setCart(newCart);
    setTotal(newTotal);
  }, []);

  /**
   * STYLES
   */
  const containerStyles = useMemo(
    () => ({
      px: { xs: 1, sm: 2, md: 3 },
      py: { xs: 2, sm: 3, md: 4 },
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      bgcolor: "#f5f5f5",
    }),
    []
  );

  // handler when user resumes via fingerprint in the SessionLocked overlay
  const handleResumeFromLock = useCallback(
    (authData) => {
      // close overlay
      setSessionLocked(false);
      // optionally merge any returned user info
      if (authData && typeof authData === "object") {
        setUser((prev) => ({ ...(prev || {}), ...authData }));
      }
      // restart inactivity timer for full timeout period
      if (typeof resetInactivity === "function") resetInactivity();
    },
    [resetInactivity]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        {/* Full screen layouts */}
        {currentStep === "shopping" || currentStep === "confirmation" ? (
          <>
            {currentStep === "shopping" && user && (
              <ShoppingHandheld
                userId={user.id}
                user={user}
                cart={cart}
                total={total}
                onUpdateCart={updateCart}
                onEndShopping={handleEndShopping}
                onLogout={resetSession}
              />
            )}

            {currentStep === "confirmation" && user && (
              <>
                {/* Render CartReview as the background page so PaymentConfirmation overlay appears on top */}
                <CartReview
                  user={user}
                  cart={cart}
                  total={total}
                  onPayment={handlePayment}
                  onBack={handleBackToShopping}
                  onLogout={resetSession}
                />

                {/* PaymentConfirmation mounts on top of CartReview and displays processing/success popups within the same page */}
                <PaymentConfirmation
                  user={user}
                  cart={cart}
                  total={total}
                  onExit={resetSession}
                />
              </>
            )}
          </>
        ) : (
          <Box sx={containerStyles}>
            {currentStep === "welcome" && (
              <WelcomeKiosk onLogin={handleLogin} />
            )}
            {currentStep === "wallet" && user && (
              <WalletDisplay
                user={user}
                onContinue={handleContinueShopping}
                onLogout={resetSession}
              />
            )}
            {currentStep === "review" && user && (
              <CartReview
                user={user}
                cart={cart}
                total={total}
                onPayment={handlePayment}
                onBack={handleBackToShopping}
                onLogout={resetSession}
              />
            )}
          </Box>
        )}

        <SessionWarningBanner
          show={showWarning}
          warningMs={300000} // 5 minutes before auto-logout
          onExpire={() => setSessionLocked(true)}
        />

        {/* Session locked overlay - appears on inactivity and resumes on fingerprint */}
        <SessionLocked
          open={sessionLocked}
          onResume={handleResumeFromLock}
          onExit={() => {
            setSessionLocked(false);
            resetSession();
          }}
        />
        <InstallPrompt />
      </div>
    </ThemeProvider>
  );
}

export default App;
