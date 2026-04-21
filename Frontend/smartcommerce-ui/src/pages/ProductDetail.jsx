import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, getProducts } from "../services/productService";
import {
    Container,
    Typography,
    Button,
    Chip,
    CardMedia,
    Divider,
    Box
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";

import ProductCard from "../components/ProductCard";
import { COLORS } from "../theme/colors";

import { Breadcrumbs } from "@mui/material";

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productData = await getProductById(id);
                if (!productData) throw new Error("Product not found");
                setProduct(productData);
            } catch (error) {
                console.error("Error fetching product:", error);
                navigate("/products", { replace: true });
            } finally {
                setLoading(false);
            }
        };

        const fetchRelatedProducts = async () => {
            try {
                const allProducts = await getProducts();

                // filter out current product
                const others = allProducts.filter((p) => p.id !== parseInt(id, 10));

                // sort: same category first
                const sorted = others.sort((a, b) => {
                    const isASame = a.categoryId === product.categoryId;
                    const isBSame = b.categoryId === product.categoryId;

                    if (isASame && !isBSame) return -1;
                    if (!isASame && isBSame) return 1;
                    return 0;
                });

                setRelatedProducts(sorted);
            } catch (error) {
                console.error("Error fetching related products:", error);
                setRelatedProducts([]);
            }
        };

        fetchProduct();
        fetchRelatedProducts();
    }, [id, navigate, product]);

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (!product) {
        return (
            <Container sx={{ py: 4, textAlign: "center" }}>
                <Typography variant="h5" color="error">
                    Product not found
                </Typography>
                <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => navigate("/products")}
                >
                    Back to Products
                </Button>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 4 }}>
            {/* Breadcrumbs */}
            <Box sx={{ mb: 3 }}>
                <Breadcrumbs separator="/" aria-label="breadcrumb">
                    <Typography
                        onClick={() => navigate("/")}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                            fontWeight: 500,
                            color: COLORS.textSecondary,
                            textDecoration: "none",
                            transition: "0.2s ease",
                            "&:hover": {
                                color: COLORS.primary,
                            },
                        }}
                    >
                        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                        Home
                    </Typography>

                    <Typography
                        onClick={() => navigate("/products")}
                        sx={{
                            cursor: "pointer",
                            fontWeight: 500,
                            color: COLORS.textSecondary,
                            transition: "0.2s",
                            "&:hover": {
                                color: COLORS.primary,
                            },
                        }}
                    >
                        Products
                    </Typography>

                    <Typography color="text.primary" fontWeight={500}>
                        {product.name}
                    </Typography>
                </Breadcrumbs>
            </Box>

            {/* Product detail */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "1fr 1fr",
                    },
                    gap: 3,
                }}
            >
                {/* Left: image */}
                <Box
                    sx={{
                        aspectRatio: "1/1",
                        bgcolor: "#f5f5f5",
                        borderRadius: 1,
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <CardMedia
                        component="img"
                        src={`https://localhost:7250${product.imageUrl}` || "/placeholder.jpg"}
                        alt={product.name}
                        sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                </Box>

                {/* Right: details */}
                <Box>
                    <Typography variant="h5" gutterBottom fontWeight={600}>
                        {product.name}
                    </Typography>

                    <Typography
                        variant="h4"
                        sx={{ color: COLORS.accent, fontWeight: 700, mb: 1 }}
                    >
                        ₱{Number(product.price).toLocaleString()}
                    </Typography>

                    <Chip
                        label={`Stock: ${product.stock}`}
                        color={product.stock > 0 ? "success" : "warning"}
                        size="small"
                    />

                    <Typography
                        variant="body1"
                        sx={{ mt: 2, color: COLORS.textPrimary, lineHeight: 1.6 }}
                    >
                        {product.description}
                    </Typography>

                    <Divider sx={{ my: 3 }} />

                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        sx={{ py: 1.5, fontSize: "1rem" }}
                        color="primary"
                        startIcon={<ShoppingCartIcon />}
                    >
                        Add to Cart
                    </Button>
                </Box>
            </Box>

            {/* More Products grid (no carousel) */}
            {relatedProducts.length > 0 && (
                <Box mt={6}>
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ color: "text.primary", fontWeight: 700 }}
                    >
                        More Products
                    </Typography>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "repeat(2, 1fr)",
                                sm: "repeat(3, 1fr)",
                                md: "repeat(4, 1fr)",
                                lg: "repeat(5, 1fr)",
                            },
                            gap: 2,
                        }}
                    >
                        {relatedProducts.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </Box>
                </Box>
            )}
        </Container>
    );
};

export default ProductDetail;