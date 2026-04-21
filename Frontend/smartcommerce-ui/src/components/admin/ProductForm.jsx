// src/components/admin/ProductForm.jsx
// ✅ APPLIED: ParentCategorySelect (Leaf nodes only!)

import { useState, useEffect, useRef, useCallback } from "react";
import {
    TextField,
    Button,
    Box,
    Alert,
    CircularProgress,
    Typography,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import CategorySelect from "./CategorySelect";  // ✅ ADDED
import { COLORS } from "../../theme/colors";

const fieldSx = {
    mb: 2.5,
    "& .MuiOutlinedInput-root": {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "0.875rem",
        borderRadius: "8px",
        "& fieldset": { borderColor: COLORS.border },
        "&:hover fieldset": { borderColor: COLORS.primary },
        "&.Mui-focused fieldset": { borderColor: COLORS.primary, borderWidth: "1.5px" },
    },
    "& .MuiInputLabel-root": {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "0.875rem",
        "&.Mui-focused": { color: COLORS.primary },
    },
};

const btnSx = {
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600,
    fontSize: "0.85rem",
    textTransform: "none",
    borderRadius: "8px",
    px: 2.5,
    py: 0.9,
    boxShadow: "none",
    "&:hover": { boxShadow: "none" },
};

function ProductForm({ initialData = {}, onSubmit, onCancel, loading, categories = [] }) {  // ✅ Added categories prop
    const [formData, setFormData] = useState({
        name: "", description: "", price: "", stock: "", categoryId: "",
    });
    // ✅ REMOVED: categories state - use prop instead
    const [imageFile, setImageFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");
    const [error, setError] = useState("");
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        setFormData({
            name: initialData.name || "",
            description: initialData.description || "",
            price: initialData.price || "",
            stock: initialData.stock || "",
            categoryId: initialData.categoryId || "",
        });
        setUploadedImageUrl(initialData.imageUrl?.replace(/^https?:\/\/[^/]+/, "") || "");
        setPreviewUrl(initialData.imageUrl || "");
    }, [initialData]);

    // ✅ REMOVED: categories useEffect - use prop from parent

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const uploadImage = async () => {
        if (!imageFile) return uploadedImageUrl;
        const fd = new FormData();
        fd.append("file", imageFile);
        if (uploadedImageUrl) fd.append("oldImageUrl", uploadedImageUrl);
        const response = await fetch("https://localhost:7250/api/products/upload-image", {
            method: "POST",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            body: fd,
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Upload failed");
        return result.imageUrl;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.description || !formData.price || !formData.stock) {
            setError("Please fill in all required fields");
            return;
        }
        if (!formData.categoryId) {
            setError("Please select a category");
            return;
        }
        setError("");
        setUploading(true);
        try {
            const finalImageUrl = await uploadImage();
            setUploadedImageUrl(finalImageUrl);
            onSubmit({
                ...initialData,
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                stock: parseFloat(formData.stock),
                imageUrl: finalImageUrl,
                categoryId: parseInt(formData.categoryId),
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleCancel = useCallback(() => {
        setFormData({ name: "", description: "", price: "", stock: "", categoryId: "" });
        setImageFile(null);
        setPreviewUrl(initialData.imageUrl || "");
        setError("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        onCancel?.();
    }, [initialData.imageUrl, onCancel]);

    const handleCategoryChange = (e) => {
        setFormData({ ...formData, categoryId: e.target.value });
    };

    const imageSrc = previewUrl.startsWith("blob:") ? previewUrl : `https://localhost:7250${previewUrl}`;
    const isDisabled = loading || uploading;

    return (
        <Box>
            {initialData.id && (
                <TextField
                    label="Product ID"
                    value={initialData.id}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    sx={{
                        ...fieldSx,
                        "& .MuiOutlinedInput-root": {
                            ...fieldSx["& .MuiOutlinedInput-root"],
                            backgroundColor: COLORS.bgPage,
                            color: COLORS.textSecondary,
                        },
                    }}
                />
            )}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2.5, borderRadius: "8px", fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem" }}
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
                {/* ✅ REPLACED: Name + ParentCategorySelect (Leaf nodes only!) */}
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 0 }}>
                    <TextField
                        label="Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        fullWidth
                        required
                        sx={fieldSx}
                    />

                    {/* ✅ APPLIED: ParentCategorySelect - Only leaf/child categories! */}
                    <CategorySelect
                        value={formData.categoryId}
                        onChange={handleCategoryChange}
                        categories={categories}
                        mode="children"  // ✅ Leaf/child categories only
                        disabled={isDisabled}
                        label="Category"
                        currentCategoryId={null}
                    />
                    
                </Box>

                <TextField
                    label="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    fullWidth
                    multiline
                    rows={3}
                    sx={fieldSx}
                />

                {/* Two-column row: Price + Stock */}
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                    <TextField
                        label="Price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        fullWidth
                        required
                        sx={fieldSx}
                    />
                    <TextField
                        label="Stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        fullWidth
                        required
                        sx={fieldSx}
                    />
                </Box>

                {/* Image upload */}
                <Box sx={{ mb: 2.5 }}>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", fontWeight: 600, color: COLORS.textSecondary, mb: 1, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Product Image
                    </Typography>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                    />

                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        {/* Image preview */}
                        <Box
                            sx={{
                                width: 72,
                                height: 72,
                                borderRadius: "10px",
                                border: `1.5px dashed ${previewUrl ? COLORS.primary : COLORS.border}`,
                                overflow: "hidden",
                                flexShrink: 0,
                                backgroundColor: COLORS.bgPage,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {previewUrl ? (
                                <Box
                                    component="img"
                                    src={imageSrc}
                                    alt="preview"
                                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    onError={(e) => { e.target.style.display = "none"; }}
                                />
                            ) : (
                                <CloudUpload sx={{ fontSize: 24, color: COLORS.textLight }} />
                            )}
                        </Box>

                        <Box>
                            <Button
                                variant="outlined"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isDisabled}
                                size="small"
                                sx={{
                                    ...btnSx,
                                    fontSize: "0.8rem",
                                    borderColor: COLORS.border,
                                    color: COLORS.textSecondary,
                                    "&:hover": {
                                        borderColor: COLORS.primary,
                                        color: COLORS.primary,
                                        backgroundColor: COLORS.primaryLight,
                                    },
                                }}
                            >
                                {uploading ? "Uploading…" : previewUrl ? "Change Image" : "Choose Image"}
                            </Button>
                            {previewUrl && (
                                <Typography sx={{ mt: 0.5, fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: COLORS.textLight, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {imageFile?.name || uploadedImageUrl}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>

                {/* Actions */}
                <Box sx={{ display: "flex", gap: 1.5, mt: 1, pt: 2, borderTop: `1px solid #f3f4f6` }}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isDisabled}
                        sx={{
                            ...btnSx,
                            backgroundColor: COLORS.primary,
                            "&:hover": { backgroundColor: COLORS.primaryDark },
                            "&.Mui-disabled": { backgroundColor: COLORS.border, color: COLORS.textLight },
                        }}
                    >
                        {isDisabled ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : initialData.id ? "Update" : "Create"}
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={handleCancel}
                        disabled={isDisabled}
                        sx={{
                            ...btnSx,
                            borderColor: COLORS.border,
                            color: COLORS.textSecondary,
                            "&:hover": {
                                borderColor: COLORS.primary,
                                color: COLORS.primary,
                                backgroundColor: COLORS.primaryLight,
                            },
                        }}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default ProductForm;