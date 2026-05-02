import {
    TextField,
    Button,
    Box,
    Alert,
    CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import CategorySelect from "./CategorySelect";
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

function CategoryForm({ initialData = {}, onSubmit, onCancel, loading, categories = [] }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        parentId: null,  // ✅ Clean: parentId for backend
    });
    const [error, setError] = useState("");

    useEffect(() => {
        setFormData({
            name: initialData.name || "",
            description: initialData.description || "",
            parentId: initialData.parentId ?? initialData.parent_id ?? null,  // ✅ Handles both
        });
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value === "" ? "" : value,  // ✅ Strings for name/description
        }));
    };

    const handleParentChange = (e) => {
        const value = e.target.value === "" || e.target.value === "null" ? null : parseInt(e.target.value);
        setFormData((prev) => ({
            ...prev,
            parentId: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name?.trim()) {
            setError("Category name is required");
            return;
        }

        setError("");

        // ✅ Clean payload for what
        const payload = {
            id: initialData.id,
            name: formData.name.trim(),
            description: formData.description || null,
            parentId: formData.parentId,  // ✅ Number or null
        };

        console.log("🚀 Sending to backend:", payload);
        onSubmit(payload);
    };

    const handleCancel = () => {
        setFormData({ name: "", description: "", parentId: null });
        setError("");
        onCancel?.();
    };

    return (
        <Box>
            {/* Category ID (read-only for edit) */}
            {initialData.id && (
                <TextField
                    label="Category ID"
                    value={initialData.id}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    sx={{
                        ...fieldSx,
                        "& .MuiOutlinedInput-root": {
                            ...fieldSx["& .MuiOutlinedInput-root"],
                            backgroundColor: COLORS.bgPage,
                            color: COLORS.success,
                        },
                    }}
                />
            )}

            {/* Error Alert */}
            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 2,
                        borderRadius: "8px",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.85rem",
                    }}
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>
            )}

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit}>
                {/* Name Field */}
                <TextField
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    required
                    placeholder="e.g. Electronics"
                    sx={fieldSx}
                />

                {/* Description Field */}
                <TextField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Brief description of the category…"
                    sx={fieldSx}
                />

                {/* ✅ CLEAN SEPARATED Parent Category */}
                <CategorySelect
                    value={formData.parentId}
                    onChange={handleParentChange}
                    categories={categories}
                    currentCategoryId={initialData?.id}
                    mode="parent"  // ✅ Top-level categories only
                    label="Parent Category"
                />

                {/* Action Buttons */}
                <Box sx={{ display: "flex", gap: 1.5, mt: 1 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{
                            ...btnSx,
                            backgroundColor: COLORS.primary,
                            "&:hover": { backgroundColor: COLORS.primaryDark },
                            "&.Mui-disabled": {
                                backgroundColor: COLORS.border,
                                color: COLORS.textLight,
                            },
                        }}
                    >
                        {loading ? (
                            <CircularProgress size={16} sx={{ color: "#fff" }} />
                        ) : initialData.id ? "Update Category" : "Create Category"}
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={handleCancel}
                        disabled={loading}
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

export default CategoryForm;