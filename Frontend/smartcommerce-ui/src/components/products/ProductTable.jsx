import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Paper,
    CircularProgress,
    TablePagination,
    TableContainer,
} from "@mui/material";
import { useState } from "react";

function ProductTable({
    products,
    categories = [],
    onEdit,
    onDelete,
    loading = false,
    searchTerm = "",
    isAdmin
}) {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedProducts = filteredProducts.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );



    if (loading) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <CircularProgress />
            </Paper>
        );
    }

    const ProductImage = ({ imageUrl, name, size = 60 }) => {
        const [hasError, setHasError] = useState(false);

        if (hasError || !imageUrl) {
            return (
                <div
                    style={{
                        width: size, height: size,
                        background: '#f5f5f5',
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 'bold',
                        color: '#666'
                    }}
                >
                    {name[0].toUpperCase()}
                </div>
            );
        }

        return (
            <img
                src={`https://localhost:7250${imageUrl}`}
                alt={name}
                style={{
                    width: size,
                    height: size,
                    objectFit: 'cover',
                    borderRadius: 4
                }}
                onError={() => setHasError(true)}
            />
        );
    };


    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', mt: 2 }}>
            <TableContainer sx={{ maxHeight: 700 }}>
                <Table stickyHeader sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Image</TableCell>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Stock</TableCell>
                            {isAdmin && <TableCell sx={{ minWidth: 160 }}>Actions</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedProducts.length > 0 ? (
                            paginatedProducts.map((product) => (
                                <TableRow key={product.id} hover>
                                    <TableCell><ProductImage imageUrl={product.imageUrl} name={product.name} /></TableCell>
                                    <TableCell>{product.id}</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.description}</TableCell>
                                    <TableCell>
                                        {categories && product.categoryId
                                            ? categories.find(c => c.id === product.categoryId)?.name || "Unknown"
                                            : "-"
                                        }
                                    </TableCell>
                                    <TableCell>${product.price}</TableCell>
                                    <TableCell>{product.stock}</TableCell>
                                    {isAdmin && (
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                sx={{ mr: 1 }}
                                                onClick={() => onEdit(product)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                color="error"
                                                variant="outlined"
                                                size="small"
                                                onClick={() => onDelete(product.id)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={isAdmin ? 6 : 5} align="center" sx={{ py: 4 }}>
                                    No products found
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
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                    '.MuiTablePagination-toolbar': {
                        alignItems: 'center',
                    },
                    '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                        margin: 0,
                    },
                }}
            />
        </Paper>
    );
}

export default ProductTable;