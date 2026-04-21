// src/components/public/ProductCard.jsx
import { Card, CardActionArea, CardMedia, CardContent, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
    const navigate = useNavigate();

    return (
        <Card
            onClick={() => navigate(`/products/${product.id}`)}
            sx={{
                width: "100%",
                borderRadius: "4px",
                border: "1px solid #f0f0f0",
                boxShadow: "none",
                cursor: "pointer",
                transition: "box-shadow 0.2s, transform 0.2s",
                "&:hover": {
                    boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
                    transform: "translateY(-2px)",
                },
            }}
        >
            <CardActionArea disableRipple sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", height: "100%" }}>
                <Box sx={{ width: "100%", aspectRatio: "1/1", overflow: "hidden", bgcolor: "#f5f5f5" }}>
                    <CardMedia
                        component="img"
                        image={`https://localhost:7250${product.imageUrl}` || "/placeholder.jpg"}
                        alt={product.name}
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.3s",
                            "&:hover": { transform: "scale(1.04)" },
                        }}
                    />
                </Box>

                <CardContent sx={{ p: "8px 10px 10px", width: "100%" }}>
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: "13px",
                            lineHeight: 1.4,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            minHeight: "36px",
                            color: "#333",
                        }}
                    >
                        {product.name}
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: "16px",
                            fontWeight: 600,
                            color: "#ee4d2d",
                            mt: "6px",
                        }}
                    >
                        ₱{Number(product.price).toLocaleString()}
                    </Typography>

                    <Typography variant="caption" sx={{ color: "#999", fontSize: "11px" }}>
                        Stock: {product.stock}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}