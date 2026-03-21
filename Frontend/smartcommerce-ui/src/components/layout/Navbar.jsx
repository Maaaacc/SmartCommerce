// Navbar.jsx - Replace the entire component with this fixed version
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout, getRole, getToken } from "../../services/authService";
import NavbarMenus from "./NavbarMenus";

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
} from "@mui/material";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";


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

  const handleLogout = () => {
    logout();
    if (setIsLoggedIn) setIsLoggedIn(false);
    handleProfileMenuClose();
    navigate("/login");
  };

  const renderMobileMenuItems = () => {
    const items = [];

    NavbarMenus.forEach((nav) => {
      if (nav.children) {
        items.push(
          <MenuItem key={`${nav.label}-header`} disabled sx={{ fontWeight: 'bold', color: 'text.secondary', justifyContent: 'center', py: 1 }}>
            {nav.label}
          </MenuItem>
        );
        nav.children.forEach((child) => {
          items.push(
            <MenuItem key={child.label} component={Link} to={child.path} onClick={handleMobileMenuClose} sx={{ pl: 4 }}>
              {child.label}
            </MenuItem>
          );
        });
      } else {
        items.push(
          <MenuItem key={nav.label} component={Link} to={nav.path} onClick={handleMobileMenuClose}>
            {nav.label}
          </MenuItem>
        );
      }
    });

    return items;
  };

  const renderProfileMenu = () => [
    <MenuItem key="profile" onClick={handleProfileMenuClose} component={Link} to="/profile">
      Profile
    </MenuItem>,
    <Divider key="divider" />,
    <MenuItem key="logout" onClick={handleLogout}>
      Logout
    </MenuItem>
  ];

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Mobile Hamburger - Only show if logged in */}
        {loggedIn && (
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
        )}

        {/* Logo */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ textDecoration: "none", color: "inherit", mr: 2, flexGrow: loggedIn ? 0 : 1 }}
        >
          SmartCommerce
        </Typography>

        {/* Desktop Navigation Menus - Only show if logged in */}
        {loggedIn && (
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            {NavbarMenus.map((nav) =>
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
                <Button key={nav.label} color="inherit" component={Link} to={nav.path}>
                  {nav.label}
                </Button>
              )
            )}
          </Box>
        )}

        {/* Push right */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Right side - Conditional based on auth status */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {loggedIn ? (
            <>
              {/* Notifications & Profile - Only for logged in users */}
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
                {renderProfileMenu()}
              </Menu>
            </>
          ) : (
            <>
              {/* Auth buttons - Only for not logged in users */}
              <Button color="inherit" component={Link} to="/login">
                Sign In
              </Button>
              <Button color="inherit" component={Link} to="/register" sx={{ ml: 1 }}>
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>

      {/* Mobile Menu - Only for logged in users */}
      {loggedIn && (
        <Menu
          id="mobile-menu"
          anchorEl={mobileAnchor}
          open={Boolean(mobileAnchor)}
          onClose={handleMobileMenuClose}
          TransitionComponent={null}
          disablePortal
          disableRestoreFocus
          disableAutoFocusItem
        >
          {renderMobileMenuItems()}
          <Divider />
          {renderProfileMenu()}
        </Menu>
      )}
    </AppBar>
  );
};

export default Navbar;
