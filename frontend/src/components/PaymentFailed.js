// import React from 'react';
// import { Box, Typography, IconButton, Button } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';

// const PaymentFailed = ({ open, onClose, onRetry, onExit }) => {
//   if (!open) return null;

//   return (
//     <>
//       {/* Fixed backdrop so popup stays visible (no scrolling) */}
//       <Box sx={{ position: 'fixed', inset: 0, bgcolor: 'rgba(0,0,0,0.45)', zIndex: 1300 }} />

//       {/* Popup box centered horizontally within the viewport (fixed) */}
//       <Box
//         role="dialog"
//         aria-modal="true"
//         aria-labelledby="payment-failed-title"
//         aria-describedby="payment-failed-description"
//         sx={{
//           position: 'fixed',
//           top: '178.49px',
//           left: '50%',
//           transform: 'translateX(-50%)',
//           width: '766px',
//           height: '351.011444px',
//           bgcolor: '#FFFFFF',
//           borderRadius: '8px',
//           boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
//           border: '1px solid #000048',
//           zIndex: 1400,
//           p: '12px 24px 42px 24px',
//           display: 'flex',
//           flexDirection: 'column',
//           justifyContent: 'flex-start',
//           overflow: 'hidden'
//         }}
//       >
//         {/* Header */}
//         <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', height: '40px' }}>
//             {/* Navy circle with icon (to match Figma header style) */}
//             <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#000048', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//               <CloseIcon sx={{ color: '#FFFFFF', fontSize: 20 }} />
//             </Box>

//             <Typography id="payment-failed-title" sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: '24px', color: '#000048' }}>
//               Payment Failed
//             </Typography>
//           </Box>

//           {/* Close (top-right) */}
//           <IconButton onClick={onExit || onClose} sx={{ width: 40, height: 40 }} aria-label="close">
//             <CloseIcon sx={{ color: '#000048', fontSize: 18 }} />
//           </IconButton>
//         </Box>

//         {/* Separator */}
//         <Box sx={{ width: '100%', borderBottom: '1px solid #000048', mt: 1 }} />

//         {/* Content area: centered red cross, messages and retry button */}
//         <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
//           {/* Red circle with white X (as in the screenshot) */}
//           <Box sx={{ width: 82, height: 82, borderRadius: '50%', bgcolor: '#E53935', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//             <CloseIcon sx={{ color: '#FFFFFF', fontSize: 49 }} />
//           </Box>

//           {/* Messages */}
//           <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
//             <Typography id="payment-failed-description" sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: '17px', color: '#000048', textAlign: 'center' }}>
//               Your payment could not be processed.
//             </Typography>
//             <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: '15px', color: '#000048', textAlign: 'center' }}>
//               Please try again or use a different payment method.
//             </Typography>
//           </Box>

//           {/* Retry button */}
//           <Button
//             variant="contained"
//             onClick={onRetry}
//             sx={{
//               mt: 1,
//               bgcolor: '#000048',
//               color: '#FFFFFF',
//               fontFamily: 'Poppins, sans-serif',
//               fontWeight: 600,
//               fontSize: '16px',
//               textTransform: 'none',
//               px: 4,
//               py: 1.25,
//               borderRadius: '8px',
//               '&:hover': { bgcolor: '#0a0a64' }
//             }}
//           >
//             Retry
//           </Button>
//         </Box>
//       </Box>
//     </>
//   );
// };

// export default PaymentFailed;
