import { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Box,
    Paper,
    Typography,
    Alert,
    CircularProgress
} from "@mui/material";

function ProductForm({ initialData = {}, onSubmit, onCancel, loading }) {
    const [name, setName] = useState(initialData.name || "");
    const [description, setDescription] = useState(initialData.description || "");
    const [price, setPrice] = useState(initialData.price || "");
    const [stock, setStock] = useState(initialData.stock || "");
    const [imageUrl, setImageUrl] = useState(initialData.imageUrl || "");
    const [error, setError] = useState("");

    useEffect(() => {
        setName(initialData.name || "");
        setDescription(initialData.description || "");
        setPrice(initialData.price || "");
        setStock(initialData.stock || "");
        setImageUrl(initialData.imageUrl || "");
    }, [initialData]);

    function handleSubmit(e) {
        e.preventDefault();

        if (!name || !description || !price || !stock) {
            setError("Please fill in all required fields");
            return;
        }

        setError("");
        onSubmit({
            ...initialData,
            name,
            description,
            price: parseFloat(price),
            stock: parseFloat(stock),
            imageUrl
        });
    }

    function handleCancel() {
        setName("");
        setDescription("");
        setPrice("");
        setStock("");
        setImageUrl("");
        setError("");

        if (onCancel) onCancel();
    }

    return (
        <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
                {initialData.id ? "Edit Product" : "Add New Product"}
            </Typography>
            {initialData.id && (
                <TextField
                    label="Product ID"
                    value={initialData.id}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    sx={{ mb: 2, backgroundColor: '#f5f5f5' }}
                />
            )}

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Stock"
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="Image URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        size="medium"
                        sx={{
                            minWidth: 100,      // ← Much shorter width!
                            width: 100          // ← Fixed exact width
                        }}
                    >
                        {loading ? <CircularProgress size={20} /> : (initialData.id ? "Update" : "Create")}
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={handleCancel}
                        disabled={loading}
                        size="medium"
                        sx={{
                            minWidth: 100,      // ← Match main button width
                            width: 100          // ← Fixed width
                        }}
                    >
                        Cancel
                    </Button>
                </Box>



            </Box>
        </Paper>
    )
}

export default ProductForm;