import {
    fetchCategories,
    fetchActiveCategories,
    fetchDeletedCategories,
    fetchCategoryById,
    postCategory,
    putCategory,
    removeCategory,
    restoreCategoryApi
} from "../api/categoryApi";

// Get ALL categories
export async function getCategories(){
    const response = await fetchCategories();
    return response.data;
}

// Get ACTIVE categories
export async function getActiveCategories() {
    const response = await fetchActiveCategories();
    return response.data;
}

// Get DELETED categories
export async function getDeletedCategories() {
    const response = await fetchDeletedCategories();
    return response.data;
}

// Get category by ID
export async function getCategoryById(id) {
    const response = await fetchCategoryById(id);
    return response.data;
}

// Create category
export async function createCategory(category) {
    console.log("createCategory dto:", category);

    const response = await postCategory(category);
    return response.data;
}

// Update category
export async function updateCategory(id, category) {
    console.log("updateCategory dto:", category);

    const response = await putCategory(id, category);
    return response.data;
}

// Delete category
export async function deleteCategory(id) {
    await removeCategory(id);
}

// Restore category
export async function restoreCategory(id) {
    const response = await restoreCategoryApi(id);
    return response.data;
}