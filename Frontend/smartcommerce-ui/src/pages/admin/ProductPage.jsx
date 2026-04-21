// src/pages/admin/ProductsPage.jsx
import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Alert,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  TextField,
  Paper,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import { Add, Refresh } from "@mui/icons-material";
import {
  getProducts,
  getDeletedProducts,      // ✅ NEW
  createProduct,
  deleteProduct,
  updateProduct,
  restoreProduct,          // ✅ NEW
  getActiveCategoriesForProduct,
} from "../../services/productService";
import ProductForm from "../../components/admin/ProductForm";
import ProductTable from "../../components/admin/ProductTable";
import { COLORS } from "../../theme/colors";

const dialogPaperSx = {
  borderRadius: "14px",
  border: `1px solid ${COLORS.border}`,
  boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
};

const btnBaseSx = {
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 600,
  fontSize: "0.83rem",
  textTransform: "none",
  borderRadius: "8px",
  boxShadow: "none",
  "&:hover": { boxShadow: "none" },
};

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [deletedProducts, setDeletedProducts] = useState([]);   // ✅ NEW
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);        // ✅ NEW

  useEffect(() => {
    loadProducts();
    getActiveCategoriesForProduct().then(setCategories);
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      const [activeData, deletedData] = await Promise.all([   // ✅ NEW
        getProducts(),
        getDeletedProducts(),
      ]);
      setProducts(activeData || []);
      setDeletedProducts(deletedData || []);
    } catch {
      setError("Failed to load products");
      setProducts([]);
      setDeletedProducts([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleFormSubmit(product) {
    try {
      setFormLoading(true);
      if (product.id) {
        await updateProduct(product.id, product);
      } else {
        await createProduct(product);
      }
      setOpenModal(false);
      setEditingProduct(null);
      await loadProducts();
      setError("");
    } catch {
      setError("Failed to save product");
    } finally {
      setFormLoading(false);
    }
  }

  function handleDelete(id) {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  }

  async function confirmDelete() {
    try {
      setDeleteDialogOpen(false);
      await deleteProduct(productToDelete);
      await loadProducts();
      setError("");
    } catch {
      setError("Failed to delete product");
      setDeleteDialogOpen(false);
    }
  }

  // ✅ NEW
  async function handleRestore(id) {
    if (!window.confirm("Restore this product?")) return;
    try {
      await restoreProduct(id);
      await loadProducts();
      setError("");
    } catch {
      setError("Failed to restore product");
    }
  }

  function handleEdit(product) {
    setEditingProduct(product);
    setOpenModal(true);
  }

  function handleCreate() {
    setEditingProduct(null);
    setOpenModal(true);
  }

  function handleCloseModal() {
    setOpenModal(false);
    setEditingProduct(null);
  }

  const currentList = showDeleted ? deletedProducts : products;  // ✅ NEW

  return (
    <Container maxWidth={false} sx={{ mt: 4, pb: 6, maxWidth: "1260px" }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            color: COLORS.textPrimary,
            letterSpacing: "-0.02em",
          }}
        >
          Product Management
        </Typography>
        <Typography
          sx={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.875rem",
            color: COLORS.textSecondary,
            mt: 0.4,
          }}
        >
          Manage your store's product catalog
        </Typography>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: "10px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.875rem",
          }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {/* Toolbar */}
      <Paper
        sx={{
          p: 2.5,
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          borderRadius: "12px",
          border: `1px solid ${COLORS.border}`,
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          backgroundColor: COLORS.bgPaper,
        }}
      >
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
          {/* ✅ Hide "Create Product" when viewing deleted */}
          {!showDeleted && (
            <Button
              variant="contained"
              startIcon={<Add sx={{ fontSize: 17 }} />}
              onClick={handleCreate}
              disabled={formLoading}
              sx={{
                ...btnBaseSx,
                backgroundColor: COLORS.primary,
                px: 2,
                "&:hover": { backgroundColor: COLORS.primaryDark },
                "&.Mui-disabled": { backgroundColor: COLORS.border, color: COLORS.textLight },
              }}
            >
              Create Product
            </Button>
          )}

          <Tooltip title="Refresh">
            <IconButton
              onClick={loadProducts}
              disabled={loading}
              size="small"
              sx={{
                border: `1px solid ${COLORS.border}`,
                borderRadius: "8px",
                color: COLORS.textSecondary,
                "&:hover": { backgroundColor: COLORS.bgPage, borderColor: "#d1d5db" },
              }}
            >
              {loading
                ? <CircularProgress size={16} sx={{ color: COLORS.textSecondary }} />
                : <Refresh fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
          <TextField
            placeholder="Search products…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{
              width: 240,
              "& .MuiOutlinedInput-root": {
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.875rem",
                borderRadius: "8px",
                "& fieldset": { borderColor: COLORS.border },
                "&:hover fieldset": { borderColor: "#d1d5db" },
                "&.Mui-focused fieldset": { borderColor: COLORS.primary },
              },
            }}
          />

          {/* ✅ NEW — mirrors CategoryPage exactly */}
          <Chip
            label={showDeleted ? "Show Active" : "Show Deleted"}
            onClick={() => setShowDeleted((p) => !p)}
            clickable
            sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: "0.78rem",
              height: 34,
              borderRadius: "8px",
              border: `1px solid ${showDeleted ? COLORS.primary : COLORS.border}`,
              backgroundColor: showDeleted ? COLORS.primaryLight : "transparent",
              color: showDeleted ? COLORS.primary : COLORS.textSecondary,
              "& .MuiChip-label": { px: 1.5 },
              "&:hover": {
                backgroundColor: showDeleted ? COLORS.primaryLight : COLORS.bgPage,
              },
            }}
          />
        </Box>
      </Paper>

      <ProductTable
        products={currentList}
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRestore={handleRestore}    // ✅ NEW
        loading={loading}
        searchTerm={searchTerm}
        isAdmin={true}
        showDeleted={showDeleted}    // ✅ NEW — table uses this to swap Edit/Delete for Restore
      />

      {/* Create / Edit Dialog — unchanged */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: dialogPaperSx }}
      >
        <DialogTitle
          sx={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: "1rem",
            borderBottom: "1px solid #f3f4f6",
            pb: 2,
            color: COLORS.textPrimary,
          }}
        >
          {editingProduct ? `Edit Product #${editingProduct.id}` : "Create New Product"}
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: "#f3f4f6" }}>
          <ProductForm
            initialData={editingProduct || {}}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseModal}
            loading={formLoading}
            categories={categories}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog — unchanged */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: dialogPaperSx }}
      >
        <DialogTitle
          sx={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: "1rem",
            color: COLORS.textPrimary,
            borderBottom: "1px solid #f3f4f6",
            pb: 2,
          }}
        >
          Delete Product
        </DialogTitle>
        <DialogContent sx={{ pt: "16px !important" }}>
          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", color: COLORS.textSecondary }}>
            Are you sure you want to delete this product? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid #f3f4f6", gap: 1 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              ...btnBaseSx,
              fontWeight: 500,
              color: COLORS.textSecondary,
              "&:hover": { backgroundColor: COLORS.bgPage },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            autoFocus
            sx={{
              ...btnBaseSx,
              backgroundColor: "#dc2626",
              "&:hover": { backgroundColor: "#b91c1c" },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ProductsPage;