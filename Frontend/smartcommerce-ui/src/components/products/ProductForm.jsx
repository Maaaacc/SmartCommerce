import { useState, useEffect, useRef } from "react";
import {
    TextField,
    Button,
    Box,
    Paper,
    Typography,
    Alert,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Avatar
} from "@mui/material";

import { getActiveCategoriesForProduct } from "../../services/productService";

function ProductForm({ initialData = {}, onSubmit, onCancel, loading }) {
    const [name, setName] = useState(initialData.name || "");
    const [description, setDescription] = useState(initialData.description || "");
    const [price, setPrice] = useState(initialData.price || "");
    const [stock, setStock] = useState(initialData.stock || "");
    const [imageUrl, setImageUrl] = useState(initialData.imageUrl || "");
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState(initialData.categoryId || "");
    const [imageFile, setImageFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState(initialData.imageUrl || "");
    const fileInputRef = useRef(null);
    const [error, setError] = useState("");
    const [uploading, setUploading] = useState(false);


    useEffect(() => {
        setName(initialData.name || "");
        setDescription(initialData.description || "");
        setPrice(initialData.price || "");
        setStock(initialData.stock || "");
        setImageUrl(initialData.imageUrl || "");
        setUploadedImageUrl(initialData.imageUrl || "");
        setCategoryId(initialData.categoryId || "");
    }, [initialData]);

    useEffect(() => {
        getActiveCategoriesForProduct()
            .then(setCategories)
            .catch(() => setError("Failed to load categories"));
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        console.log("Sending categoryId:", categoryId, typeof categoryId);

        if (!name || !description || !price || !stock) {
            setError("Please fill in all required fields");
            return;
        }
        if (!categoryId) {
            setError("Please select a category");
            return;
        }

        setError("");
        onSubmit({
            ...initialData,
            name,
            description,
            price: parseFloat(price),
            stock: parseFloat(stock),
            imageUrl: uploadedImageUrl,
            categoryId: categoryId ? parseInt(categoryId) : null
        });
    }

    function handleCancel() {
        setName("");
        setDescription("");
        setPrice("");
        setStock("");
        setImageUrl("");
        setUploadedImageUrl("");
        setCategoryId("");
        setImageFile(null);
        setError("");

        if (fileInputRef.current) fileInputRef.current.value = "";

        if (onCancel) onCancel();
    }

    const handleImageUpload = async (imageFile) => {
        if (!imageFile)
            return;

        const formData = new FormData();
        formData.append("file", imageFile);

        setUploading(true);
        try {
            const response = await fetch('https://localhost:7250/api/products/upload-image', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
                body: formData
            });

            const result = await response.json();
            if (response.ok) {
                setUploadedImageUrl(result.imageUrl);
                setImageFile(null);
                fileInputRef.current.value = "";
                setError("Image uploaded successfully");

                setTimeout(() => setError(""), 3000);
            }
        } catch (err) {
            setError("Failed to upload image");
        } finally {
            setUploading(false);
        }
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

                <Box sx={{ mb: 2 }}>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                            const file = e.target.files[0];
                            if (file) {
                                setImageFile(file);
                                await handleImageUpload(file);
                            }
                        }}
                        style={{ display: 'none' }}
                    />
                    <Button
                        variant="outlined"
                        component="span"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        startIcon={uploading ? <CircularProgress size={20} /> : null}
                        sx={{ mb: 1 }}
                    >
                        {uploading ? "Uploading..." : "Choose Image"}
                    </Button>
                </Box>

                {/* Preview */}
                {uploadedImageUrl && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="caption">Product Image:</Typography>
                        <Avatar
                            src={`https://localhost:7250${uploadedImageUrl}`}
                            sx={{ width: 80, height: 80, ml: 1 }}
                        />
                        <TextField
                            label="Image URL"
                            value={uploadedImageUrl}
                            fullWidth
                            sx={{ mt: 1 }}
                            InputProps={{ readOnly: true }}
                        />
                    </Box>
                )}
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        label="Category"
                    >
                        <MenuItem value="">
                            <em>No Category</em>
                        </MenuItem>

                        {categories.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
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