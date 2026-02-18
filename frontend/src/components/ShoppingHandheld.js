import React, { useState, useEffect, useRef } from "react";

import {
Button,
Typography,
Box,
List,
Divider,
// Paper,
Alert,
Dialog,
DialogContent,
IconButton,
CircularProgress,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { getCart, getCartTotal, proceedToPay } from "../api";
import AppHeader from "./AppHeader";
import PaymentScan from "./PaymentScan";
import PaymentFailed from "./PaymentFailed";

// --- Cart Icon Component ---
const CartIcon = () => (
<Box
sx={{
width: "30px",
height: "30px",
borderRadius: "4px",
bgcolor: "#000048",
display: "flex",
alignItems: "center",
justifyContent: "center",
position: "relative",
}}
>
<svg
width="22"
height="17"
viewBox="0 0 22 17"
fill="none"
xmlns="http://www.w3.org/2000/svg"
style={{ position: "absolute", top: "7px", left: "3px" }}
>
<path
d="M21.9522 3.83264L19.3935 11.7566C19.2022 12.3209 18.7 12.6971 18.1022 12.6971H8.22609C7.65217 12.6971 7.10217 12.3444 6.91087 11.8271L3.13261 1.88105H0.956522C0.430435 1.88105 0 1.45781 0 0.940526C0 0.423236 0.430435 0 0.956522 0H3.80217C4.2087 0 4.56739 0.258644 4.71087 0.634855L8.6087 10.816H17.6957L19.7283 4.4675H8.46522C7.93913 4.4675 7.5087 4.04426 7.5087 3.52697C7.5087 3.00968 7.93913 2.58645 8.46522 2.58645H21.0435C21.3543 2.58645 21.6413 2.75104 21.8087 2.98617C22 3.2213 22.0478 3.55048 21.9522 3.83264ZM8.70435 13.9433C8.29783 13.9433 7.8913 14.1079 7.60435 14.39C7.31739 14.6722 7.15 15.0719 7.15 15.4716C7.15 15.8714 7.31739 16.2711 7.60435 16.5532C7.8913 16.8354 8.29783 17 8.70435 17C9.11087 17 9.51739 16.8354 9.80435 16.5532C10.0913 16.2711 10.2587 15.8714 10.2587 15.4716C10.2587 15.0719 10.0913 14.6722 9.80435 14.39C9.51739 14.1079 9.11087 13.9433 8.70435 13.9433ZM17.2891 13.9433C16.8826 13.9433 16.4761 14.1079 16.1891 14.39C15.9022 14.6722 15.7348 15.0719 15.7348 15.4716C15.7348 15.8714 15.9022 16.2711 16.1891 16.5532C16.4761 16.8354 16.8826 17 17.2891 17C17.6957 17 18.1022 16.8354 18.3891 16.5532C18.6761 16.2711 18.8435 15.8714 18.8435 15.4716C18.8435 15.0719 18.6761 14.6722 18.3891 14.39C18.1022 14.1079 17.6957 13.9433 17.2891 13.9433Z"
fill="white"
/>
</svg>
</Box>
);

// --- Updated EmptyCartView Component with Wallet BESIDE Welcome (Responsive) ---
const EmptyCartView = ({ user, onLogout }) => {
return (
<Box
sx={{
width: "100vw",
height: "100vh",
bgcolor: "#FFFFFF",
overflow: "hidden",
}}
>
<AppHeader user={user} onLogout={onLogout} showWallet={false} />
<Box
sx={{
width: "100%",
height: "100%",
display: "flex",
flexDirection: "column",
alignItems: "center",
justifyContent: "center",
position: "relative",
pt: "60px",
}}
>
{/* Welcome Container with Name and Wallet - ALWAYS HORIZONTAL (BESIDE) */}
<Box
sx={{
position: "absolute",
top: { xs: "70px", md: "77px" },
left: { xs: "12px", sm: "24px", md: "33px" },
right: { xs: "12px", sm: "24px", md: "33px" },
display: "flex",
alignItems: "center",
justifyContent: "space-between",
flexDirection: "row",
gap: { xs: "8px", sm: "16px" },
}}
>
{/* Left side - Avatar and Name */}
<Box
sx={{
display: "flex",
alignItems: "center",
gap: { xs: "8px", sm: "12px", md: "16px" },
minWidth: 0,
flex: "0 1 auto",
}}
>
<Box
component="img"
src="/logo/BoyLogo.png"
sx={{
width: { xs: "28px", sm: "32px", md: "38px" },
height: { xs: "28px", sm: "32px", md: "38px" },
flexShrink: 0,
}}
/>
<Typography
sx={{
fontFamily: "Gallix, sans-serif",
fontWeight: 600,
fontSize: { xs: "12px", sm: "14px", md: "20px" },
color: "#000048",
whiteSpace: "nowrap",
overflow: "hidden",
textOverflow: "ellipsis",
}}
>
Welcome {user?.name || "User"} !
</Typography>
</Box>

{/* Right side - Wallet Balance */}
<Box
sx={{
display: "flex",
alignItems: "center",
gap: { xs: "6px", sm: "10px", md: "16px" },
bgcolor: "#f2f2f2",
height: { xs: "40px", sm: "50px", md: "62px" },
padding: { xs: "8px 10px", sm: "12px 14px", md: "16px" },
borderRadius: "8px",
flexShrink: 0,
}}
>
<svg
width="24"
height="21"
viewBox="0 0 24 21"
fill="none"
xmlns="http://www.w3.org/2000/svg"
style={{ flexShrink: 0, minWidth: "18px" }}
>
<path d="M17.4187 0C21.5573 0 24 2.31536 24 6.27877H18.9227V6.31921C16.5663 6.31921 14.656 8.1299 14.656 10.3635C14.656 12.5971 16.5663 14.4078 18.9227 14.4078H24V14.7718C24 18.6846 21.5573 21 17.4187 21H6.58133C2.44267 21 0 18.6846 0 14.7718V6.22821C0 2.31536 2.44267 0 6.58133 0H17.4187ZM23.104 8.01781C23.5988 8.01781 24 8.39806 24 8.86712V11.8195C23.9942 12.2862 23.5964 12.6633 23.104 12.6688H19.0187C17.8257 12.684 16.7826 11.9098 16.512 10.8084C16.3765 10.1247 16.5667 9.41916 17.0317 8.88092C17.4967 8.34268 18.1888 8.02675 18.9227 8.01781H23.104ZM19.4987 9.38276H19.104C18.8617 9.38006 18.6283 9.46941 18.456 9.63088C18.2836 9.79234 18.1867 10.0125 18.1867 10.2422C18.1866 10.7241 18.5957 11.1163 19.104 11.1218H19.4987C20.0053 11.1218 20.416 10.7325 20.416 10.2523C20.416 9.77206 20.0053 9.38276 19.4987 9.38276ZM12.4587 4.53972H5.68533C5.18284 4.53969 4.77384 4.92286 4.768 5.39913C4.768 5.88102 5.17698 6.27323 5.68533 6.27877H12.4587C12.9653 6.27877 13.376 5.88947 13.376 5.40924C13.376 4.92902 12.9653 4.53972 12.4587 4.53972Z" fill="#000048" />
</svg>
<Typography
sx={{
fontFamily: "Gallix, sans-serif",
fontWeight: 500,
fontSize: { xs: "11px", sm: "14px", md: "20px" },
color: "#000048",
whiteSpace: "nowrap",
}}
>
<Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
Wallet Balance :
</Box>
<Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
Bal:
</Box>
$ {Number(user?.walletBalance || 0).toFixed(2)}
</Typography>
</Box>
</Box>
<Typography
sx={{
fontFamily: "Gallix, sans-serif",
fontWeight: 500,
fontSize: { xs: "24px", md: "32px" },
color: "#000048",
mb: 1.5,
textAlign: "center",
px: 2,
}}
>
Your cart is empty
</Typography>
<Typography
sx={{
fontFamily: "Gallix, sans-serif",
fontWeight: 500,
fontSize: { xs: "16px", md: "20px" },
opacity: 0.8,
color: "#000048",
mb: 5,
textAlign: "center",
px: 2,
}}
>
Drop items into the cart to begin your shopping
</Typography>
<Box
component="img"
src="/logo/image.png"
sx={{ width: { xs: "160px", md: "220px" }, mb: 4 }}
/>
</Box>
</Box>
);
};

// --- Image URL helper ---
const getImageUrl = (path) => {
if (!path) return "/logo/16.png";
// If it's already a full URL (http/https), use as-is
if (path.startsWith("http")) return path;
// If it starts with / (e.g. /api/..., /uploads/..., /images/...), serve from backend
if (path.startsWith("/")) return `http://localhost:8080${path}`;
// If it's a relative path from DB (e.g. "uploads/products/apple.png" or "images/16.png")
// Serve from backend with leading slash
if (path.includes("/") || path.includes("\\")) return `http://localhost:8080/${path}`;
// Just a filename â€” serve from backend uploads
return `http://localhost:8080/uploads/products/${path}`;
};

// --- FIXED Responsive Cart Item Component ---
const CartItemComponent = React.memo(({ cartItem }) => {
if (!cartItem || !cartItem.item) return null;
const unitPrice = Number(cartItem.item.price || 0);
const rowSubtotal = unitPrice * cartItem.quantity;
return (
<Box
sx={{
width: "100%",
minHeight: { xs: "auto", md: "106px" },
padding: { xs: "12px", md: "12px 16px" },
border: "1px solid #E3E3E3",
display: "flex",
flexDirection: { xs: "column", md: "row" },
alignItems: { xs: "flex-start", md: "center" },
bgcolor: "#ffffff",
}}
>
{/* Product Image and Details */}
<Box
sx={{
display: "flex",
alignItems: "center",
flex: { xs: "1", md: "1 1 45%" },
minWidth: 0,
width: { xs: "100%", md: "auto" },
}}
>
<Box
component="img"
src={getImageUrl(cartItem.item.imageUrl)}
sx={{
width: { xs: "60px", md: "80px" },
height: { xs: "60px", md: "80px" },
objectFit: "contain",
flexShrink: 0,
}}
/>
<Box sx={{ ml: "16px", minWidth: 0, flex: 1 }}>
<Typography
sx={{
fontFamily: "Gallix, sans-serif",
color: "#000048",
fontSize: { xs: "14px", md: "16px" },
fontWeight: 600,
overflow: "hidden",
textOverflow: "ellipsis",
whiteSpace: "nowrap",
}}
>
{cartItem.item.name}
</Typography>
<Typography
sx={{
fontFamily: "Gallix, sans-serif",
fontSize: { xs: "12px", md: "14px" },
color: "#848484",
}}
>
{cartItem.item.unit}
</Typography>
<Typography
sx={{
fontFamily: "Gallix, sans-serif",
fontSize: { xs: "11px", md: "12px" },
color: "#B0B0B0",
}}
>
{cartItem.item.rfidTag
? `#${cartItem.item.rfidTag}`
: "#Scanning..."}
</Typography>
</Box>
</Box>

{/* Quantity, Price, Subtotal */}
<Box
sx={{
display: "flex",
alignItems: "center",
justifyContent: { xs: "space-between", md: "flex-end" },
flex: { xs: "1", md: "1 1 45%" },
width: { xs: "100%", md: "auto" },
mt: { xs: 2, md: 0 },
pt: { xs: 2, md: 0 },
borderTop: { xs: "1px solid #f0f0f0", md: "none" },
gap: { xs: "8px", md: "16px" },
}}
>
<Box sx={{ textAlign: "center", flex: { xs: 1, md: "0 0 80px" } }}>
<Typography
sx={{
display: { xs: "block", md: "none" },
fontFamily: "Gallix, sans-serif",
fontSize: "10px",
color: "#848484",
mb: 0.5,
}}
>
Qty
</Typography>
<Typography
sx={{
fontSize: '15px',
fontWeight: 400,
color: "#000048",
fontFamily: "Gallix, sans-serif",
}}
>
{cartItem.quantity}
</Typography>
</Box>
<Box sx={{ textAlign: "center", flex: { xs: 1, md: "0 0 80px" } }}>
<Typography
sx={{
display: { xs: "block", md: "none" },
fontFamily: "Gallix, sans-serif",
fontSize: "10px",
color: "#848484",
mb: 0.5,
}}
>
Price
</Typography>
<Typography
sx={{
fontFamily: "Gallix, sans-serif",
fontSize: '15px',
fontWeight: 400,
color: "#000048"
}}
>
${unitPrice.toFixed(2)}
</Typography>
</Box>
<Box sx={{ textAlign: "center", flex: { xs: 1, md: "0 0 80px" } }}>
<Typography
sx={{
display: { xs: "block", md: "none" },
fontFamily: "Gallix, sans-serif",
fontSize: "10px",
color: "#848484",
mb: 0.5,
}}
>
Subtotal
</Typography>
<Typography
sx={{
fontFamily: "Gallix, sans-serif",
fontSize: '15px',
fontWeight: 500,
color: "#000048",
}}
>
${rowSubtotal.toFixed(2)}
</Typography>
</Box>
</Box>
</Box>
);
});

// --- Main ShoppingHandheld Component ---
const ShoppingHandheld = ({
userId,
user,
cart = [],
onUpdateCart,
onEndShopping,
onLogout,
onPaymentSuccessShown,
onPaymentSuccessHidden,
}) => {
  // eslint-disable-next-line 
const [error, setError] = useState("");
const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
const [showPaymentScan, setShowPaymentScan] = useState(false);
const [balanceDialogOpen, setBalanceDialogOpen] = useState(false);
const [isProcessing, setIsProcessing] = useState(false);
const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
// eslint-disable-next-line
const [paymentData, setPaymentData] = useState(null);
const [paymentError, setPaymentError] = useState("");

// FIX: Add loading state to track initial cart fetch
const [isLoading, setIsLoading] = useState(true);

// RFID AUTO-REMOVE: "Item Removed" popup state
const [removedItemName, setRemovedItemName] = useState("");
const [showItemRemovedDialog, setShowItemRemovedDialog] = useState(false);

// RFID polling ref
const pollingRef = useRef(null);
// Track previous cart items to detect which item was removed
const prevCartRef = useRef([]);
// Track previous cart length to only update when cart actually changes
const prevCartLengthRef = useRef(-1);

// FIX: Fetch cart data on component mount to ensure we have the latest data
useEffect(() => {
const fetchCartData = async () => {
if (userId) {
try {
setIsLoading(true);
const cartRes = await getCart(userId);
const cartData = cartRes.data || cartRes;
const totalRes = await getCartTotal(userId);
onUpdateCart(cartData, totalRes.subtotal || totalRes.data || 0);
// Initialize prevCartRef with current cart for auto-remove detection
prevCartRef.current = Array.isArray(cartData) ? cartData : [];
prevCartLengthRef.current = Array.isArray(cartData) ? cartData.length : 0;
} catch (err) {
console.error("Failed to fetch cart:", err);
} finally {
setIsLoading(false);
}
} else {
setIsLoading(false);
}
};
fetchCartData();
// eslint-disable-next-line
}, [userId]);

// Cleanup payment timer on unmount
useEffect(() => {
return () => {
if (paymentSuccessTimerRef.current) {
clearInterval(paymentSuccessTimerRef.current);
}
};
}, []);

// RFID Polling - fetch cart every 3 seconds to detect RFID-scanned items
// Only updates UI when cart actually changes (new item scanned or item removed)
// Stops polling during payment flow to prevent empty cart flash
useEffect(() => {
if (!userId) return;

// Stop polling during payment flow
if (isProcessing || showPaymentSuccess || paymentError) {
if (pollingRef.current) {
clearInterval(pollingRef.current);
pollingRef.current = null;
}
return;
}

const pollCart = async () => {
try {
const cartRes = await getCart(userId);
const cartData = cartRes.data || cartRes;
const newItems = Array.isArray(cartData) ? cartData : [];
const newLength = newItems.length;

// Only update UI when cart actually changed (new tag scanned or item removed)
if (newLength !== prevCartLengthRef.current) {

// RFID AUTO-REMOVE: Detect which item was removed
if (newLength < prevCartLengthRef.current && prevCartRef.current.length > 0) {
// Find items that were in previous cart but NOT in new cart
const newIds = new Set(newItems.map((ci) => ci.id));
const removedItems = prevCartRef.current.filter((ci) => !newIds.has(ci.id));
if (removedItems.length > 0) {
const removedName = removedItems.map((ci) => ci.item?.name || "Unknown Item").join(", ");
setRemovedItemName(removedName);
setShowItemRemovedDialog(true);
}
}

prevCartLengthRef.current = newLength;
prevCartRef.current = newItems;
const totalRes = await getCartTotal(userId);
onUpdateCart(cartData, totalRes.subtotal || totalRes.data || 0);
}
} catch (err) {
console.error("RFID poll error:", err);
}
};

pollingRef.current = setInterval(pollCart, 3000);

return () => {
if (pollingRef.current) {
clearInterval(pollingRef.current);
}
};
// eslint-disable-next-line
}, [userId, isProcessing, showPaymentSuccess, paymentError]);

const currentTotal = (cart || []).reduce(
(acc, item) => acc + Number(item.item?.price || 0) * item.quantity,
0
);
const orderTotal = currentTotal + 2.5;
const walletBalance = Number(user?.walletBalance || 0);
const additionalRequired =
orderTotal > walletBalance
? (orderTotal - walletBalance).toFixed(2)
: "0.00";

const handleProceedToCheckout = () => setOpenConfirmDialog(true);
const handleCancelConfirmation = () => setOpenConfirmDialog(false);

const handleConfirmAndOpenPayment = () => {
setOpenConfirmDialog(false);
if (orderTotal > walletBalance) {
setBalanceDialogOpen(true);
} else {
setShowPaymentScan(true);
}
};

// Ref for auto-redirect timer after payment success
// eslint-disable-next-line 
const paymentSuccessTimerRef = useRef(null);
// eslint-disable-next-line 
const [successCountdown, setSuccessCountdown] = useState(30);

const handlePaymentAuthorized = async (authData) => {
setShowPaymentScan(false);
setIsProcessing(true);
setPaymentError("");
try {
await new Promise((resolve) => setTimeout(resolve, 2000));
const response = await proceedToPay(user.id);
setPaymentData(response.data);
setIsProcessing(false);
setShowPaymentSuccess(true);
setSuccessCountdown(30);
if (typeof onPaymentSuccessShown === 'function') onPaymentSuccessShown();

// Auto-redirect to welcome kiosk page after 30 seconds
paymentSuccessTimerRef.current = setInterval(() => {
setSuccessCountdown((prev) => {
if (prev <= 1) {
clearInterval(paymentSuccessTimerRef.current);
paymentSuccessTimerRef.current = null;
handlePaymentSuccessClose();
return 0;
}
return prev - 1;
});
}, 1000);
} catch (err) {
setIsProcessing(false);
setPaymentError(
err?.response?.data?.error ||
err?.message ||
"Payment Failed. Please try again or contact support."
);
}
};

const handlePaymentSuccessClose = () => {
if (paymentSuccessTimerRef.current) {
clearInterval(paymentSuccessTimerRef.current);
paymentSuccessTimerRef.current = null;
}
setShowPaymentSuccess(false);
setPaymentData(null);
setIsProcessing(false);
setPaymentError("");
if (typeof onPaymentSuccessHidden === 'function') onPaymentSuccessHidden();
onLogout && onLogout();
};

const handlePaymentRetry = () => {
setPaymentError("");
setIsProcessing(false);
setShowPaymentScan(true);
};

const handlePaymentErrorClose = () => {
setPaymentError("");
setIsProcessing(false);
};

// FIX: Show loading spinner while fetching cart data
if (isLoading) {
return (
<Box
sx={{
bgcolor: "#FFFFFF",
minHeight: "100vh",
width: "100%",
display: "flex",
alignItems: "center",
justifyContent: "center"
}}
>
<CircularProgress sx={{ color: "#000048" }} />
</Box>
);
}

// FIX: Only show EmptyCartView AFTER loading is complete and cart is truly empty
// Do NOT show EmptyCartView during payment flow (processing, success, or error)
if (!isLoading && cart.length === 0 && !isProcessing && !showPaymentSuccess && !paymentError) {
return (
<EmptyCartView
user={user}
onLogout={onLogout}
/>
);
}

return (
<Box sx={{ bgcolor: "#FFFFFF", minHeight: "100vh", width: "100%" }}>
<AppHeader user={user} onLogout={onLogout} showWallet={false} />
<Box
sx={{
display: "flex",
flexDirection: { xs: "column", md: "row" },
mt: "60px",
}}
>
<Box
sx={{
flex: 1,
p: { xs: "16px", md: "40px" },
mr: { md: "427px" },
minHeight: "calc(100vh - 60px)",
overflow: "hidden",
}}
>
<Box
sx={{ display: "flex", alignItems: "center", mb: 4, gap: "16px" }}
>
<Box
component="img"
src="/logo/BoyLogo.png"
sx={{ width: "38px", height: "38px" }}
/>
<Typography
sx={{
fontFamily: "Gallix, sans-serif",
color: "#000048",
fontWeight: 600,
fontSize: { xs: "16px", md: "20px" },
}}
>
Welcome {user?.name || "User"} !
</Typography>
</Box>

{error && (
<Alert
severity="error"
sx={{ mb: 2, fontFamily: "Gallix, sans-serif" }}
>
{error}
</Alert>
)}
<Box
sx={{
display: "flex",
justifyContent: "space-between",
alignItems: "center",
mb: 3,
flexWrap: "wrap",
gap: 2,
}}
>
<Box
sx={{
display: "flex",
alignItems: "center",
gap: "12px",
ml: "auto",
pr: { xs: 2, md: 5 },
}}
>
<CartIcon />
<Typography
sx={{
fontFamily: "Gallix, sans-serif",
fontWeight: 500,
color: "#000048",
fontSize: { xs: "16px", md: "20px" },
}}
>
Total Item: {cart.length}
</Typography>
</Box>
</Box>

<Box
sx={{
display: { xs: "none", md: "flex" },
px: 2,
alignItems: "center",
}}
>
<Typography
sx={{
fontFamily: "Gallix, sans-serif",
flex: "1 1 45%",
fontWeight: 500,
color: "#000048",
fontSize: "17px",
}}
>
Product Detail
</Typography>
<Box
sx={{
flex: "1 1 45%",
display: "flex",
justifyContent: "flex-end",
gap: "16px",
}}
>
<Typography
sx={{
fontFamily: "Gallix, sans-serif",
width: "80px",
textAlign: "center",
fontWeight: 500,
fontSize: "17px",
color: "#000048",
}}
>
Quantity
</Typography>
<Typography
sx={{
fontFamily: "Gallix, sans-serif",
width: "80px",
textAlign: "center",
fontWeight: 500,
fontSize: "17px",
color: "#000048",
}}
>
Price
</Typography>
<Typography
sx={{
fontFamily: "Gallix, sans-serif",
width: "80px",
textAlign: "center",
fontWeight: 500,
fontSize: "17px",
color: "#000048",
}}
>
Subtotal
</Typography>
</Box>
</Box>
<Divider sx={{ display: { xs: "none", md: "block" } }} />
<List sx={{ p: 0 }}>
{cart.map((item) => (
<CartItemComponent key={item.id} cartItem={item} />
))}
</List>
</Box>

{/* Sidebar */}
<Box
sx={{
width: { xs: "100%", md: "427px" },
bgcolor: "#F2F2F2",
display: "flex",
flexDirection: "column",
p: 0,
position: { xs: "relative", md: "fixed" },
right: 0,
top: { md: "60px" },
height: { xs: "auto", md: "calc(100vh - 60px)" },
zIndex: 10,
}}
>
{/* Top Section: Summary Details */}
<Box sx={{ p: { xs: "16px", md: "24px" }, flexGrow: 1 }}>
<Typography
sx={{
fontFamily: "Gallix, sans-serif",
fontWeight: 500,
fontSize: { xs: "24px", md: "32px" },
color: "#000048",
}}
>
Order Summary
</Typography>
<Divider sx={{ borderColor: "#000048", mb: 2 }} />

<Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
<Typography sx={{ fontFamily: "Gallix, sans-serif", fontSize: '15px', color: "#000048" }}>
Subtotal
</Typography>
<Typography sx={{ fontFamily: "Gallix, sans-serif", fontWeight: 600, fontSize: '15px', color: "#000048" }}>
${currentTotal.toFixed(2)}
</Typography>
</Box>

<Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
<Typography sx={{ fontFamily: "Gallix, sans-serif", fontSize: '15px', color: "#000048" }}>
Tax (5%)
</Typography>
<Typography sx={{ fontFamily: "Gallix, sans-serif", fontWeight: 600, fontSize: '15px', color: "#000048" }}>
$2.50
</Typography>
</Box>

<Divider sx={{ my: 2 }} />

<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
<Typography sx={{ fontFamily: "Gallix, sans-serif", fontWeight: 600, fontSize: "20px", color: "#000048" }}>
Order Total
</Typography>
<Typography sx={{ fontFamily: "Gallix, sans-serif", fontWeight: 600, fontSize: "20px", color: "#000048" }}>
${orderTotal.toFixed(2)}
</Typography>
</Box>
</Box>

{/* Bottom Section: Wallet & Button (Pushed to bottom) */}
<Box sx={{ mt: "auto" }}>
{/* Wallet Balance Bar */}
<Box
sx={{
display: "flex",
justifyContent: "space-between",
alignItems: "center",
p: "16px 24px",
bgcolor: "#D9D9D9",
}}
>
<Box>
<Typography sx={{ fontSize: "12px", color: "#000048", opacity: 0.7 }}>Total Amount</Typography>
<Typography sx={{ fontWeight: 700, fontSize: "18px", color: "#000048" }}>${orderTotal.toFixed(2)}</Typography>
</Box>
<Box sx={{ textAlign: "right" }}>
<Typography sx={{ fontSize: "12px", color: "#000048", opacity: 0.7 }}>Wallet Balance</Typography>
<Typography
sx={{
fontWeight: 700,
fontSize: "18px",
color: walletBalance < orderTotal ? "#FF3B30" : "#2DB81F"
}}
>
${walletBalance.toFixed(2)}
</Typography>
</Box>
</Box>

{/* Proceed to Checkout Button */}
<Button
onClick={handleProceedToCheckout}
fullWidth
sx={{
height: "72px",
bgcolor: "#26EFE9",
color: "#000048",
borderRadius: 0,
fontWeight: 700,
fontSize: "20px",
textTransform: "none",
"&:hover": { bgcolor: "#1FD6D0" },
}}
>
Proceed to Checkout
</Button>
</Box>
</Box>
</Box>

{/* All Dialogs */}
<Dialog
open={openConfirmDialog}
onClose={handleCancelConfirmation}
PaperProps={{
sx: {
width: "766px",
maxWidth: "95%",
borderRadius: "8px",
p: { xs: "16px", md: "24px" },
background: "#FFFFFF",
},
}}
>
<DialogContent sx={{ p: 0 }}>
<Box
sx={{
display: "flex",
alignItems: "center",
justifyContent: "space-between",
mb: "12px",
}}
>
<Box sx={{ display: "flex", alignItems: "center" }}>
<Box
sx={{
width: "32px",
height: "32px",
mr: "12px",
display: "flex",
alignItems: "center",
justifyContent: "center",
bgcolor: "#000048",
borderRadius: "50%",
}}
>
<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
<path
d="M25.3335 16L17.3335 24L15.4668 22.1333L21.5668 16L15.4668 9.86667L17.3335 8L25.3335 16ZM17.3335 16L9.33346 24L7.4668 22.1333L13.5668 16L7.4668 9.86667L9.33346 8L17.3335 16Z"
fill="white"
/>
</svg>
</Box>
<Typography
sx={{
fontFamily: "Gallix, sans-serif",
fontWeight: 500,
fontSize: { xs: "18px", md: "24px" },
color: "#000048",
}}
>
Confirm Items
</Typography>
</Box>
<IconButton onClick={handleCancelConfirmation} sx={{ p: 0 }}>
<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.113 8.99872L17.5567 2.56902C17.8389 2.2868 17.9974 1.90402 17.9974 1.5049C17.9974 1.10577 17.8389 0.722997 17.5567 0.440774C17.2745 0.158551 16.8918 0 16.4928 0C16.0937 0 15.711 0.158551 15.4288 0.440774L9 6.88546L2.57121 0.440774C2.28903 0.158551 1.90631 -2.9737e-09 1.50724 0C1.10817 2.9737e-09 0.725452 0.158551 0.443269 0.440774C0.161086 0.722997 0.00255743 1.10577 0.00255743 1.5049C0.00255743 1.90402 0.161086 2.2868 0.443269 2.56902L6.88704 8.99872L0.443269 15.4284C0.302812 15.5678 0.191329 15.7335 0.115249 15.9162C0.0391699 16.0988 0 16.2947 0 16.4925C0 16.6904 0.0391699 16.8863 0.115249 17.0689C0.191329 17.2516 0.302812 17.4173 0.443269 17.5567C0.582579 17.6971 0.74832 17.8086 0.930933 17.8847C1.11355 17.9608 1.30941 18 1.50724 18C1.70507 18 1.90094 17.9608 2.08355 17.8847C2.26616 17.8086 2.4319 17.6971 2.57121 17.5567L9 11.112L15.4288 17.5567C15.5681 17.6971 15.7338 17.8086 15.9165 17.8847C16.0991 17.9608 16.2949 18 16.4928 18C16.6906 18 16.8865 17.9608 17.0691 17.8847C17.2517 17.8086 17.4174 17.6971 17.5567 17.5567C17.6972 17.4173 17.8087 17.2516 17.8848 17.0689C17.9608 16.8863 18 16.6904 18 16.4925C18 16.2947 17.9608 16.0988 17.8848 15.9162C17.8087 15.7335 17.6972 15.5678 17.5567 15.4284L11.113 8.99872Z" fill="#000048" />
</svg>
</IconButton>
</Box>
<Box sx={{ width: "100%", height: "1px", mb: "20px", bgcolor: "#000048" }} />
<Typography
sx={{
fontFamily: "Gallix, sans-serif",
fontSize: { xs: "14px", md: "17px" },
color: "#000048",
mb: "32px",
}}
>
Please verify the total items and order amount before proceeding.
</Typography>
<Box
sx={{
display: "flex",
gap: { xs: "12px", md: "21px" },
mb: { xs: "24px", md: "48px" },
justifyContent: "center",
flexWrap: "wrap",
}}
>
<Box sx={summaryBoxStyle}>
<Typography sx={summaryLabelStyle}>Total items</Typography>
<Typography sx={summaryValueStyle}>{cart.length}</Typography>
</Box>
<Box sx={summaryBoxStyle}>
<Typography sx={summaryLabelStyle}>Order Total</Typography>
<Typography sx={summaryValueStyle}>
${orderTotal.toFixed(2)}
</Typography>
</Box>
</Box>
<Box sx={{ display: "flex", gap: { xs: "16px", md: "32px" }, justifyContent: "center", flexWrap: "wrap" }}>
<Button onClick={handleCancelConfirmation} sx={outlineButtonStyle}>
Review Cart
</Button>
<Button
onClick={handleConfirmAndOpenPayment}
variant="contained"
sx={containedButtonStyle}
>
Confirm & Checkout
</Button>
</Box>
</DialogContent>
</Dialog>

<Dialog
open={showPaymentScan}
onClose={() => setShowPaymentScan(false)}
maxWidth="md"
fullWidth
PaperProps={{ sx: { borderRadius: "16px", overflow: "hidden" } }}
>
<DialogContent sx={{ p: 0 }}>
<PaymentScan
onAuthorized={handlePaymentAuthorized}
onClose={() => setShowPaymentScan(false)}
/>
</DialogContent>
</Dialog>

<Dialog
open={isProcessing}
PaperProps={{
sx: {
borderRadius: "16px",
overflow: "hidden",
minWidth: { xs: "90%", md: "400px" },
},
}}
>
<DialogContent sx={{ p: 0 }}>
<Box
sx={{
display: "flex",
flexDirection: "column",
alignItems: "center",
justifyContent: "center",
height: "300px",
bgcolor: "#FFFFFF",
gap: 3,
p: 4,
}}
>
<CircularProgress sx={{ color: "#000048" }} size={70} />
<Typography
sx={{
fontFamily: "Gallix, sans-serif",
fontSize: { xs: "18px", md: "24px" },
fontWeight: 600,
color: "#000048",
textAlign: "center",
}}
>
Payment Processing...
</Typography>
<Typography
sx={{
fontFamily: "Gallix, sans-serif",
fontSize: { xs: "14px", md: "16px" },
color: "#5C5C5C",
textAlign: "center",
}}
>
Please wait while processing your payment.
</Typography>
</Box>
</DialogContent>
</Dialog>

<Dialog
open={showPaymentSuccess}
onClose={handlePaymentSuccessClose}
PaperProps={{
sx: {
width: "766px",
maxWidth: "95%",
borderRadius: "8px",
border: "1px solid #000048",
overflow: "hidden",
},
}}
>
<DialogContent sx={{ p: { xs: "12px 16px 24px", md: "12px 24px 42px 24px" } }}>
<Box
sx={{
display: "flex",
alignItems: "center",
justifyContent: "space-between",
mb: 1,
}}
>
<Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
fontSize: { xs: "18px", md: "24px" },
color: "#000048",
}}
>
Payment Successful
</Typography>
</Box>
<IconButton onClick={handlePaymentSuccessClose}>
<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.113 8.99872L17.5567 2.56902C17.8389 2.2868 17.9974 1.90402 17.9974 1.5049C17.9974 1.10577 17.8389 0.722997 17.5567 0.440774C17.2745 0.158551 16.8918 0 16.4928 0C16.0937 0 15.711 0.158551 15.4288 0.440774L9 6.88546L2.57121 0.440774C2.28903 0.158551 1.90631 -2.9737e-09 1.50724 0C1.10817 2.9737e-09 0.725452 0.158551 0.443269 0.440774C0.161086 0.722997 0.00255743 1.10577 0.00255743 1.5049C0.00255743 1.90402 0.161086 2.2868 0.443269 2.56902L6.88704 8.99872L0.443269 15.4284C0.302812 15.5678 0.191329 15.7335 0.115249 15.9162C0.0391699 16.0988 0 16.2947 0 16.4925C0 16.6904 0.0391699 16.8863 0.115249 17.0689C0.191329 17.2516 0.302812 17.4173 0.443269 17.5567C0.582579 17.6971 0.74832 17.8086 0.930933 17.8847C1.11355 17.9608 1.30941 18 1.50724 18C1.70507 18 1.90094 17.9608 2.08355 17.8847C2.26616 17.8086 2.4319 17.6971 2.57121 17.5567L9 11.112L15.4288 17.5567C15.5681 17.6971 15.7338 17.8086 15.9165 17.8847C16.0991 17.9608 16.2949 18 16.4928 18C16.6906 18 16.8865 17.9608 17.0691 17.8847C17.2517 17.8086 17.4174 17.6971 17.5567 17.5567C17.6972 17.4173 17.8087 17.2516 17.8848 17.0689C17.9608 16.8863 18 16.6904 18 16.4925C18 16.2947 17.9608 16.0988 17.8848 15.9162C17.8087 15.7335 17.6972 15.5678 17.5567 15.4284L11.113 8.99872Z" fill="#000048" />
</svg>
</IconButton>
</Box>
<Divider sx={{ borderColor: "#000048", mb: 3 }} />
<Box
sx={{
display: "flex",
flexDirection: "column",
alignItems: "center",
gap: "24px",
py: 3,
}}
>
<Box
sx={{
width: { xs: 60, md: 82 },
height: { xs: 60, md: 82 },
borderRadius: "50%",
bgcolor: "#2DB81F",
display: "flex",
alignItems: "center",
justifyContent: "center",
}}
>
<CheckCircleIcon sx={{ color: "#FFFFFF", fontSize: { xs: 36, md: 49 } }} />
</Box>
<Box sx={{ textAlign: "center" }}>
<Typography
sx={{
fontFamily: "Gallix, sans-serif",
fontSize: { xs: "14px", md: "17px" },
color: "#000048",
mb: 1,
whiteSpace: 'nowrap',
}}
>
Your payment of{" "}
<Typography component="span" sx={summaryValueStyle}>
${orderTotal.toFixed(2)}
</Typography>{" "}
has been completed.
</Typography>
<Typography
sx={{
fontFamily: "Gallix, sans-serif",
fontSize: { xs: "12px", md: "15px" },
color: "#000048",
}}
>
A receipt has been sent to your linked email-id.
</Typography>
</Box>
<Typography
sx={{
fontFamily: "Gallix, sans-serif",
fontWeight: 600,
fontSize: { xs: "16px", md: "20px" },
color: "#000048",
}}
>
Thank you for shopping with us!
</Typography>
</Box>
</DialogContent>
</Dialog>

{paymentError && (
<PaymentFailed
open={Boolean(paymentError)}
onClose={handlePaymentErrorClose}
onRetry={handlePaymentRetry}
onExit={onLogout}
/>
)}

<Dialog
open={balanceDialogOpen}
onClose={() => setBalanceDialogOpen(false)}
PaperProps={{
sx: {
width: "766px",
maxWidth: "95%",
borderRadius: "8px",
overflow: "hidden",
},
}}
>
<DialogContent sx={{ p: { xs: "12px 16px", md: "12px 24px 24px 24px" } }}>
<Box
sx={{
display: "flex",
alignItems: "center",
justifyContent: "space-between",
mb: "12px",
}}
>
<Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
<Box
sx={{
width: 28,
height: 28,
borderRadius: "50%",
bgcolor: "#000048",
display: "flex",
alignItems: "center",
justifyContent: "center",
}}
>
<AccountBalanceWalletIcon sx={{ color: "#fff", fontSize: 18 }} />
</Box>
<Typography
sx={{
fontFamily: "Gallix, sans-serif",
fontWeight: 500,
fontSize: { xs: "16px", md: "24px" },
color: "#000048",
}}
>
Topup - Insufficient Wallet Balance
</Typography>
</Box>
<IconButton onClick={() => setBalanceDialogOpen(false)}>
<CloseIcon sx={{ color: "#000048" }} />
</IconButton>
</Box>
<Divider sx={{ borderColor: "#000048", mb: "18px" }} />
<Typography
sx={{
fontFamily: "Gallix, sans-serif",
color: "#000048",
fontSize: { xs: "14px", md: "17px" },
mb: 2,
}}
>
Low wallet balance detected. Top up your wallet to keep shopping.
</Typography>
<Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
<Typography
sx={{
fontFamily: "Gallix, sans-serif",
fontSize: "14px",
color: "#5C5C5C",
}}
>
Wallet Balance: ${walletBalance.toFixed(2)}
</Typography>
<Typography
sx={{
fontFamily: "Gallix, sans-serif",
fontSize: "14px",
color: "#000048",
}}
>
Order Total: ${orderTotal.toFixed(2)}
</Typography>
<Typography
sx={{
fontFamily: "Gallix, sans-serif",
fontWeight: 600,
fontSize: { xs: "16px", md: "20px" },
color: "#000048",
}}
>
Additional Required: ${additionalRequired}
</Typography>
</Box>
</DialogContent>
</Dialog>

{/* RFID AUTO-REMOVE: Item Removed Popup Dialog */}
<Dialog
open={showItemRemovedDialog}
onClose={() => setShowItemRemovedDialog(false)}
PaperProps={{
sx: {
width: "520px",
maxWidth: "95%",
borderRadius: "8px",
overflow: "hidden",
background: "#FFFFFF",
},
}}
>
<DialogContent sx={{ p: { xs: "16px", md: "24px" } }}>
{/* Header: Trash Icon + Title + Close Button */}
<Box
sx={{
display: "flex",
alignItems: "center",
justifyContent: "space-between",
mb: "12px",
}}
>
<Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
<Box
sx={{
width: 32,
height: 32,
borderRadius: "50%",
bgcolor: "#000048",
display: "flex",
alignItems: "center",
justifyContent: "center",
}}
>
<DeleteOutlineIcon sx={{ color: "#FFFFFF", fontSize: 18 }} />
</Box>
<Typography
sx={{
fontFamily: "Gallix, sans-serif",
fontWeight: 500,
fontSize: { xs: "18px", md: "24px" },
color: "#000048",
}}
>
Item Removed
</Typography>
</Box>
<IconButton onClick={() => setShowItemRemovedDialog(false)} sx={{ p: 0 }}>
<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.113 8.99872L17.5567 2.56902C17.8389 2.2868 17.9974 1.90402 17.9974 1.5049C17.9974 1.10577 17.8389 0.722997 17.5567 0.440774C17.2745 0.158551 16.8918 0 16.4928 0C16.0937 0 15.711 0.158551 15.4288 0.440774L9 6.88546L2.57121 0.440774C2.28903 0.158551 1.90631 -2.9737e-09 1.50724 0C1.10817 2.9737e-09 0.725452 0.158551 0.443269 0.440774C0.161086 0.722997 0.00255743 1.10577 0.00255743 1.5049C0.00255743 1.90402 0.161086 2.2868 0.443269 2.56902L6.88704 8.99872L0.443269 15.4284C0.302812 15.5678 0.191329 15.7335 0.115249 15.9162C0.0391699 16.0988 0 16.2947 0 16.4925C0 16.6904 0.0391699 16.8863 0.115249 17.0689C0.191329 17.2516 0.302812 17.4173 0.443269 17.5567C0.582579 17.6971 0.74832 17.8086 0.930933 17.8847C1.11355 17.9608 1.30941 18 1.50724 18C1.70507 18 1.90094 17.9608 2.08355 17.8847C2.26616 17.8086 2.4319 17.6971 2.57121 17.5567L9 11.112L15.4288 17.5567C15.5681 17.6971 15.7338 17.8086 15.9165 17.8847C16.0991 17.9608 16.2949 18 16.4928 18C16.6906 18 16.8865 17.9608 17.0691 17.8847C17.2517 17.8086 17.4174 17.6971 17.5567 17.5567C17.6972 17.4173 17.8087 17.2516 17.8848 17.0689C17.9608 16.8863 18 16.6904 18 16.4925C18 16.2947 17.9608 16.0988 17.8848 15.9162C17.8087 15.7335 17.6972 15.5678 17.5567 15.4284L11.113 8.99872Z" fill="#000048"/>
</svg>
</IconButton>
</Box>

{/* Divider */}
<Box sx={{ width: "100%", height: "1px", bgcolor: "#000048", mb: "20px" }} />

{/* Message: which item was removed */}
<Typography
sx={{
fontFamily: "Gallix, sans-serif",
fontSize: { xs: "14px", md: "17px" },
color: "#000048",
mb: "32px",
}}
>
{removedItemName} is removed from your cart.
</Typography>

{/* Continue Shopping Button */}
<Box sx={{ display: "flex", justifyContent: "center" }}>
<Button
onClick={() => setShowItemRemovedDialog(false)}
variant="contained"
sx={{
width: { xs: "200px", md: "276px" },
height: { xs: "48px", md: "56px" },
borderRadius: "8px",
bgcolor: "#000048",
fontFamily: "Gallix, sans-serif",
fontWeight: 600,
fontSize: { xs: "14px", md: "20px" },
color: "#FFFFFF",
textTransform: "none",
"&:hover": { bgcolor: "#000060" },
}}
>
Continue Shopping
</Button>
</Box>
</DialogContent>
</Dialog>
</Box>
);
};

const summaryBoxStyle = {
width: { xs: "140px", md: "194px" },
height: { xs: "80px", md: "100px" },
display: "flex",
flexDirection: "column",
alignItems: "center",
justifyContent: "center",
borderRadius: "4px",
border: "1px solid #EAEAEA",
background: "#FFFFFF",
boxShadow: "0px 4px 4px 0px #F4F4F4",
};

const summaryLabelStyle = {
fontFamily: "Gallix, sans-serif",
fontSize: { xs: "14px", md: "20px" },
color: "#000048",
mb: 0.5,
};

const summaryValueStyle = {
fontFamily: "Gallix, sans-serif",
fontWeight: 600,
fontSize: { xs: "16px", md: "20px" },
color: "#000048",
};

const outlineButtonStyle = {
width: { xs: "140px", md: "276px" },
height: { xs: "48px", md: "56px" },
borderRadius: "8px",
border: "1px solid #000048",
fontFamily: "Gallix, sans-serif",
fontWeight: 600,
fontSize: { xs: "14px", md: "20px" },
color: "#000048",
textTransform: "none",
};

const containedButtonStyle = {
width: { xs: "140px", md: "276px" },
height: { xs: "48px", md: "56px" },
borderRadius: "8px",
bgcolor: "#000048",
fontFamily: "Gallix, sans-serif",
fontWeight: 600,
fontSize: { xs: "14px", md: "20px" },
color: "#FFFFFF",
textTransform: "none",
"&:hover": { bgcolor: "#000048" },
};

export default ShoppingHandheld;

