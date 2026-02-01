import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Paper,
    CircularProgress

} from "@mui/material";

function ProductTable({
    products,
    onEdit,
    onDelete,
    loading = false
}) {
    if (loading) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <CircularProgress />
            </Paper>
        );
    }

    return (
        <Paper sx={{ mt: 2, overflowX: 'auto' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Stock</TableCell>
                        <TableCell sx={{ minWidth: 160 }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.length > 0 ? (
                        products.map((product) => (
                            <TableRow key={product.id} hover>
                                <TableCell>{product.id}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.description}</TableCell>
                                <TableCell>${product.price}</TableCell>
                                <TableCell>{product.stock}</TableCell>
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
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                No products found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Paper>
    );
}

export default ProductTable;
