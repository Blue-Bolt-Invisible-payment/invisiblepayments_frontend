import React from 'react';
import { Box, Typography, IconButton, Button, Modal } from '@mui/material';

const PaymentFailed = ({ open, onClose, onRetry }) => {
  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box
        sx={{
          width: '766px',
          height: '415.01px',
          bgcolor: '#FFFFFF',
          borderRadius: '8px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          radius:'8px',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '12px 24px 60px 24px', // padding-top: 12, left/right: 24, bottom: 60
          position: 'relative',
          gap: '32px',
          outline: 'none',
        }}
      >
        {/* --- Header Section --- */}
        <Box
          sx={{
            width: '718px',
            height: '52px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #000048', // The x vector background line
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Thumbs Down Icon */}
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="20" fill="#000048" />
              <path d="M29.3017 23.4256C29.0207 23.7629 28.669 24.0345 28.2716 24.2211C27.8741 24.4077 27.4406 24.5048 27.0015 24.5056H22.4411L23.0011 25.9356C23.2341 26.5617 23.3117 27.235 23.2272 27.8977C23.1428 28.5603 22.8988 29.1926 22.5163 29.7403C22.1337 30.288 21.624 30.7348 21.0309 31.0422C20.4378 31.3497 19.7789 31.5087 19.1108 31.5056C18.9184 31.5052 18.7302 31.4493 18.5688 31.3446C18.4074 31.24 18.2796 31.091 18.2007 30.9156L15.3505 24.5056H13.0003C12.2045 24.5056 11.4414 24.1895 10.8788 23.6269C10.3161 23.0643 10 22.3012 10 21.5056V14.5056C10 13.71 10.3161 12.9469 10.8788 12.3843C11.4414 11.8217 12.2045 11.5056 13.0003 11.5056H25.7314C26.4332 11.5058 27.1128 11.7521 27.6519 12.2016C28.1909 12.6511 28.5553 13.2753 28.6816 13.9656L29.9517 20.9656C30.0303 21.3982 30.0128 21.8428 29.9005 22.2679C29.7881 22.693 29.5837 23.0882 29.3017 23.4256ZM15.0004 13.5056H13.0003C12.735 13.5056 12.4806 13.611 12.2931 13.7985C12.1055 13.986 12.0002 14.2404 12.0002 14.5056V21.5056C12.0002 21.7708 12.1055 22.0252 12.2931 22.2127C12.4806 22.4002 12.735 22.5056 13.0003 22.5056H15.0004V13.5056ZM28.0016 21.3256L26.7315 14.3256C26.6889 14.0927 26.565 13.8824 26.3818 13.7322C26.1987 13.582 25.9682 13.5017 25.7314 13.5056H17.0006V23.2956L19.7208 29.4156C20.0009 29.3339 20.2609 29.1952 20.4846 29.008C20.7082 28.8208 20.8907 28.5893 21.0204 28.3281C21.15 28.0669 21.2242 27.7816 21.238 27.4903C21.2519 27.199 21.2052 26.9079 21.101 26.6356L20.5709 25.2056C20.458 24.9033 20.4198 24.5782 20.4598 24.2581C20.4997 23.9379 20.6165 23.6321 20.8003 23.3668C20.984 23.1016 21.2292 22.8847 21.5149 22.7348C21.8006 22.5848 22.1184 22.5062 22.4411 22.5056H27.0015C27.1484 22.5058 27.2936 22.4737 27.4267 22.4115C27.5598 22.3493 27.6775 22.2585 27.7715 22.1456C27.8679 22.0343 27.9385 21.903 27.9782 21.7613C28.018 21.6196 28.026 21.4708 28.0016 21.3256Z" fill="white" />
            </svg>
            <Typography
              sx={{
                fontFamily: "Gallix, sans-serif",
                fontWeight: 500,
                fontSize: '24px',
                lineHeight: '100%',
                letterSpacing: '-3%',
                color: '#000048',
              }}
            >
              Payment Failed
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ width: '18px', height: '18px', color: '#000048' }}>
            {/* Close Vector (X) */}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.5 4.5L4.5 13.5" stroke="#000048" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4.5 4.5L13.5 13.5" stroke="#000048" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </IconButton>
        </Box>

        {/* --- Red Cross Icon Section --- */}
        <Box sx={{ width: '82px', height: '82px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="82" height="82" viewBox="0 0 82 82" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="41" cy="41" r="41" fill="#F60017" />
            {/* White X inside Red Circle */}
            <path d="M51 31L31 51" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M31 31L51 51" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Box>

        {/* --- Text Content Section --- */}
        <Box sx={{ width: '702px', display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center' }}>
          <Typography
            sx={{
              fontFamily: "Gallix, sans-serif",
              fontWeight: 400,
              fontSize: '17px',
              lineHeight: '100%',
              letterSpacing: '-3%',
              textAlign: 'center',
              color: '#000048',
              width: '702px',
              height: '26px',
            }}
          >
            Your payment could not be processed.
          </Typography>
          <Typography
            sx={{
              fontFamily: "Gallix, sans-serif",
              fontWeight: 400,
              fontSize: '17px',
              lineHeight: '100%',
              letterSpacing: '-3%',
              textAlign: 'center',
              color: '#000048',
              width: '702px',
              height: '26px',
            }}
          >
            Please try again or use a different payment method.
          </Typography>
        </Box>

        {/* --- Retry Button Section --- */}
        <Button
          onClick={onRetry}
          variant="contained"
          sx={{
            width: '178px',
            height: '56px',
            bgcolor: '#000048',
            borderRadius: '8px',
            textTransform: 'none',
            '&:hover': { bgcolor: '#000066' },
            padding: '8px 16px', // Balanced padding for the "Retry" text
          }}
        >
          <Typography
            sx={{
              fontFamily: "Gallix, sans-serif",
              fontWeight: 600,
              fontSize: '20px',
              lineHeight: '100%',
              letterSpacing: '-3%',
              color: '#FFFFFF',
            }}
          >
            Retry
          </Typography>
        </Button>
      </Box>
    </Modal>
  );
};

export default PaymentFailed;