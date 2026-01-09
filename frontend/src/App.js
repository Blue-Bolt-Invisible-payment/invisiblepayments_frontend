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

function App() {
  const [currentStep, setCurrentStep] = useState("welcome");
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  /**
   * SESSION MANAGEMENT
   */
  const resetSession = useCallback(() => {
    setUser(null);
    setCart([]);
    setTotal(0);
    setCurrentStep("welcome");
    gi;
    disableTestMode();
  }, []);

  const timeoutMs = currentStep === "confirmation" ? 30000 : 900000;

  useInactivityTimeout(
    () => {
      resetSession();
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
          warningMs={300000}
          onExpire={resetSession}
        />
        <InstallPrompt />
      </div>
    </ThemeProvider>
  );
}

export default App;
