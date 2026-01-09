import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Avatar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLogout } from "../utils/logout"; // logout hook accepts a callback

const AppHeader = ({ user, onLogout, showWallet }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const logout = useLogout(onLogout); // provide resetSession from App

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <>
      {/* Header */}
      <AppBar
        position="fixed"
        sx={{
          width: "100%",
          height: "60px",
          bgcolor: "#000048",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <Box
          component="img"
          src="/logo/smartpayLogo.png"
          sx={{
            width: 207,
            height: 138,
            position: "absolute",
            top: -38,
            left: -3,
          }}
        />
        {/*Wallet Balance showing*/}
        {/* Wallet Balance - Logic: only shows when showWallet is true */}
        {showWallet && (
          <Box
            sx={{
              position: "absolute",
              right: "20px",
              display: "flex",
              alignItems: "center", // Centers SVG and Text horizontally relative to each other
              gap: "12px",
              height: "100%", // Takes full height of header to allow alignment
            }}
          >
            <svg
              width="24"
              height="21"
              viewBox="0 0 24 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.4187 0C21.5573 0 24 2.31536 24 6.27877H18.9227V6.31921C16.5663 6.31921 14.656 8.1299 14.656 10.3635C14.656 12.5971 16.5663 14.4078 18.9227 14.4078H24V14.7718C24 18.6846 21.5573 21 17.4187 21H6.58133C2.44267 21 0 18.6846 0 14.7718V6.22821C0 2.31536 2.44267 0 6.58133 0H17.4187ZM23.104 8.01781C23.5988 8.01781 24 8.39806 24 8.86712V11.8195C23.9942 12.2862 23.5964 12.6633 23.104 12.6688H19.0187C17.8257 12.684 16.7826 11.9098 16.512 10.8084C16.3765 10.1247 16.5667 9.41916 17.0317 8.88092C17.4967 8.34268 18.1888 8.02675 18.9227 8.01781H23.104ZM19.4987 9.38276H19.104C18.8617 9.38006 18.6283 9.46941 18.456 9.63088C18.2836 9.79234 18.1867 10.0125 18.1867 10.2422C18.1866 10.7241 18.5957 11.1163 19.104 11.1218H19.4987C20.0053 11.1218 20.416 10.7325 20.416 10.2523C20.416 9.77206 20.0053 9.38276 19.4987 9.38276ZM12.4587 4.53972H5.68533C5.18284 4.53969 4.77384 4.92286 4.768 5.39913C4.768 5.88102 5.17698 6.27323 5.68533 6.27877H12.4587C12.9653 6.27877 13.376 5.88947 13.376 5.40924C13.376 4.92902 12.9653 4.53972 12.4587 4.53972Z"
                fill="white"
              />
            </svg>

            <Typography
              sx={{
                fontFamily: "Gallix, sans-serif",
                fontWeight: 500,
                fontSize: "20px",
                color: "#FFFFFF",
              }}
            >
              Wallet Balance : $ {user?.walletBalance || 0}
            </Typography>
          </Box>
        )}
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        anchor="right"
        open={sidebarOpen}
        onClose={toggleSidebar}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "260px", sm: "300px", md: "340px", lg: "360px" },
            bgcolor: "#f5f5f5",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          },
        }}
      >
        <Box sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
          {/* Close Button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mb: { xs: 1.5, sm: 2 },
            }}
          >
            <IconButton
              onClick={toggleSidebar}
              sx={{ color: "#000048", p: { xs: 0.5, sm: 1 } }}
            >
              <CloseIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
          </Box>

          {/* Profile Section */}

          <Typography
            variant="h6"
            sx={{
              fontFamily: "Gallix, sans-serif",
              color: "#000048",
              fontWeight: "bold",
              mb: 0.5,
              fontSize: { xs: "1rem", sm: "1.15rem", md: "1.25rem" },
            }}
          >
            {user.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "Gallix, sans-serif",
              color: "#000048",
              opacity: 0.7,
              fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.875rem" },
            }}
          >
            {user.email}
          </Typography>

          <Divider sx={{ mb: { xs: 2, sm: 2.5, md: 3 } }} />

          {/* Wallet Balance */}
          <List>
            <ListItem
              sx={{
                bgcolor: "#000048",
                color: "#ffffff",
                borderRadius: { xs: 1.5, sm: 2 },
                mb: 2,
                p: { xs: 1.5, sm: 2 },
              }}
            >
              <ListItemIcon sx={{ minWidth: { xs: 40, sm: 48, md: 56 } }}>
                <AccountBalanceWalletIcon
                  sx={{
                    color: "#ffffff",
                    fontSize: { xs: 20, sm: 24, md: 28 },
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    sx={{
                      fontFamily: "Gallix, sans-serif",
                      fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
                      opacity: 0.9,
                    }}
                  >
                    Wallet Balance
                  </Typography>
                }
                secondary={
                  <Typography
                    sx={{
                      fontFamily: "Gallix, sans-serif",
                      color: "#ffffff",
                      fontWeight: "bold",
                      fontSize: {
                        xs: "1.2rem",
                        sm: "1.35rem",
                        md: "1.5rem",
                        lg: "1.65rem",
                      },
                      mt: 0.5,
                    }}
                  >
                    ₹{user.walletBalance?.toFixed(2) || "0.00"}
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </Box>

        {/* Logout Button at Bottom */}
        <Box sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
          <ListItem
            button
            onClick={logout}
            sx={{
              bgcolor: "#000048",
              color: "#ffffff",
              borderRadius: { xs: 1.5, sm: 2 },
              p: { xs: 1.5, sm: 2 },
              justifyContent: "flex-start",
              // prevent hover/active color changes
              "&:hover": {
                bgcolor: "#000048",
                color: "#ffffff",
              },
              "&.Mui-focusVisible": {
                bgcolor: "#000048",
                color: "#ffffff",
              },
              "&.Mui-selected": {
                bgcolor: "#000048",
                color: "#ffffff",
              },
              "&:active": {
                bgcolor: "#000048",
                color: "#ffffff",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: { xs: 40, sm: 48, md: 56 } }}>
              <LogoutIcon
                sx={{ color: "#ffffff", fontSize: { xs: 20, sm: 24, md: 28 } }}
              />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  sx={{
                    fontFamily: "Gallix, sans-serif",
                    fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
                    fontWeight: "bold",
                    color: "#ffffff",
                  }}
                >
                  Logout
                </Typography>
              }
            />
          </ListItem>
        </Box>
      </Drawer>
    </>
  );
};

export default AppHeader;
