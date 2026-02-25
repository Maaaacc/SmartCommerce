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
  TextField
} from "@mui/material";
import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct
} from "../../services/productService";
import ProductForm from "../../components/products/ProductForm";
import ProductTable from "../../components/products/ProductTable";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data || []);
    } catch (err) {
      setError("Failed to load products");
      setProducts([]);
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
    } catch (err) {
      setError("Failed to save product");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id) {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  }

  async function confirmDelete() {
    try {
      setDeleteDialogOpen(false);
      await deleteProduct(productToDelete);
      await loadProducts();
      setError("");
    } catch (err) {
      setError("Failed to delete product");
      setDeleteDialogOpen(false);
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

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Product Management
        </Typography>
        <TextField
          label="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small">
        </TextField>
        <Button
          variant="contained"
          onClick={handleCreate}
          startIcon={<CircularProgress size={16} />}
          disabled={formLoading}
        >
          Create Product
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        searchTerm={searchTerm}
        isAdmin={true}
      />

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingProduct ? `Edit Product #${editingProduct.id}` : "Create New Product"}
        </DialogTitle>
        <DialogContent dividers>
          <ProductForm
            initialData={editingProduct || {}}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseModal}
            loading={formLoading}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this product?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ProductsPage;