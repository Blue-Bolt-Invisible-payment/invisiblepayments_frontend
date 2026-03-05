import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import useInactivityTimeout from "./hooks/useInactivityTimeout";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
 
import WelcomeKiosk from "./components/WelcomeKiosk";
import WalletDisplay from "./components/WalletDisplay";
import ShoppingHandheld from "./components/ShoppingHandheld";
import PaymentConfirmation from "./components/PaymentConfirmation";
import InstallPrompt from "./components/InstallPrompt";
import { disableTestMode, getCart, getCartTotal, logoutUser } from "./api"; 
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
  const suppressLockRef = useRef(false); 
  const loggingOutRef = useRef(false);   
 
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
 
  // UPDATED:instade of fetch using logoutUser in api.js 
  
  const startLogoutFlow = useCallback(async () => {
    if (loggingOutRef.current) return;
    loggingOutRef.current = true;
 
    try {
      if (confirmationTimerRef.current) {
        clearTimeout(confirmationTimerRef.current);
        confirmationTimerRef.current = null;
      }
 
      const stored = localStorage.getItem("user");
      const storedUser = stored ? JSON.parse(stored) : null;
      const userId = user?.userId || user?.id || storedUser?.userId;
 
      if (userId) {
        // REMOVED: direct fetch call
        // ADDED: api.js call
        await logoutUser(userId); 
      }
    } catch (error) {
      console.error("Backend logout failed:", error);
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/login";
      loggingOutRef.current = false;
    }
  }, [user]);
 
  const timeoutMs = currentStep === "confirmation" ? 30000 : 60000;
 
  const resetInactivity = useInactivityTimeout(
    () => {
      if (currentStep === "confirmation") {
        startLogoutFlow();
      } else {
        if (!suppressLockRef.current) setSessionLocked(true);
      }
    },
    timeoutMs,
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
 
  const theme = useMemo(
    () =>
      createTheme({
        palette: { primary: { main: "#000048" }, secondary: { main: "#dc004e" } },
        typography: {
          fontFamily: 'Gallix, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
      }),
    []
  );
 
  const handleLogin = useCallback((loggedUser) => {
    setUser(loggedUser);
    setCurrentStep("shopping");
  }, []);
 
  const handleContinueShopping = useCallback(() => {
    setCurrentStep("shopping");
  }, []);
 
  const handleEndShopping = useCallback(
    async (authData) => {
      suppressLockRef.current = true;
      if (user) {
        try {
          if (authData) setUser((prev) => ({ ...prev, ...authData }));
 
          const cartResponse = await getCart(user.id);
          const totalResponse = await getCartTotal(user.id);
          setCart(cartResponse.data);
          setTotal(totalResponse.data);
 
          setShowWarning(false);
          setSessionLocked(false);
          setCurrentStep("confirmation");
 
          if (confirmationTimerRef.current) {
            clearTimeout(confirmationTimerRef.current);
          }
          confirmationTimerRef.current = setTimeout(() => {
            startLogoutFlow();
          }, 30000);
        } catch (error) {
          console.error("Failed to refresh cart for review:", error);
        }
      }
    },
    [user, startLogoutFlow]
  );
 
  const updateCart = useCallback((newCart, newTotal) => {
    setCart(newCart);
    setTotal(newTotal);
  }, []);
 
  const handleResumeFromLock = useCallback(
    (authData) => {
      setSessionLocked(false);
      if (authData && typeof authData === "object") {
        setUser((prev) => ({ ...(prev || {}), ...authData }));
      }
      if (typeof resetInactivity === "function") resetInactivity();
    },
    [resetInactivity]
  );
 
  const handlePaymentSuccessShown = useCallback(() => {
    suppressLockRef.current = true;
    setShowWarning(false);
    setSessionLocked(false);
 
    if (confirmationTimerRef.current) {
      clearTimeout(confirmationTimerRef.current);
    }
    confirmationTimerRef.current = setTimeout(() => {
      startLogoutFlow();
    }, 30000);
  }, [startLogoutFlow]);
 
  const handlePaymentSuccessHidden = useCallback(() => {
    if (confirmationTimerRef.current) {
      clearTimeout(confirmationTimerRef.current);
      confirmationTimerRef.current = null;
    }
    suppressLockRef.current = false;
  }, []);
 
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
                onExit={startLogoutFlow}
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
 
        {currentStep !== "confirmation" && currentStep !== "welcome" && (
          <SessionWarningBanner
            show={showWarning}
            warningMs={30000}
            onExpire={() => {
              if (!suppressLockRef.current) setSessionLocked(true);
            }}
          />
        )}
        {currentStep !== "confirmation" && currentStep !== "welcome" && (
          <SessionLocked
            open={sessionLocked}
            onResume={handleResumeFromLock}
            onExit={() => {
              setSessionLocked(false);
              resetSession();
            }}
          />
        )}
        <InstallPrompt />
      </div>
    </ThemeProvider>
  );
}
 
export default App;
