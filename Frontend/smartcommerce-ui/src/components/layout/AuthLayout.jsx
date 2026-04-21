// src/components/layout/AuthLayout.jsx
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { keyframes } from "@mui/system";

const floatUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const orbit1 = keyframes`
  from { transform: rotate(0deg)   translateX(60px) rotate(0deg); }
  to   { transform: rotate(360deg) translateX(60px) rotate(-360deg); }
`;
const orbit2 = keyframes`
  from { transform: rotate(120deg)  translateX(40px) rotate(-120deg); }
  to   { transform: rotate(480deg)  translateX(40px) rotate(-480deg); }
`;
const orbit3 = keyframes`
  from { transform: rotate(240deg)  translateX(75px) rotate(-240deg); }
  to   { transform: rotate(600deg)  translateX(75px) rotate(-600deg); }
`;
const ripple = keyframes`
  0%   { transform: translate(-50%,-50%) scale(1);   opacity: 0.4; }
  100% { transform: translate(-50%,-50%) scale(2.4); opacity: 0; }
`;
const shimmer = keyframes`
  0%   { left: -100%; }
  100% { left: 200%; }
`;
const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(30px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const COLORS = {
    primary: "#5D5FEF",
    primaryDark: "#4A4BCB",
    primaryLight: "#E0E0FF",
    accent: "#FF6F61",
    success: "#3ECF8E",
    bgPage: "#F8F9FA",
    bgPaper: "#FFFFFF",
    border: "#E0E0E0",
    textPrimary: "#212529",
    textSecondary: "#6C757D",
};

const AuthLayout = ({ children, title, subtitle, tagline, taglineSub, pills = [] }) => {
    return (
        <Box sx={{
            minHeight: "90vh",
            display: "flex",
            // ✅ Dark page bg so the white form panel has contrast separation
            backgroundColor: "Colors.bgPage",
        }}>

            {/* ✅ Outer wrapper with padding so the card floats off the dark bg */}
            <Box sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: { xs: "24px 16px", md: "40px 32px" },
            }}>

                {/* ✅ The actual card — shadow lifts it off the dark background */}
                <Box sx={{
                    display: "flex",
                    width: "100%",
                    maxWidth: "900px",
                    minHeight: "560px",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)"
                }}>

                    {/* ── Left brand panel ── */}
                    <Box sx={{
                        width: { xs: 0, md: "380px" },
                        flexShrink: 0,
                        display: { xs: "none", md: "flex" },
                        flexDirection: "column",
                        justifyContent: "space-between",
                        // ✅ Slightly darker indigo so it reads as distinct from any navbar
                        backgroundColor: "#4A4BCB",
                        padding: "44px 36px",
                        color: "#fff",
                        position: "relative",
                        overflow: "hidden",
                    }}>

                        {/* Ripple rings */}
                        {[0, 1.5].map((delay, i) => (
                            <Box key={i} sx={{
                                position: "absolute",
                                top: "50%", left: "50%",
                                width: 130, height: 130,
                                borderRadius: "50%",
                                border: "1.5px solid rgba(255,255,255,0.12)",
                                animation: `${ripple} 3.5s ${delay}s ease-out infinite`,
                                pointerEvents: "none",
                            }} />
                        ))}

                        {/* Orbiting dots */}
                        <Box sx={{ position: "absolute", top: "50%", left: "50%", width: 0, height: 0 }}>
                            <Box sx={{ position: "absolute", width: 14, height: 14, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.2)", animation: `${orbit1} 7s linear infinite` }} />
                            <Box sx={{ position: "absolute", width: 9, height: 9, borderRadius: "50%", backgroundColor: COLORS.accent + "99", animation: `${orbit2} 5s linear infinite` }} />
                            <Box sx={{ position: "absolute", width: 11, height: 11, borderRadius: "50%", backgroundColor: COLORS.success + "88", animation: `${orbit3} 9s linear infinite` }} />
                        </Box>

                        {/* Logo */}
                        <Typography component={Link} to="/" sx={{
                            textDecoration: "none", color: "#fff",
                            fontSize: "20px", fontWeight: 700,
                            letterSpacing: "-0.4px", position: "relative", zIndex: 1,
                        }}>
                            SmartCommerce
                        </Typography>

                        {/* Tagline */}
                        <Box sx={{ position: "relative", zIndex: 1 }}>
                            <Typography sx={{ fontSize: "26px", fontWeight: 700, lineHeight: 1.25, mb: 1.5 }}>
                                {tagline}
                            </Typography>
                            <Typography sx={{ fontSize: "14px", opacity: 0.72, lineHeight: 1.65, mb: pills.length ? 2 : 0 }}>
                                {taglineSub}
                            </Typography>
                            {pills.length > 0 && (
                                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                    {pills.map((p) => (
                                        <Box key={p.label} sx={{
                                            backgroundColor: p.color,
                                            color: "#fff",
                                            fontSize: "12px",
                                            padding: "4px 12px",
                                            borderRadius: "20px",
                                            fontWeight: 500,
                                        }}>
                                            {p.label}
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Box>

                        <Typography sx={{ fontSize: "12px", opacity: 0.4, position: "relative", zIndex: 1 }}>
                            © {new Date().getFullYear()} SmartCommerce
                        </Typography>
                    </Box>

                    {/* ── Right form panel ── */}
                    <Box sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        padding: { xs: "40px 24px", md: "48px 44px" },
                        backgroundColor: COLORS.bgPaper,
                        animation: `${slideInRight} 0.5s ease both`,
                    }}>
                        {/* Mobile logo */}
                        <Typography component={Link} to="/" sx={{
                            display: { xs: "block", md: "none" },
                            textDecoration: "none",
                            color: COLORS.primary,
                            fontSize: "18px", fontWeight: 700, mb: 4,
                        }}>
                            SmartCommerce
                        </Typography>

                        <Typography sx={{
                            fontSize: "26px", fontWeight: 700,
                            color: COLORS.textPrimary, mb: 0.5,
                            animation: `${floatUp} 0.45s ease both`,
                        }}>
                            {title}
                        </Typography>
                        <Typography sx={{
                            fontSize: "14px", color: COLORS.textSecondary, mb: 3.5,
                            animation: `${floatUp} 0.45s 0.08s ease both`,
                        }}>
                            {subtitle}
                        </Typography>

                        <Box sx={{ "& > *": { animation: `${floatUp} 0.45s ease both` } }}>
                            {children}
                        </Box>
                    </Box>

                </Box>
            </Box>
        </Box>
    );
};

export default AuthLayout;
export { shimmer, COLORS };