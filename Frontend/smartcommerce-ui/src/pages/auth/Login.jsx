// src/pages/auth/Login.jsx
import { useState } from "react";
import { login } from "../../services/authService";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout, { shimmer, COLORS } from "../../components/layout/AuthLayout";
import {
    TextField, Button, Box, Alert,
    CircularProgress, IconButton, InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true); setError("");
        try {
            await login(email, password);
            navigate("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to your SmartCommerce account"
            tagline="Your marketplace, smarter."
            taglineSub="Discover thousands of products and shop with confidence — all in one place."
        >
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    margin="normal" required fullWidth
                    label="Email Address" name="email"
                    autoComplete="email" autoFocus
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    sx={{ animationDelay: "0.15s" }}
                />
                <TextField
                    margin="normal" required fullWidth
                    name="password" label="Password"
                    type={showPw ? "text" : "password"}
                    autoComplete="current-password"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    sx={{ animationDelay: "0.22s" }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPw(!showPw)} edge="end">
                                    {showPw ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Shimmer button */}
                <Button
                    type="submit" fullWidth variant="contained"
                    disabled={loading}
                    sx={{
                        mt: 3, mb: 2, py: 1.5,
                        backgroundColor: COLORS.primary,
                        "&:hover": { backgroundColor: COLORS.primaryDark },
                        fontWeight: 700, fontSize: "15px",
                        textTransform: "none", borderRadius: "8px",
                        position: "relative", overflow: "hidden",
                        animationDelay: "0.3s",
                        "&::after": {
                            content: '""',
                            position: "absolute",
                            top: 0, left: "-100%",
                            width: "60%", height: "100%",
                            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
                            animation: `${shimmer} 2.5s ease infinite`,
                        },
                    }}
                >
                    {loading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Sign In"}
                </Button>

                <Box sx={{ textAlign: "center", fontSize: "14px", color: COLORS.textSecondary, animationDelay: "0.36s" }}>
                    Don't have an account?{" "}
                    <Link to="/register" style={{ color: COLORS.primary, fontWeight: 700, textDecoration: "none" }}>
                        Register
                    </Link>
                </Box>
            </Box>
        </AuthLayout>
    );
}

export default Login;