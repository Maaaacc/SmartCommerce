import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, getProducts } from "../services/productService";
import {
  Container,
  Typography,
  Button,
  Chip,
  CardMedia,
  Divider,
  Box,
  Breadcrumbs,
  Skeleton,
  Alert,
  Stack,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";
import ProductCard from "../components/ProductCard";
import { COLORS } from "../theme/colors";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const productData = await getProductById(id);
        if (!productData) throw new Error("Product not found");

        if (!isMounted) return;
        setProduct(productData);

        const allProducts = await getProducts();
        const currentId = Number(id);

        const others = allProducts.filter((p) => p.id !== currentId);

        const sorted = others.slice().sort((a, b) => {
          const aSame = a.categoryId === productData.categoryId;
          const bSame = b.categoryId === productData.categoryId;

          if (aSame && !bSame) return -1;
          if (!aSame && bSame) return 1;
          return 0;
        });

        if (!isMounted) return;
        setRelatedProducts(sorted);
      } catch (err) {
        console.error("Error fetching product detail:", err);
        if (!isMounted) return;
        setError("Product not found");
        navigate("/products", { replace: true });
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  const imageSrc = useMemo(() => {
    if (!product?.imageUrl) return "/placeholder.jpg";
    return product.imageUrl.startsWith("http")
      ? product.imageUrl
      : `https://localhost:7250${product.imageUrl}`;
  }, [product]);

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Stack spacing={2}>
          <Skeleton variant="text" width={220} height={32} />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
            }}
          >
            <Skeleton
              variant="rectangular"
              height={420}
              sx={{ borderRadius: 2 }}
            />
            <Box>
              <Skeleton variant="text" width="70%" height={48} />
              <Skeleton variant="text" width="35%" height={40} />
              <Skeleton variant="rounded" width={90} height={28} />
              <Skeleton
                variant="text"
                width="100%"
                height={120}
                sx={{ mt: 2 }}
              />
              <Skeleton
                variant="rectangular"
                height={52}
                sx={{ mt: 3, borderRadius: 2 }}
              />
            </Box>
          </Box>
        </Stack>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container sx={{ py: 4, textAlign: "center" }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || "Product not found"}
        </Alert>
        <Button variant="contained" onClick={() => navigate("/products")}>
          Back to Products
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs separator="/" aria-label="breadcrumb">
          {/* <Typography
            onClick={() => navigate("/")}
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              fontWeight: 500,
              color: COLORS.textSecondary,
              transition: "0.2s ease",
              "&:hover": { color: COLORS.primary },
            }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Typography> */}

          <Typography
            onClick={() => navigate("/products")}
            sx={{
              cursor: "pointer",
              fontWeight: 500,
              color: COLORS.textSecondary,
              transition: "0.2s ease",
              "&:hover": { color: COLORS.primary },
            }}
          >
            Products
          </Typography>

          <Typography color="text.primary" fontWeight={500}>
            {product.name}
          </Typography>
        </Breadcrumbs>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
          alignItems: "start",
        }}
      >
        <Box
          sx={{
            aspectRatio: "1 / 1",
            bgcolor: "#f5f5f5",
            borderRadius: 2,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CardMedia
            component="img"
            src={imageSrc}
            alt={product.name}
            sx={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </Box>

        <Box>
          <Typography variant="h5" gutterBottom fontWeight={700}>
            {product.name}
          </Typography>

          <Typography
            variant="h4"
            sx={{ color: COLORS.accent, fontWeight: 800, mb: 1 }}
          >
            ₱{Number(product.price).toLocaleString()}
          </Typography>

          <Chip
            label={
              product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"
            }
            size="small"
            sx={{
              mt: 1,
              fontWeight: 700,
              px: 1,
              borderRadius: "999px",
              bgcolor: product.stock > 0 ? "#E0F7EF" : "#FFE5E2",
              color: product.stock > 0 ? "#1F8A5B" : COLORS.accent,
              border: "1px solid",
              borderColor: product.stock > 0 ? "#BFE9D6" : "#FFD0CA",
              "& .MuiChip-label": {
                px: 0.5,
              },
            }}
          />

          <Typography
            variant="body1"
            sx={{ mt: 2, color: COLORS.textPrimary, lineHeight: 1.7 }}
          >
            {product.description || "No description available."}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Button
            variant="contained"
            size="large"
            fullWidth
            sx={{
              py: 1.5,
              fontSize: "1rem",
              bgcolor: COLORS.primary,
              "&:hover": { bgcolor: COLORS.primaryDark },
            }}
            startIcon={<ShoppingCartIcon />}
            disabled={product.stock <= 0}
          >
            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </Button>
        </Box>
      </Box>

      {relatedProducts.length > 0 && (
        <Box mt={6}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
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
