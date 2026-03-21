import { useState, useEffect, useCallback } from "react";
import {
    Container, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Button, TextField,
    Dialog, DialogActions, DialogContent, DialogTitle,
    IconButton, Tooltip, Alert, CircularProgress, Chip
} from "@mui/material";
import {
    Add, Edit, Delete, Restore, Refresh
} from "@mui/icons-material";
import { getCategories, createCategory, updateCategory, deleteCategory, restoreCategory } from "../../services/categoryService";
import { getActiveCategories, getDeletedCategories } from "../../services/categoryService";

function CategoryPage() {
    const [categories, setCategories] = useState([]);
    const [deletedCategories, setDeletedCategories] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: "", description: "" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showDeleted, setShowDeleted] = useState(false);

    const loadCategories = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const [activeData, deletedData] = await Promise.all([
                getActiveCategories(),
                getDeletedCategories()
            ]);

            setCategories(activeData);
            setDeletedCategories(deletedData);
        } catch (err) {
            setError("Failed to load categories");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const toggleShowDeleted = useCallback(() => {
        setShowDeleted((prev) => !prev);
    }, []);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    const handleSubmit = async () => {
        try {
            if (editingId) {
                await updateCategory(editingId, formData);
            } else {
                await createCategory(formData);
            }
            setOpenDialog(false);
            setFormData({ name: "", description: "" });
            setEditingId(null);
            loadCategories();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEdit = (category) => {
        setFormData({ name: category.name, description: category.description || "" });
        setEditingId(category.id);
        setOpenDialog(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this category?")) return;
        try {
            await deleteCategory(id);
            loadCategories();
        } catch (err) {
            setError("Failed to delete category");
        }
    };

    const handleRestore = async (id) => {
        if (!window.confirm("Restore this category?")) return;
        try {
            await restoreCategory(id);
            loadCategories();
        } catch (err) {
            setError("Failed to restore category");
        }
    };

    const currentCategories = showDeleted ? deletedCategories : categories;

    if (loading) {
        return (
            <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
                    {error}
                </Alert>
            )}

            <Paper sx={{ p: 3, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => {
                            setFormData({ name: "", description: "" });
                            setEditingId(null);
                            setOpenDialog(true);
                        }}
                    >
                        Add Category
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={loadCategories}
                        sx={{ ml: 2 }}
                    >
                        Refresh
                    </Button>
                </div>
                <Chip
                    label={showDeleted ? "Show Active" : "Show Deleted"}
                    color={showDeleted ? "default" : "primary"}
                    onClick={toggleShowDeleted}
                    clickable
                />
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell sx={{ minWidth: 150 }}>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentCategories.map((category) => (
                            <TableRow key={category.id} hover>
                                <TableCell>{category.id}</TableCell>
                                <TableCell>{category.name}</TableCell>
                                <TableCell sx={{ maxWidth: 200 }}>{category.description || "-"}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={category.isDeleted ? "Deleted" : "Active"}
                                        color={category.isDeleted ? "error" : "success"}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="Edit">
                                        <IconButton onClick={() => handleEdit(category)}>
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                    {!category.isDeleted ? (
                                        <Tooltip title="Delete">
                                            <IconButton onClick={() => handleDelete(category.id)} color="error">
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                    ) : (
                                        <Tooltip title="Restore">
                                            <IconButton onClick={() => handleRestore(category.id)} color="success">
                                                <Restore />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {currentCategories.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                    {showDeleted ? "No deleted categories" : "No categories found"}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editingId ? "Edit Category" : "New Category"}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Name *"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        sx={{ mt: 2 }}
                        required
                        error={!formData.name}
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        multiline
                        rows={3}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!formData.name.trim()}
                    >
                        {editingId ? "Update" : "Create"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default CategoryPage;