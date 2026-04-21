// src/components/AdminProtectedRoute.jsx
import {useState, useEffect} from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { verifyAuth, isLoggedIn, isAdmin } from "../services/authService";
import { Box, CircularProgress, Alert, Typography } from "@mui/material";

const AdminProtectedRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [error, setError] = useState("");
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await verifyAuth();

                if (!isLoggedIn()) {
                    setError("Please log in first");
                    setLoading(false);
                    return;
                }

                if (!isAdmin()) {
                    setError("Admin access required");
                    setLoading(false);
                    return;
                }

                setIsAuthorized(true);
            } catch (err) {
                console.error("Admin auth check failed:", err);
                setError("Session expired. Please log in.");
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="50vh"
            >
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Verifying admin access...</Typography>
            </Box>
        );
    }

    if (!isAuthorized || error) {
        return (
            <Box maxWidth={500} mx="auto" mt={8} p={3} textAlign="center">
                <Alert severity="warning" sx={{ mb: 2 }}>
                    {error || "Access denied"}
                </Alert>
                <Typography variant="body1" gutterBottom>
                    Redirecting...
                </Typography>
                <Navigate
                    to={isLoggedIn() ? "/products" : "/login"}
                    state={{ from: location }}
                    replace
                />
            </Box>
        );
    }

    return children;
};

export default AdminProtectedRoute;