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

  // Dev: allow testing payment failure by adding ?simulateFail=1 to the URL
  const simulateFailParam =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("simulateFail") === "1"
      : false;

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

      // If simulateFail=1 and not yet used, simulate a failure for testing
      try {
        const used =
          typeof window !== "undefined" &&
          window.sessionStorage.getItem("simulateFailUsed");
        if (simulateFailParam && !used) {
          // mark used so retry will attempt real payment
          if (typeof window !== "undefined")
            window.sessionStorage.setItem("simulateFailUsed", "1");
          await new Promise((resolve) => setTimeout(resolve, 1500));
          throw new Error("Simulated failure for testing");
        }
      } catch (simErr) {
        // If simulation triggered, surface as normal error below
        throw simErr;
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await proceedToPay(user.id);
      setPaymentData(response.data);
      setPaymentSuccess(true);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.message ||
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
                  {/* <CloseIcon sx={{ color: "#000048", fontSize: 18 }} /> */}
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.113 8.99872L17.5567 2.56902C17.8389 2.2868 17.9974 1.90402 17.9974 1.5049C17.9974 1.10577 17.8389 0.722997 17.5567 0.440774C17.2745 0.158551 16.8918 0 16.4928 0C16.0937 0 15.711 0.158551 15.4288 0.440774L9 6.88546L2.57121 0.440774C2.28903 0.158551 1.90631 -2.9737e-09 1.50724 0C1.10817 2.9737e-09 0.725452 0.158551 0.443269 0.440774C0.161086 0.722997 0.00255743 1.10577 0.00255743 1.5049C0.00255743 1.90402 0.161086 2.2868 0.443269 2.56902L6.88704 8.99872L0.443269 15.4284C0.302812 15.5678 0.191329 15.7335 0.115249 15.9162C0.0391699 16.0988 0 16.2947 0 16.4925C0 16.6904 0.0391699 16.8863 0.115249 17.0689C0.191329 17.2516 0.302812 17.4173 0.443269 17.5567C0.582579 17.6971 0.74832 17.8086 0.930933 17.8847C1.11355 17.9608 1.30941 18 1.50724 18C1.70507 18 1.90094 17.9608 2.08355 17.8847C2.26616 17.8086 2.4319 17.6971 2.57121 17.5567L9 11.112L15.4288 17.5567C15.5681 17.6971 15.7338 17.8086 15.9165 17.8847C16.0991 17.9608 16.2949 18 16.4928 18C16.6906 18 16.8865 17.9608 17.0691 17.8847C17.2517 17.8086 17.4174 17.6971 17.5567 17.5567C17.6972 17.4173 17.8087 17.2516 17.8848 17.0689C17.9608 16.8863 18 16.6904 18 16.4925C18 16.2947 17.9608 16.0988 17.8848 15.9162C17.8087 15.7335 17.6972 15.5678 17.5567 15.4284L11.113 8.99872Z" fill="#000048"/>
</svg>
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
