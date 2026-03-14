import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout, getRole, getToken } from "../../services/authService";


import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Tooltip
} from "@mui/material";

import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";

const navMenus = [
  { label: "Dashboard", path: "/dashboard" },
  {
    label: "Store",
    children: [
      { label: "Products", path: "/products" },
      { label: "Categories", path: "/categories" },
      { label: "Inventory", path: "/inventory" },
    ],
  },
  {
    label: "Sales",
    children: [
      { label: "Orders", path: "/orders" },
      { label: "Customers", path: "/customers" },
    ],
  },
  {
    label: "Analytics",
    children: [
      { label: "Reports", path: "/reports" },
      { label: "Revenue", path: "/revenue" },
    ],
  },
  {
    label: "Management",
    children: [
      { label: "Users", path: "/users" },
      { label: "Roles", path: "/roles" },
      { label: "Settings", path: "/settings" },
    ],
  },
];

const Navbar = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const loggedIn = !!getToken();
  const role = getRole();

  // State for desktop dropdowns
  const [menuAnchors, setMenuAnchors] = useState({});
  const handleMenuOpen = (event, label) => {
    setMenuAnchors({ ...menuAnchors, [label]: event.currentTarget });
  };
  const handleMenuClose = (label) => {
    setMenuAnchors({ ...menuAnchors, [label]: null });
  };

  // Mobile hamburger menu
  const [mobileAnchor, setMobileAnchor] = useState(null);
  const handleMobileMenuOpen = (event) => setMobileAnchor(event.currentTarget);
  const handleMobileMenuClose = () => setMobileAnchor(null);

  // Profile menu
  const [profileAnchor, setProfileAnchor] = useState(null);
  const handleProfileMenuOpen = (event) => setProfileAnchor(event.currentTarget);
  const handleProfileMenuClose = () => setProfileAnchor(null);

  // Logout function
  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    handleProfileMenuClose();
    navigate("/login");
  };

  // FIXED: No Fragments - Returns array directly
  const renderMobileMenuItems = () => {
    const items = [];

    navMenus.forEach((nav) => {
      if (nav.children) {
        // Add submenu header
        items.push(
          <MenuItem
            key={`${nav.label}-header`}
            disabled
            sx={{
              fontWeight: 'bold',
              color: 'text.secondary',
              justifyContent: 'center',
              py: 1
            }}
          >
            {nav.label}
          </MenuItem>
        );

        // Add submenu children
        nav.children.forEach((child) => {
          items.push(
            <MenuItem
              key={child.label}
              component={Link}
              to={child.path}
              onClick={handleMobileMenuClose}
              sx={{ pl: 4 }}
            >
              {child.label}
            </MenuItem>
          );
        });
      } else {
        // Add top-level item
        items.push(
          <MenuItem
            key={nav.label}
            component={Link}
            to={nav.path}
            onClick={handleMobileMenuClose}
          >
            {nav.label}
          </MenuItem>
        );
      }
    });

    return items;
  };



  return (
    <AppBar position="static">
      <Toolbar>
        {/* Mobile Hamburger */}
        <Box sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            aria-controls="mobile-menu"
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        {/* Logo */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ textDecoration: "none", color: "inherit", mr: 2 }}
        >
          SmartCommerce
        </Typography>

        {/* Desktop menus */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
          {navMenus.map((nav) =>
            nav.children ? (
              <Box key={nav.label}>
                <Button
                  color="inherit"
                  onClick={(e) => handleMenuOpen(e, nav.label)}
                >
                  {nav.label} ▼
                </Button>
                <Menu
                  anchorEl={menuAnchors[nav.label]}
                  open={Boolean(menuAnchors[nav.label])}
                  onClose={() => handleMenuClose(nav.label)}
                >
                  {nav.children.map((child) => (
                    <MenuItem
                      key={child.label}
                      component={Link}
                      to={child.path}
                      onClick={() => handleMenuClose(nav.label)}
                    >
                      {child.label}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            ) : (
              <Button
                key={nav.label}
                color="inherit"
                component={Link}
                to={nav.path}
              >
                {nav.label}
              </Button>
            )
          )}
        </Box>

        {/* Push right */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Notifications & Profile */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton color="inherit" onClick={handleProfileMenuOpen}>
            <AccountCircle />
          </IconButton>

          <Menu
            anchorEl={profileAnchor}
            open={Boolean(profileAnchor)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem onClick={handleProfileMenuClose} component={Link} to="/profile">
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
      {/* Mobile Menu */}
      <Menu
        id="mobile-menu"
        anchorEl={mobileAnchor}
        open={Boolean(mobileAnchor)}
        onClose={handleMobileMenuClose}
        TransitionComponent={null}
        disablePortal
        disableRestoreFocus
        disableAutoFocusItem
      // ... rest of props
      >
        {renderMobileMenuItems()}
        <Divider />
        {/* profile items */}
      </Menu>
    </AppBar>
  );
};

export default Navbar;
