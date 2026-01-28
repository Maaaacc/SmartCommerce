import { useEffect, useState } from 'react';

function ProductList() {
    // stores product from the API
    const [products, setProducts] = useState([]);

    const [editingId, setEditingId] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [imageUrl, setImageUrl] = useState("");
    const [stock, setStock] = useState(0);



    useEffect(() => {
        loadProducts();
    }, []);

    function loadProducts() {
        fetch("https://localhost:7250/api/products")
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error("Error:", error));
    }

    function handleSubmit(e) {
        e.preventDefault();

        const productData = {
            name: name,
            description: description,
            price: parseFloat(price),
            imageUrl: imageUrl,
            stock: parseInt(stock)
        }

        if (editingId === null) {
            // Create new product
            fetch("https://localhost:7250/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(productData)
            })
                .then(res => res.json())
                .then(() => {
                    loadProducts();
                    resetForm();
                });
        } else {
            // Update existing product
            fetch("https://localhost:7250/api/products/" + editingId, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(productData)
            })
                .then(res => res.json())
                .then(() => {
                    loadProducts();
                    resetForm();
                })
        }




    }

    function deleteProduct(id) {
        fetch("https://localhost:7250/api/products/" + id, {
            method: "DELETE"
        })
            .then(() => loadProducts());
    }

    function editProduct(product) {
        setEditingId(product.id);
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setImageUrl(product.imageUrl);
        setStock(product.stock);
    }

    function resetForm() {
        setEditingId(null);
        setName("");
        setDescription("");
        setPrice(0);
        setImageUrl("");
        setStock(0);
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    placeholder='Name'
                    value={name}
                    onChange={e => setName(e.target.value)}
                /> <br />

                <input
                    placeholder='Description'
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                /> <br />

                <input
                    placeholder='Price'
                    type='number'
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                /> <br />

                <input
                    placeholder='Image URL'
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                /> <br />

                <input
                    placeholder='Stock'
                    type='number'
                    value={stock}
                    onChange={e => setStock(e.target.value)}
                /> <br />

                <button>Add Product</button>

            </form>

            <ul>
                {products.map(p => (
                    <li key={p.id}>
                        <strong>{p.name}</strong><br />
                        {p.description}<br />
                        Price: {p.price}<br />
                        Image: <img src={p.imageUrl} alt={p.name} width="100" /><br />
                        Stock: {p.stock}
                        <button onClick={() => editProduct(p)}>
                            Edit
                        </button>
                        <button onClick={() => deleteProduct(p.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ProductList;