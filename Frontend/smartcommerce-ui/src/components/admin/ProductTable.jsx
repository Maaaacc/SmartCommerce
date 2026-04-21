// src/components/admin/ProductTable.jsx
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    CircularProgress,
    TablePagination,
    TableContainer,
    Chip,
    Box,
    Typography,
    IconButton,
    Tooltip,
} from "@mui/material";
import { Edit, Delete, RestoreFromTrash } from "@mui/icons-material";
import { useState } from "react";
import { COLORS } from "../../theme/colors";

const headerCellSx = {
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600,
    fontSize: "0.72rem",
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    color: COLORS.textSecondary,
    backgroundColor: COLORS.bgPage,
    borderBottom: `1px solid ${COLORS.border}`,
    py: 1.5,
};

const bodyCellSx = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.875rem",
    color: COLORS.textPrimary,
    borderBottom: "1px solid #f3f4f6",
    py: 1.5,
};

const ProductImage = ({ imageUrl, name, size = 44 }) => {
    const [hasError, setHasError] = useState(false);

    if (hasError || !imageUrl) {
        return (
            <Box
                sx={{
                    width: size,
                    height: size,
                    borderRadius: "8px",
                    background: `linear-gradient(135deg, ${COLORS.primaryLight} 0%, ${COLORS.successLight} 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    fontWeight: 700,
                    color: COLORS.primary,
                    fontFamily: "'DM Sans', sans-serif",
                    flexShrink: 0,
                    border: `1px solid ${COLORS.border}`,
                }}
            >
                {name?.[0]?.toUpperCase() ?? "?"}
            </Box>
        );
    }

    return (
        <Box
            component="img"
            src={`https://localhost:7250${imageUrl}`}
            alt={name}
            sx={{
                width: size,
                height: size,
                objectFit: "cover",
                borderRadius: "8px",
                display: "block",
                border: `1px solid ${COLORS.border}`,
            }}
            onError={() => setHasError(true)}
        />
    );
};

const StockBadge = ({ stock }) => {
    let bg, color, label;
    if (stock === 0) { bg = "#fef2f2"; color = "#dc2626"; label = "Out"; }
    else if (stock < 10) { bg = "#fffbeb"; color = "#d97706"; label = stock; }
    else { bg = COLORS.successLight; color = "#1a7a56"; label = stock; }

    return (
        <Chip
            label={label}
            size="small"
            sx={{
                fontFamily: "'DM Mono', monospace",
                fontWeight: 600,
                fontSize: "0.75rem",
                height: 22,
                borderRadius: "5px",
                backgroundColor: bg,
                color,
                "& .MuiChip-label": { px: 1 },
            }}
        />
    );
};

function ProductTable({
    products,
    categories = [],
    onEdit,
    onDelete,
    onRestore,          // ✅ NEW
    loading = false,
    searchTerm = "",
    isAdmin,
    showDeleted = false, // ✅ NEW
}) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const filteredProducts = products.filter(
        (p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedProducts = filteredProducts.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    if (loading) {
        return (
            <Paper
                sx={{
                    p: 6,
                    textAlign: "center",
                    borderRadius: "12px",
                    border: `1px solid ${COLORS.border}`,
                    boxShadow: "none",
                    backgroundColor: COLORS.bgPaper,
                }}
            >
                <CircularProgress size={32} thickness={4} sx={{ color: COLORS.primary }} />
                <Typography sx={{ mt: 2, fontFamily: "'DM Sans', sans-serif", color: COLORS.textSecondary, fontSize: "0.85rem" }}>
                    Loading products…
                </Typography>
            </Paper>
        );
    }

    const columns = ["Image", "ID", "Name", "Description", "Category", "Price", "Stock", ...(isAdmin ? ["Actions"] : [])];

    return (
        <Paper
            sx={{
                width: "100%",
                overflow: "hidden",
                borderRadius: "12px",
                border: `1px solid ${COLORS.border}`,
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                backgroundColor: COLORS.bgPaper,
            }}
        >
            <TableContainer sx={{ maxHeight: 700 }}>
                <Table stickyHeader sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            {columns.map((h) => (
                                <TableCell key={h} sx={headerCellSx}>{h}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedProducts.length > 0 ? (
                            paginatedProducts.map((product) => (
                                <TableRow
                                    key={product.id}
                                    hover
                                    sx={{
                                        "&:hover": { backgroundColor: "#fafafa" },
                                        "&:last-child td": { borderBottom: "none" },
                                    }}
                                >
                                    <TableCell sx={{ ...bodyCellSx, py: 1.2 }}>
                                        <ProductImage imageUrl={product.imageUrl} name={product.name} />
                                    </TableCell>
                                    <TableCell sx={{ ...bodyCellSx, fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", color: COLORS.textSecondary }}>
                                        #{product.id}
                                    </TableCell>
                                    <TableCell sx={{ ...bodyCellSx, fontWeight: 500 }}>
                                        {product.name}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            ...bodyCellSx,
                                            color: COLORS.textSecondary,
                                            maxWidth: 200,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {product.description || "—"}
                                    </TableCell>
                                    <TableCell sx={bodyCellSx}>
                                        {categories && product.categoryId
                                            ? categories.find((c) => c.id === product.categoryId)?.name || (
                                                <Typography sx={{ color: COLORS.textLight, fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif" }}>
                                                    Unknown
                                                </Typography>
                                            )
                                            : "—"}
                                    </TableCell>
                                    <TableCell sx={{ ...bodyCellSx, fontFamily: "'DM Mono', monospace", fontWeight: 600, color: COLORS.accent }}>
                                        ${Number(product.price).toFixed(2)}
                                    </TableCell>
                                    <TableCell sx={bodyCellSx}>
                                        <StockBadge stock={product.stock} />
                                    </TableCell>
                                    {isAdmin && (
                                        <TableCell sx={bodyCellSx}>
                                            <Box sx={{ display: "flex", gap: 0.5 }}>
                                                {showDeleted ? (
                                                    // ✅ Restore button — only shown in deleted view
                                                    <Tooltip title="Restore">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => onRestore(product.id)}
                                                            sx={{
                                                                color: COLORS.textSecondary,
                                                                border: `1px solid ${COLORS.border}`,
                                                                borderRadius: "7px",
                                                                p: 0.6,
                                                                "&:hover": {
                                                                    color: "#1a7a56",
                                                                    borderColor: "#6ee7b7",
                                                                    backgroundColor: COLORS.successLight,
                                                                },
                                                            }}
                                                        >
                                                            <RestoreFromTrash sx={{ fontSize: 16 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                ) : (
                                                    // ✅ Normal Edit + Delete — only shown in active view
                                                    <>
                                                        <Tooltip title="Edit">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => onEdit(product)}
                                                                sx={{
                                                                    color: COLORS.textSecondary,
                                                                    border: `1px solid ${COLORS.border}`,
                                                                    borderRadius: "7px",
                                                                    p: 0.6,
                                                                    "&:hover": {
                                                                        color: COLORS.primary,
                                                                        borderColor: COLORS.primary,
                                                                        backgroundColor: COLORS.primaryLight,
                                                                    },
                                                                }}
                                                            >
                                                                <Edit sx={{ fontSize: 16 }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => onDelete(product.id)}
                                                                sx={{
                                                                    color: COLORS.textSecondary,
                                                                    border: `1px solid ${COLORS.border}`,
                                                                    borderRadius: "7px",
                                                                    p: 0.6,
                                                                    "&:hover": {
                                                                        color: "#dc2626",
                                                                        borderColor: "#fca5a5",
                                                                        backgroundColor: "#fef2f2",
                                                                    },
                                                                }}
                                                            >
                                                                <Delete sx={{ fontSize: 16 }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </>
                                                )}
                                            </Box>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    align="center"
                                    sx={{ py: 6, color: COLORS.textSecondary, fontFamily: "'DM Sans', sans-serif" }}
                                >
                                    {searchTerm ? `No results for "${searchTerm}"` : "No products found"}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component="div"
                count={filteredProducts.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_, p) => setPage(p)}
                onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                sx={{
                    borderTop: "1px solid #f3f4f6",
                    fontFamily: "'DM Sans', sans-serif",
                    ".MuiTablePagination-toolbar": { alignItems: "center", minHeight: 48 },
                    ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                        margin: 0,
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.82rem",
                        color: COLORS.textSecondary,
                    },
                    ".MuiSelect-select": { fontFamily: "'DM Sans', sans-serif" },
                }}
            />
        </Paper>
    );
}

export default ProductTable;