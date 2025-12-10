import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  InputBase,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import logo from "../assets/logo.png";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const Header = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { cart } = useCart();
  const { user, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
    }
  };

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const handleProfileClick = (e) => {
    setAnchorEl(e.currentTarget);
    setShowSearch(false);
    setDrawerOpen(false);
  };
  const handleProfileClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    handleProfileClose();
    try {
      await logout();
      toast.success("You have been logged out!");
      navigate("/");
    } catch {
      toast.error("Error logging out. Try again!");
    }
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Shop", path: "/shop" },
    { label: "Contact", path: "/contact" },
  ];

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AppBar
      position="sticky"
      elevation={4}
      sx={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(12px)",
        color: theme.palette.text.primary,
        zIndex: 1200,
        top: 0,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, md: 6 },
          py: 1.2,
        }}
      >
        {/* ✅ Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            gap: "10px",
          }}
        >
          <Box component="img" src={logo} alt="ShopSense" sx={{ height: 60 }} />
          
        </motion.div>

        {/* ✅ Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Search Bar */}
            <Box
              component="form"
              onSubmit={handleSearch}
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.05)",
                borderRadius: "30px",
                px: 2,
                py: 0.5,
                width: "280px",
                transition: "0.3s ease",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.1)" },
              }}
            >
              <SearchIcon sx={{ color: "text.secondary" }} />
              <InputBase
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ ml: 1, flex: 1, fontSize: 15 }}
              />
            </Box>

            {navItems.map((item) => (
              <Button
                key={item.label}
                color="primary"
                onClick={() => navigate(item.path)}
                sx={{
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": { color: theme.palette.secondary.main },
                }}
              >
                {item.label}
              </Button>
            ))}

            {/* Cart */}
            <motion.div whileHover={{ scale: 1.1 }}>
              <IconButton color="primary" onClick={() => navigate("/cart")}>
                <Badge
                  badgeContent={totalCartItems}
                  color="secondary"
                  overlap="circular"
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: "0.7rem",
                      height: 18,
                      minWidth: 18,
                      top: 6,
                      right: 6,
                    },
                  }}
                >
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </motion.div>

            {/* ✅ Profile Avatar (Desktop + Mobile Shared) */}
            {user ? (
              <>
                <IconButton onClick={handleProfileClick}>
                  <Avatar
                    alt={user.username}
                    src={user.avatar || ""}
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: "primary.main",
                    }}
                  >
                    {user.username?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </>
            ) : (
              <Button
                variant="outlined"
                onClick={() => navigate("/login")}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Login
              </Button>
            )}
          </Box>
        )}

        {/* ✅ Mobile Navigation */}
        {isMobile && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton color="primary" onClick={() => setShowSearch(!showSearch)}>
              <SearchIcon />
            </IconButton>

            <IconButton color="primary" onClick={() => navigate("/cart")}>
              <Badge
                badgeContent={totalCartItems}
                color="secondary"
                overlap="circular"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: "0.7rem",
                    height: 16,
                    minWidth: 16,
                    top: 6,
                    right: 6,
                  },
                }}
              >
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {user ? (
              <IconButton onClick={handleProfileClick}>
                <Avatar
                  alt={user.username}
                  src={user.avatar || ""}
                  sx={{ width: 36, height: 36 }}
                >
                  {user.username?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            ) : (
              <Button
                size="small"
                onClick={() => navigate("/login")}
                variant="contained"
              >
                Login
              </Button>
            )}

            <IconButton color="primary" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          </Box>
        )}
      </Toolbar>

      {/* ✅ Mobile Search */}
      <AnimatePresence>
        {showSearch && isMobile && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <Box
              component="form"
              onSubmit={handleSearch}
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.05)",
                borderRadius: "30px",
                px: 2,
                py: 0.5,
                mx: 2,
                mb: 1,
              }}
            >
              <SearchIcon sx={{ color: "text.secondary" }} />
              <InputBase
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ ml: 1, flex: 1 }}
              />
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Drawer Menu */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
        <Box
          sx={{
            width: 240,
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={toggleDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List sx={{ mt: 2 }}>
            {navItems.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate(item.path);
                    toggleDrawer();
                  }}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* ✅ Profile Menu (Works on all screens) */}
      {user && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileClose}
          disableScrollLock={true}
         
        
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem
            onClick={() => {
              handleProfileClose();
              navigate("/profile");
            }}
          >
            My Profile
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
            Logout
          </MenuItem>
        </Menu>
      )}
    </AppBar>
  );
};

export default Header;
