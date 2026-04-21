// src/components/admin/CategoryTable.jsx
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
    Tooltip,
    IconButton,
    Typography,
    Box,
} from "@mui/material";
import { useState, useMemo, useCallback } from "react";
import { Edit, Delete, Restore } from "@mui/icons-material";
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
    borderBottom: `1px solid #f3f4f6`,
    py: 1.5,
};

// ✅ NEW: Find parent category name
function getParentId(parentId, currentId) {
    if (!parentId || parentId === currentId) return null;
    return parentId;  // Raw ID only
}

function CategoryTable({
    categories,
    onEdit,
    onDelete,
    onRestore,
    loading = false,
    searchTerm = "",
}) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // ✅ UPDATED: Filter includes parent name too
    const filteredCategories = useMemo(() =>
        categories.filter((cat) => {
            const parentId = getParentId(cat.parentId || cat.parent_id, cat.id);
            const parentIdStr = parentId ? parentId.toString() : "";
            const searchLower = searchTerm.toLowerCase();

            return (
                cat.name.toLowerCase().includes(searchLower) ||
                parentIdStr.includes(searchLower) ||  // ✅ Search Parent ID
                cat.description?.toLowerCase().includes(searchLower)
            );
        }), [categories, searchTerm]
    );

    const paginatedCategories = useMemo(() =>
        filteredCategories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [filteredCategories, page, rowsPerPage]
    );

    // ✅ NEW: Handle pagination reset
    const handleRowsPerPageChange = useCallback((e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    }, []);

    if (loading) {
        return (
            <Paper sx={{
                p: 6,
                textAlign: "center",
                borderRadius: "12px",
                border: `1px solid ${COLORS.border}`,
                boxShadow: "none",
                backgroundColor: COLORS.bgPaper,
            }}>
                <CircularProgress size={32} thickness={4} sx={{ color: COLORS.primary }} />
                <Typography sx={{ mt: 2, fontFamily: "'DM Sans', sans-serif", color: COLORS.textSecondary, fontSize: "0.85rem" }}>
                    Loading categories…
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper sx={{
            width: "100%",
            overflow: "hidden",
            borderRadius: "12px",
            border: `1px solid ${COLORS.border}`,
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            backgroundColor: COLORS.bgPaper,
        }}>
            <TableContainer sx={{ maxHeight: 700 }}>
                <Table stickyHeader sx={{ minWidth: 750 }}> {/* ✅ Increased width for new column */}
                    <TableHead>
                        <TableRow>
                            {["ID", "Name", "Parent", "Description", "Status", "Actions"].map((h) => ( // ✅ Added "Parent"
                                <TableCell key={h} sx={headerCellSx}>{h}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedCategories.length > 0 ? (
                            paginatedCategories.map((category) => {
                                // ✅ Handle both parentId and parent_id from backend
                                const parentId = category.parentId || category.parent_id;
                                const displayParentId = getParentId(parentId, category.id);  // ✅ Raw ID

                                return (
                                    <TableRow
                                        key={category.id}
                                        hover
                                        sx={{
                                            "&:hover": { backgroundColor: "#fafafa" },
                                            "&:last-child td": { borderBottom: "none" },
                                        }}
                                    >
                                        <TableCell sx={{
                                            ...bodyCellSx,
                                            fontFamily: "'DM Mono', monospace",
                                            fontSize: "0.78rem",
                                            color: COLORS.textSecondary
                                        }}>
                                            #{category.id}
                                        </TableCell>

                                        <TableCell sx={{ ...bodyCellSx, fontWeight: 500 }}>
                                            {category.name}
                                        </TableCell>

                                        {/* ✅ NEW PARENT COLUMN */}
                                        <TableCell sx={{ ...bodyCellSx, color: COLORS.textSecondary }}>
                                            {displayParentId ? (
                                                <Chip
                                                    label={`#${displayParentId}`}  // ✅ #123 format
                                                    size="small"
                                                    sx={{
                                                        fontFamily: "'DM Mono', monospace",
                                                        fontSize: "0.7rem",
                                                        height: 22,
                                                        backgroundColor: COLORS.primaryLight,
                                                        color: COLORS.primary,
                                                        fontWeight: 600,
                                                        "& .MuiChip-label": { px: 1 },
                                                    }}
                                                />
                                            ) : (
                                                <Typography variant="body2" sx={{ color: COLORS.textLight, fontStyle: 'italic' }}>
                                                    Top-level
                                                </Typography>
                                            )}
                                        </TableCell>

                                        <TableCell sx={{
                                            ...bodyCellSx,
                                            color: COLORS.textSecondary,
                                            maxWidth: 200, // ✅ Reduced width
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap"
                                        }}>
                                            {category.description || "—"}
                                        </TableCell>

                                        <TableCell sx={bodyCellSx}>
                                            <Chip
                                                label={category.isDeleted ? "Deleted" : "Active"}
                                                size="small"
                                                sx={{
                                                    fontFamily: "'DM Sans', sans-serif",
                                                    fontWeight: 600,
                                                    fontSize: "0.72rem",
                                                    height: 22,
                                                    borderRadius: "5px",
                                                    "& .MuiChip-label": { px: 1 },
                                                    ...(category.isDeleted
                                                        ? { backgroundColor: "#fef2f2", color: "#dc2626" }
                                                        : { backgroundColor: COLORS.successLight, color: "#1a7a56" }),
                                                }}
                                            />
                                        </TableCell>

                                        <TableCell sx={bodyCellSx}>
                                            <Box sx={{ display: "flex", gap: 0.5 }}>
                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => onEdit(category)}
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

                                                {!category.isDeleted ? (
                                                    <Tooltip title="Delete">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => onDelete(category.id)}
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
                                                ) : (
                                                    <Tooltip title="Restore">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => onRestore(category.id)}
                                                            sx={{
                                                                color: COLORS.textSecondary,
                                                                border: `1px solid ${COLORS.border}`,
                                                                borderRadius: "7px",
                                                                p: 0.6,
                                                                "&:hover": {
                                                                    color: "#1a7a56",
                                                                    borderColor: COLORS.success,
                                                                    backgroundColor: COLORS.successLight,
                                                                },
                                                            }}
                                                        >
                                                            <Restore sx={{ fontSize: 16 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 6, color: COLORS.textSecondary, fontFamily: "'DM Sans', sans-serif" }}>
                                    {searchTerm ? `No results for "${searchTerm}"` : "No categories found"}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component="div"
                count={filteredCategories.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_, p) => setPage(p)}
                onRowsPerPageChange={handleRowsPerPageChange}
                sx={{
                    borderTop: `1px solid #f3f4f6`,
                    fontFamily: "'DM Sans', sans-serif",
                    ".MuiTablePagination-toolbar": { alignItems: "center", minHeight: 48 },
                    ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                        margin: 0,
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.82rem",
                        color: COLORS.textSecondary,
                    },
                }}
            />
        </Paper>
    );
}

export default CategoryTable;