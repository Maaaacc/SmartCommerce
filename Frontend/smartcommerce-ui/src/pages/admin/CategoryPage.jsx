// src/pages/admin/CategoryPage.jsx
import { useState, useEffect, useCallback } from "react";
import {
  Container,
  Paper,
  Box,
  TextField,
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Add, BorderTop, Refresh } from "@mui/icons-material";

import {
  getActiveCategories,
  getDeletedCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  restoreCategory,
} from "../../services/categoryService";

import CategoryForm from "../../components/admin/CategoryForm";
import CategoryTable from "../../components/admin/CategoryTable";
import { COLORS } from "../../theme/colors";

const btnBaseSx = {
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 600,
  fontSize: "0.83rem",
  textTransform: "none",
  borderRadius: "8px",
  boxShadow: "none",
  "&:hover": { boxShadow: "none" },
};

function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [deletedCategories, setDeletedCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [activeData, deletedData] = await Promise.all([
        getActiveCategories(),
        getDeletedCategories(),
      ]);
      setCategories(activeData);
      setDeletedCategories(deletedData);
    } catch (err) {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCategories(); }, [loadCategories]);


  const handleEdit = (category) => {
    setEditingCategory(category);
    setOpenDialog(true);
  };

  const handleDelete = (id) => {
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  }


  const confirmDelete = async () => {
    try {
      setDeleteDialogOpen(false);
      if (categoryToDelete) {
        await deleteCategory(categoryToDelete);
        loadCategories();
      }
    } catch {
      setError("Failed to delete category");
    } finally {
      setCategoryToDelete(null);
    }
  }

  const handleRestore = async (id) => {
    if (!window.confirm("Restore this category?")) return;
    try {
      await restoreCategory(id);
      loadCategories();
    } catch {
      setError("Failed to restore category");
    }
  };

  const handleFormSubmit = async (formData) => {
    console.log("Sending to backend:", formData);

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
      } else {
        await createCategory(formData);
      }
      setOpenDialog(false);
      setEditingCategory(null);
      loadCategories();
    } catch {
      setError("Failed to save category");
    }
  };

  const currentList = showDeleted ? deletedCategories : categories;

  return (
    <Container maxWidth={false} sx={{ mt: 4, pb: 6, maxWidth: "1260px" }}>
      {/* Page header */}
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
          Category Management
        </Typography>
        <Typography
          sx={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.875rem",
            color: COLORS.textSecondary,
            mt: 0.4,
          }}
        >
          Manage your store's product categories
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
          <Button
            variant="contained"
            startIcon={<Add sx={{ fontSize: 17 }} />}
            onClick={() => { setEditingCategory(null); setOpenDialog(true); }}
            sx={{
              ...btnBaseSx,
              backgroundColor: COLORS.primary,
              px: 2,
              "&:hover": { backgroundColor: COLORS.primaryDark },
            }}
          >
            Add Category
          </Button>

          <Tooltip title="Refresh">
            <IconButton
              onClick={loadCategories}
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
            placeholder="Search categories…"
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

      <CategoryTable
        categories={currentList}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRestore={handleRestore}
        loading={loading}
        searchTerm={searchTerm}
      />

      {/* Create / Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => { setOpenDialog(false); setEditingCategory(null); }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "14px",
            border: `1px solid ${COLORS.border}`,
            boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: "1rem",
            borderBottom: `1px solid #f3f4f6`,
            pb: 2,
            color: COLORS.textPrimary,
          }}
        >
          {editingCategory ? `Edit Category #${editingCategory.id}` : "Create New Category"}
        </DialogTitle>
        <DialogContent sx={{ pt: "20px !important", borderColor: "#f3f4f6" }}>
          <CategoryForm
            initialData={editingCategory || {}}
            onSubmit={handleFormSubmit}
            onCancel={() => { setOpenDialog(false); setEditingCategory(null); }}
            loading={loading}
            categories={categories}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "14px",
            border: `1px solid ${COLORS.border}`,
            boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
          },
        }}>
        <DialogTitle
          sx={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: "1rem",
            borderBottom: `1px solid #f3f4f6`,
            pb: 2,
            color: COLORS.textPrimary,
          }}>
          Delete Category
        </DialogTitle>

        <DialogContent sx={{ pt: "16px !important" }}>
          <Typography
            sx={{
              frontFamily: "'DM Sans', sans-serif",
              fontSize: "0.875rem",
              color: COLORS.textSecondary,
            }}>
            Are you sure you want to delete this category? This action can be undone from the "Show Deleted" view.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, BorderTop: `1px solid #f3f4f6`, gap: 1 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              ...btnBaseSx,
              frontWeight: 500,
              color: COLORS.textSecondary,
              "&:hover": { backgroundColor: COLORS.bgPage },
            }}>
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

export default CategoryPage;