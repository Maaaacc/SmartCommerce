import {
    fetchProducts,
    fetchProductById,
    postProduct,
    putProduct,
    removeProduct
} from "../api/productApi";


export async function getProducts() {
    const response = await fetchProducts();
    return response.data;
}

export async function getProductById(id) {
    const response = await fetchProductById(id);
    return response.data;
}

export async function createProduct(product) {
    const response = await postProduct(product);
    return response.data;
}

export async function updateProduct(id, product) {
    const response = await putProduct(id, product);
    return response.data;
}

export async function deleteProduct(id) {
    await removeProduct(id);
}
