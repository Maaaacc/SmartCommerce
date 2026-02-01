import axios from "axios";

const API_URL = "https://localhost:7250/api/products";

function getAuthHeader() {
    const token = localStorage.getItem("token");
    return {
        Authorization: `Bearer ${token}`
    };
}

// Get all products
export async function fetchProducts() {
    return axios.get(API_URL, {
        headers: getAuthHeader()
    });
}

// Get one product by ID
export async function fetchProductById(id) {
    return axios.get(`${API_URL}/${id}`, { 
        headers: getAuthHeader()
    });
}

// Create a new product
export async function postProduct(product) {
    return axios.post(API_URL, product, {
        headers: getAuthHeader()
    });
}

// Update product
export async function putProduct(id, product) {
    return axios.put(`${API_URL}/${id}`, product, { 
        headers: getAuthHeader()
    });
}

// Delete product
export async function removeProduct(id) {
    return axios.delete(`${API_URL}/${id}`, {  
        headers: getAuthHeader()
    });
}
