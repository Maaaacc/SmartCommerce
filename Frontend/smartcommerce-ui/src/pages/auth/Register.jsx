import { useState } from "react";
import { register } from "../../services/authService";
import { Link, useNavigate } from "react-router-dom";
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    CircularProgress,
    Avatar,
    IconButton,
    InputAdornment
} from "@mui/material";
import { PersonAdd as PersonAddIcon, Visibility, VisibilityOff } from "@mui/icons-material";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const result = await register(email, password);
            setSuccess(result.message || "Registration successful! You can now log in.");
            setTimeout(() => navigate("/login"), 2000);  // Auto-redirect to login
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <PersonAddIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                {loading && <Alert severity="info" sx={{ mt: 2, width: "100%" }}>Registering...</Alert>}
                {error && <Alert severity="error" sx={{ mt: 2, width: "100%" }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mt: 2, width: "100%" }}>{success}</Alert>}

                <Paper
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ mt: 1, p: 4, width: "100%", boxShadow: 3 }}
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        slotProps={{
                            input: {
                                autoComplete: 'off',  // ← Disables browser autofill
                                endAdornment: (  // ← Replaces InputProps completely
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        }}
                    />


                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                        error={password && confirmPassword && password !== confirmPassword}
                        helperText={password && confirmPassword && password !== confirmPassword ? "Passwords do not match" : ""}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        edge="end"
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : "Sign Up"}
                    </Button>
                    <Box sx={{ textAlign: "center" }}>
                        <Link to="/login" style={{ textDecoration: "none", color: "inherit" }}>
                            Already have an account? Sign In
                        </Link>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}

export default Register;
