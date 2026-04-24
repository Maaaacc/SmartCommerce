import axios from "axios";

const API_URL = "https://localhost:7250/api/categories"; // Fixed path

function getAuthHeader() {
    const token = localStorage.getItem("token");
    return {
        Authorization: `Bearer ${token}`
    };
}

// Get ALL categories

export async function fetchCategories(){
    return axios.get(`${API_URL}`,{
        headers: getAuthHeader()
    });
}

// Get ACTIVE categories
export async function fetchActiveCategories() {
    return axios.get(`${API_URL}/active`, {
        headers: getAuthHeader()
    });
}

// Get DELETED categories
export async function fetchDeletedCategories() {
    return axios.get(`${API_URL}/deleted`, {
        headers: getAuthHeader()
    });
}

// Get category by ID
export async function fetchCategoryById(id) {
    return axios.get(`${API_URL}/${id}`, {
        headers: getAuthHeader()
    });
}

// Create category
export async function postCategory(category) {
    return axios.post(API_URL, category, {
        headers: getAuthHeader()
    });
}

// Update category
export async function putCategory(id, category) {
    return axios.put(`${API_URL}/${id}`, category, {
        headers: getAuthHeader()
    });
}

// Delete category
export async function removeCategory(id) {
    return axios.delete(`${API_URL}/${id}`, {
        headers: getAuthHeader()
    });
}

// Restore category (PATCH /id/restore)
export async function restoreCategoryApi(id) {
    return axios.patch(`${API_URL}/${id}/restore`, {}, {
        headers: getAuthHeader()
    });
}