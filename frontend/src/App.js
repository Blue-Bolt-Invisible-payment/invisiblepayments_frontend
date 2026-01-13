import React, { useState, useCallback, useMemo, useEffect } from "react";
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

  const resetSession = useCallback(() => {
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
    if (user) {
      try {
        // Update user if authData has new balance
        if (authData) setUser(prev => ({ ...prev, ...authData }));

        const cartResponse = await getCart(user.id);
        const totalResponse = await getCartTotal(user.id);
        setCart(cartResponse.data);
        setTotal(totalResponse.data);
        
        // Move directly to final success screen
        setCurrentStep("confirmation");
      } catch (error) {
        console.error("Failed to refresh cart for review:", error);
      }
    }
  }, [user]);

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

  const containerStyles = useMemo(() => ({
    px: { xs: 1, sm: 2, md: 3 }, py: { xs: 2, sm: 3, md: 4 },
    minHeight: "100vh", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", bgcolor: "#f5f5f5",
  }), []);

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

        <SessionWarningBanner show={showWarning} warningMs={300000} onExpire={() => setSessionLocked(true)} />
        <SessionLocked open={sessionLocked} onResume={handleResumeFromLock} onExit={() => { setSessionLocked(false); resetSession(); }} />
        <InstallPrompt />
      </div>
    </ThemeProvider>
  );
}

export default App;