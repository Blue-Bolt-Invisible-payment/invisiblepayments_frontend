import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Paper,
  IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import CloseIcon from "@mui/icons-material/Close";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import { proceedToPay } from "../api";
import useInactivityTimeout from "../hooks/useInactivityTimeout";
import PaymentFailed from "./PaymentFailed";

const PaymentConfirmation = ({ user, total, onExit }) => {
  const [processing, setProcessing] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState("");

  // Masking
  const maskEmail = (email) =>
    email ? email.replace(/^(..)(.*)(@.*)$/, "$1***$3") : "your email";
  const maskPhone = (phone) =>
    phone ? `******${phone.slice(-4)}` : "your mobile";

  const totalAmount = typeof total === "object" ? total.total || 0 : total || 0;

  // Extracted handler so it can be reused for initial call and retry
  const handlePayment = async () => {
    try {
      setError("");
      setProcessing(true);
      setPaymentSuccess(false);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await proceedToPay(user.id);
      setPaymentData(response.data);
      setPaymentSuccess(true);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          "Payment Failed. Please try again or contact support."
      );
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    handlePayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  // Prevent background scrolling when overlays are visible (processing, success, or error)
  useEffect(() => {
    if (typeof document === "undefined") return;
    const shouldHide = processing || paymentSuccess || Boolean(error);

    const preventScroll = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    if (shouldHide) {
      // hide body scrollbar
      document.body.style.overflow = "hidden";
      // block wheel and touch events on the document to prevent inner containers scrolling
      window.addEventListener("wheel", preventScroll, { passive: false });
      window.addEventListener("touchmove", preventScroll, { passive: false });
      // block keys that may scroll (space, arrows, page up/down)
      const preventKeys = (ev) => {
        const keys = [
          "ArrowUp",
          "ArrowDown",
          "PageUp",
          "PageDown",
          "Home",
          "End",
          " ",
        ];
        if (keys.includes(ev.key)) {
          ev.preventDefault();
          ev.stopPropagation();
          return false;
        }
      };
      window.addEventListener("keydown", preventKeys, true);

      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("wheel", preventScroll, { passive: false });
        window.removeEventListener("touchmove", preventScroll, {
          passive: false,
        });
        window.removeEventListener("keydown", preventKeys, true);
      };
    }

    // if not hiding, ensure defaults
    document.body.style.overflow = "";
    return undefined;
  }, [processing, paymentSuccess, error]);

  // Start a 30s inactivity timeout when the success popup is visible
  useInactivityTimeout(onExit, 30000, paymentSuccess && !processing);

  const displayEmail = maskEmail(paymentData?.recipientEmail || user?.email);
  const displayPhone = maskPhone(paymentData?.recipientPhone || user?.phone);
  const resolvedAmount =
    paymentData?.amount != null
      ? Number(paymentData.amount)
      : Number(totalAmount);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        position: "relative",
      }}
    >
      <Box sx={{ maxWidth: 600, width: "100%", mx: "auto" }}>
        {processing && (
          <>
            {/* Fixed backdrop so user doesn't need to scroll to see processing state */}
            <Box
              sx={{
                position: "fixed",
                inset: 0,
                bgcolor: "rgba(0,0,0,0.45)",
                zIndex: 1300,
              }}
            />
            <Box
              sx={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1400,
              }}
            >
              <Paper
                sx={{
                  p: 5,
                  textAlign: "center",
                  borderRadius: 4,
                  boxShadow: 5,
                  minWidth: 360,
                }}
              >
                <CircularProgress size={70} sx={{ color: "#000048", mb: 3 }} />
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", color: "#000048" }}
                >
                  Processing Payment...
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.7, mt: 1 }}>
                  Please wait while we complete your transaction
                </Typography>
              </Paper>
            </Box>
          </>
        )}

        {/* Render the Figma-styled popup as an overlay on the same page */}
        {paymentSuccess && !processing && (
          <>
            {/* Fixed backdrop so popup stays visible (no scrolling) */}
            <Box
              sx={{
                position: "fixed",
                inset: 0,
                bgcolor: "rgba(0,0,0,0.45)",
                zIndex: 1300,
              }}
            />

            {/* Popup box centered horizontally within the viewport (fixed) */}
            <Box
              role="dialog"
              aria-modal="true"
              sx={{
                position: "fixed",
                top: "178.49px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "766px",
                height: "351.011444px",
                bgcolor: "#FFFFFF",
                borderRadius: "8px",
                boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
                border: "1px solid #000048",
                zIndex: 1400,
                p: "12px 24px 42px 24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    height: "40px",
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      bgcolor: "#000048",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ThumbUpAltIcon sx={{ color: "#FFFFFF", fontSize: 20 }} />
                  </Box>

                  <Typography
                    sx={{
                      fontFamily: "Gallix, sans-serif",
                      fontWeight: 500,
                      fontSize: "24px",
                      color: "#000048",
                    }}
                  >
                    Payment Successful
                  </Typography>
                </Box>

                <IconButton
                  onClick={onExit}
                  sx={{ width: 40, height: 40 }}
                  aria-label="close"
                >
                  <CloseIcon sx={{ color: "#000048", fontSize: 18 }} />
                </IconButton>
              </Box>

              {/* Separator */}
              <Box
                sx={{ width: "100%", borderBottom: "1px solid #000048", mt: 1 }}
              />

              {/* Content area: centered check, messages and thank you text */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "24px",
                }}
              >
                <Box
                  sx={{
                    width: 82,
                    height: 82,
                    borderRadius: "50%",
                    bgcolor: "#2DB81F",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckCircleIcon sx={{ color: "#FFFFFF", fontSize: 49 }} />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Gallix, sans-serif",
                      fontWeight: 400,
                      fontSize: "17px",
                      color: "#000048",
                      textAlign: "center",
                    }}
                  >
                    Your payment has been completed.
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Gallix, sans-serif",
                      fontWeight: 400,
                      fontSize: "15px",
                      color: "#000048",
                      textAlign: "center",
                    }}
                  >
                    A receipt has been sent to your linked email-id.
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    fontFamily: "Gallix, sans-serif",
                    fontWeight: 600,
                    fontSize: "20px",
                    color: "#000048",
                    textAlign: "center",
                  }}
                >
                  Thank you for shopping with us!
                </Typography>
              </Box>
            </Box>
          </>
        )}

        {error && !processing && (
          <PaymentFailed
            open={Boolean(error)}
            onClose={() => setError("")}
            onRetry={handlePayment}
            onExit={onExit}
          />
        )}
      </Box>
    </Box>
  );
};

export default PaymentConfirmation;
