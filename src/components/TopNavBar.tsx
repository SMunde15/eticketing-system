import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const TopNavBar: React.FC = () => {
  const { userRole, logout } = useAuth();
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "";
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    logout();
    navigate("/");
  };

  useEffect(() => {
    console.log("TopNavBar userRole:", userRole);
  }, [userRole]);

  return (
    <AppBar position="static" sx={{ bgcolor: "background.paper", color: "text.primary" }}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          component={Link}
          to="/dashboard"
        >
          <HomeIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Train Booking Dashboard
        </Typography>
        <Box sx={{ display: { xs: "block", sm: "block" } }}>
          <IconButton
            size="large"
            aria-label="checkout"
            color="inherit"
            component={Link}
            to="/checkout"
          >
            Checkout
          </IconButton>
          <IconButton
            size="large"
            aria-label="bookings"
            color="inherit"
            component={Link}
            to="/bookings"
          >
            Bookings
          </IconButton>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircleIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose} component={Link} to="/profile">
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
        <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}>
          <Typography variant="body1" sx={{ mr: 2 }}>
            {userEmail}
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            {userRole === "admin" ? "Admin" : "User"}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavBar;
