// src/pages/auth/Register.jsx
import { useState } from "react";
import { register } from "../../services/authService";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout, { shimmer, COLORS } from "../../components/layout/AuthLayout";
import {
    TextField, Button, Box, Alert,
    CircularProgress, IconButton, InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [showCPw, setShowCPw] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const passwordMismatch = Boolean(password && confirmPassword && password !== confirmPassword);

    async function handleSubmit(e) {
        e.preventDefault();
        if (passwordMismatch) { setError("Passwords do not match"); return; }
        setLoading(true); setError(""); setSuccess("");
        try {
            const result = await register(email, password);
            setSuccess(result.message || "Registration successful! Redirecting...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout
            title="Create an account"
            subtitle="Join SmartCommerce and start shopping"
            tagline="Join thousands of shoppers."
            taglineSub="Free to sign up. Start browsing deals in seconds."
            pills={[
                { label: "Free shipping", color: "rgba(255,255,255,0.2)" },
                { label: "Daily deals", color: COLORS.accent + "99" },
                { label: "Secure checkout", color: COLORS.success + "88" },
            ]}
        >
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    margin="normal" required fullWidth
                    label="Email Address" name="email"
                    autoComplete="email" autoFocus
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    disabled={loading} sx={{ animationDelay: "0.15s" }}
                />
                <TextField
                    margin="normal" required fullWidth
                    name="password" label="Password"
                    type={showPw ? "text" : "password"}
                    autoComplete="new-password"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    disabled={loading} sx={{ animationDelay: "0.22s" }}
                    slotProps={{
                        input: {
                            autoComplete: "off",
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPw(!showPw)} edge="end">
                                        {showPw ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                />
                <TextField
                    margin="normal" required fullWidth
                    name="confirmPassword" label="Confirm Password"
                    type={showCPw ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    error={passwordMismatch}
                    helperText={passwordMismatch ? "Passwords do not match" : ""}
                    sx={{ animationDelay: "0.29s" }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowCPw(!showCPw)} edge="end">
                                    {showCPw ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

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
                        animationDelay: "0.36s",
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
                    {loading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Create Account"}
                </Button>

                <Box sx={{ textAlign: "center", fontSize: "14px", color: COLORS.textSecondary, animationDelay: "0.42s" }}>
                    Already have an account?{" "}
                    <Link to="/login" style={{ color: COLORS.primary, fontWeight: 700, textDecoration: "none" }}>
                        Sign In
                    </Link>
                </Box>
            </Box>
        </AuthLayout>
    );
}

export default Register;