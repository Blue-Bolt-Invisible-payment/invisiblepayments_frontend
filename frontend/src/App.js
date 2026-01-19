import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import useInactivityTimeout from "./hooks/useInactivityTimeout";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";

import WelcomeKiosk from "./components/WelcomeKiosk";
import WalletDisplay from "./components/WalletDisplay";
import ShoppingHandheld from "./components/ShoppingHandheld";
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
  const confirmationTimerRef = useRef(null);
  const suppressLockRef = useRef(false); // suppress session lock while showing confirmation or local success

  const resetSession = useCallback(() => {
    if (confirmationTimerRef.current) {
      clearTimeout(confirmationTimerRef.current);
      confirmationTimerRef.current = null;
    }
    suppressLockRef.current = false;
    setUser(null);
    setCart([]);
    setTotal(0);
    setCurrentStep("welcome");
    disableTestMode();
  }, []);

  const timeoutMs = currentStep === "confirmation" ? 30000 : 60000;

  const resetInactivity = useInactivityTimeout(
    () => {
      if (currentStep === "confirmation") {
        resetSession();
      } else {
        if (!suppressLockRef.current) setSessionLocked(true);
      }
    },
    timeoutMs,
    // disable the inactivity hook while on confirmation screen so it cannot trigger the session lock there
    !!user && currentStep !== "confirmation"
  );

  useEffect(() => {
    if (!user) return;
    let activityTimer;
    const resetActivity = () => {
      clearTimeout(activityTimer);
      setShowWarning(false);
      activityTimer = setTimeout(() => setShowWarning(true), 10 * 60 * 1000);
    };
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"];
    events.forEach((e) => document.addEventListener(e, resetActivity, true));
    resetActivity();
    return () => {
      clearTimeout(activityTimer);
      events.forEach((e) => document.removeEventListener(e, resetActivity, true));
    };
  }, [user]);

  const theme = useMemo(() => createTheme({
    palette: { primary: { main: "#000048" }, secondary: { main: "#dc004e" } },
    typography: { fontFamily: 'Gallix, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  }), []);

  const handleLogin = useCallback((loggedUser) => {
    setUser(loggedUser);
    setCurrentStep("shopping"); 
  }, []);

  const handleContinueShopping = useCallback(() => {
    setCurrentStep("shopping");
  }, []);

  // UPDATED: Now triggered after PaymentScan is successful inside ShoppingHandheld
  const handleEndShopping = useCallback(async (authData) => {
    // suppress session lock while we transition to confirmation
    suppressLockRef.current = true;
    if (user) {
      try {
        // Update user if authData has new balance
        if (authData) setUser(prev => ({ ...prev, ...authData }));

        const cartResponse = await getCart(user.id);
        const totalResponse = await getCartTotal(user.id);
        setCart(cartResponse.data);
        setTotal(totalResponse.data);

        // ensure any warning/lock is cleared and start 30s redirect to welcome
        setShowWarning(false);
        setSessionLocked(false);

        // Move directly to final success screen
        setCurrentStep("confirmation");

        // start 30s timer to return to welcome/login
        if (confirmationTimerRef.current) {
          clearTimeout(confirmationTimerRef.current);
        }
        confirmationTimerRef.current = setTimeout(() => {
          resetSession();
        }, 30000);
      } catch (error) {
        console.error("Failed to refresh cart for review:", error);
      }
    }
  }, [user, resetSession]);

  const updateCart = useCallback((newCart, newTotal) => {
    setCart(newCart);
    setTotal(newTotal);
  }, []);

  const handleResumeFromLock = useCallback((authData) => {
    setSessionLocked(false);
    if (authData && typeof authData === "object") {
      setUser((prev) => ({ ...(prev || {}), ...authData }));
    }
    if (typeof resetInactivity === "function") resetInactivity();
  }, [resetInactivity]);

  const handlePaymentSuccessShown = useCallback(() => {
    // suppress any lock or warning while payment success is visible
    suppressLockRef.current = true;
    setShowWarning(false);
    setSessionLocked(false);

    // start 30s auto-logout timer (clear existing first)
    if (confirmationTimerRef.current) {
      clearTimeout(confirmationTimerRef.current);
    }
    confirmationTimerRef.current = setTimeout(() => {
      resetSession();
    }, 30000);
  }, [resetSession]);

  const handlePaymentSuccessHidden = useCallback(() => {
    // clear the auto-logout timer and allow session lock again
    if (confirmationTimerRef.current) {
      clearTimeout(confirmationTimerRef.current);
      confirmationTimerRef.current = null;
    }
    suppressLockRef.current = false;
  }, []);

  const containerStyles = useMemo(() => ({
    px: { xs: 1, sm: 2, md: 3 }, py: { xs: 2, sm: 3, md: 4 },
    minHeight: "100vh", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", bgcolor: "#f5f5f5",
  }), []);

  useEffect(() => {
    if (currentStep !== "confirmation" && confirmationTimerRef.current) {
      clearTimeout(confirmationTimerRef.current);
      confirmationTimerRef.current = null;
    }
  }, [currentStep]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
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
                onPaymentSuccessShown={handlePaymentSuccessShown}
                onPaymentSuccessHidden={handlePaymentSuccessHidden}
              />
            )}

            {currentStep === "confirmation" && user && (
              <PaymentConfirmation
                user={user}
                cart={cart}
                total={total}
                onExit={resetSession}
              />
            )}
          </>
        ) : (
          <Box sx={containerStyles}>
            {currentStep === "welcome" && <WelcomeKiosk onLogin={handleLogin} />}
            {currentStep === "wallet" && user && (
              <WalletDisplay user={user} onContinue={handleContinueShopping} onLogout={resetSession} />
            )}
          </Box>
        )}

        {/* Only show warning banner and lock on screens other than welcome and confirmation */}
        {currentStep !== "confirmation" && currentStep !== "welcome" && (
          <SessionWarningBanner show={showWarning} warningMs={30000} onExpire={() => { if (!suppressLockRef.current) setSessionLocked(true); }} />
        )}
        {currentStep !== "confirmation" && currentStep !== "welcome" && (
          <SessionLocked open={sessionLocked} onResume={handleResumeFromLock} onExit={() => { setSessionLocked(false); resetSession(); }} />
        )}
        <InstallPrompt />
      </div>
    </ThemeProvider>
  );
}

export default App;