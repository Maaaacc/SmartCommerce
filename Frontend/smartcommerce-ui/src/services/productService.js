import {
    fetchProducts,
    fetchProductById,
    postProduct,
    putProduct,
    removeProduct,
    fetchDeletedProducts,   // ✅ NEW
    patchRestoreProduct,    // ✅ NEW
} from "../api/productApi";

import { getActiveCategories } from "./categoryService";

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

export async function getActiveCategoriesForProduct() {
    return await getActiveCategories();
}

export async function getDeletedProducts() {
    const response = await fetchDeletedProducts();
    return response.data;
}

export async function restoreProduct(id) {
    await patchRestoreProduct(id);
}