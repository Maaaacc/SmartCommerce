// src/components/layout/Navbar.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout, getToken, isAdmin, isLoggedIn } from "../../services/authService";
import { adminMenus, userMenus, publicMenus } from "./NavbarMenus";

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
  Container,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loggedIn = isLoggedIn();

  const publicMenu = publicMenus;
  const menus = isAdmin() ? adminMenus : userMenus;

  const [menuAnchors, setMenuAnchors] = useState({});
  const handleMenuOpen = (event, label) => {
    setMenuAnchors({ ...menuAnchors, [label]: event.currentTarget });
  };
  const handleMenuClose = (label) => {
    setMenuAnchors({ ...menuAnchors, [label]: null });
  };

  const [mobileAnchor, setMobileAnchor] = useState(null);
  const handleMobileMenuOpen = (event) => setMobileAnchor(event.currentTarget);
  const handleMobileMenuClose = () => setMobileAnchor(null);

  const [profileAnchor, setProfileAnchor] = useState(null);
  const handleProfileMenuOpen = (event) => setProfileAnchor(event.currentTarget);
  const handleProfileMenuClose = () => setProfileAnchor(null);

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate("/login");
  };

  const renderMobileMenuItems = () => {
    const items = [];
    menus.forEach((nav) => {
      if (nav.children) {
        items.push(
          <MenuItem
            key={`${nav.label}-header`}
            disabled
            sx={{
              fontWeight: "bold",
              color: "text.secondary",
              justifyContent: "center",
              py: 1,
            }}
          >
            {nav.label}
          </MenuItem>
        );
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

  const renderProfileMenu = () => [
    <MenuItem
      key="profile"
      onClick={handleProfileMenuClose}
      component={Link}
      to="/profile"
    >
      Profile
    </MenuItem>,
    <Divider key="divider" />,
    <MenuItem key="logout" onClick={handleLogout}>
      Logout
    </MenuItem>,
  ];

  return (
    <AppBar position="static">
      {/* ✅ Container constrains content to 1260px and centers it */}
      <Container maxWidth={false} sx={{ maxWidth: "1260px" }}>
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              color: "inherit",
              mr: 2,
              flexShrink: 0,
            }}
          >
            SmartCommerce
          </Typography>

          {/* Centered navigation area */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 1,
              flexGrow: 1,
              mx: 2,
            }}
          >
            {/* Public menus – visible for non‑admin users and guests */}
            {!isAdmin() &&
              publicMenu.map((nav) =>
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

            {/* Admin or User menus – only when logged in */}
            {loggedIn &&
              menus.map((nav) =>
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

          {/* Auth buttons on the far right */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexShrink: 0,
            }}
          >
            {loggedIn ? (
              <>
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
                <Button color="inherit" component={Link} to="/login">
                  Sign In
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/register"
                  sx={{ ml: 1 }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Menu */}
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