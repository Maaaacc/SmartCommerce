import { useEffect, useState } from "react";
import {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct as apiDeleteProduct
} from "../services/productService";

function ProductList() {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [stock, setStock] = useState("");
    const [editingId, setEditingId] = useState(null);

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        setLoading(true);
        try {
            const data = await getAllProducts();
            setProducts(data);
        } catch (error) {
            setErrors({ api: error.message });
        } finally {
            setLoading(false);
        }

    }

    async function handleSubmit(e) {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});

        const productData = {
            id: editingId,
            name,
            description,
            price: parseFloat(price),
            imageUrl,
            stock: parseInt(stock)
        };

        setLoading(true);
        try {
            if (editingId === null) {
                await createProduct(productData);
            } else {
                await updateProduct(editingId, productData);
            }
            loadProducts();
            resetForm();
        } catch (error) {
            setErrors({ api: error.message });
        } finally {
            setLoading(false);
        }
    }

    function editProduct(p) {
        setEditingId(p.id);
        setName(p.name);
        setDescription(p.description);
        setPrice(p.price);
        setImageUrl(p.imageUrl);
        setStock(p.stock);
    }

    async function deleteProduct(id) {
        setLoading(true);

        try {
            await apiDeleteProduct(id);
            loadProducts();
        } catch (error) {
            setErrors({ api: error.message });
        } finally {
            setLoading(false);
        }
    }

    function resetForm() {
        setEditingId(null);
        setName("");
        setDescription("");
        setPrice("");
        setImageUrl("");
        setStock("");
    }

    function validateForm() {
        const newErrors = {};

        if (!name) newErrors.name = "Name is required";
        if (!description) newErrors.description = "Description is required";
        if (!price || price <= 0) newErrors.price = "Price must be greater than 0";
        if (!imageUrl) newErrors.imageUrl = "Image URL is required";
        if (!stock || stock < 0) newErrors.stock = "Stock cannot be negative";
        return newErrors;
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">{editingId ? "Edit Product" : "Add Product"}</h2>

            {loading && <div className="alert alert-info">Loading...</div>}
            {errors.api && <div className="alert alert-danger">{errors.api}</div>}

            <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-2">
                    <input
                        className="form-control"
                        placeholder="Name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    {errors.name && <small className="text-danger">{errors.name}</small>}

                </div>

                <div className="mb-2">
                    <input
                        className="form-control"
                        placeholder="Description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </div>
                {errors.description && <small className="text-danger">{errors.description}</small>}

                <div className="mb-2">
                    <input
                        className="form-control"
                        type="number"
                        placeholder="Price"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                    />
                </div>
                {errors.price && <small className="text-danger">{errors.price}</small>}

                <div className="mb-2">
                    <input
                        className="form-control"
                        placeholder="Image URL"
                        value={imageUrl}
                        onChange={e => setImageUrl(e.target.value)}
                    />
                    {errors.imageUrl && <small className="text-danger">{errors.price}</small>}                </div>

                <div className="mb-2">
                    <input
                        className="form-control"
                        type="number"
                        placeholder="Stock"
                        value={stock}
                        onChange={e => setStock(e.target.value)}
                    />
                    {errors.stock && <small className="text-danger">{errors.stock}</small>}

                </div>

                <button type="submit" className="btn btn-primary">
                    {editingId ? "Update" : "Add"} Product
                </button>
            </form>

            <h3>Product List</h3>
            <ul className="list-group">
                {products.map(p => (
                    <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{p.name}</strong> - {p.description}<br />
                            Price: {p.price} | Stock: {p.stock}<br />
                            {p.imageUrl && <img src={p.imageUrl} alt={p.name} style={{ height: "50px", marginTop: "5px" }} />}
                        </div>
                        <div>
                            <button className="btn btn-sm btn-warning me-2" onClick={() => editProduct(p)}>Edit</button>
                            <button className="btn btn-sm btn-danger" onClick={() => deleteProduct(p.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProductList;
