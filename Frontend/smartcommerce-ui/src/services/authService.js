import { loginRequest, registerRequest } from "../api/authApi";
import { jwtDecode } from "jwt-decode";
import { verifyToken } from "./verifyToken";

export async function login(email, password) {
    const data = await loginRequest(email, password);

    localStorage.setItem("token", data.token);

    return data;
}

export async function register(email, password) {
    return await registerRequest(email, password);
}
export function logout() {
    localStorage.removeItem("token");
}

export function getToken() {
    return localStorage.getItem("token");
}

export function getRole() {
    const token = getToken();
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded.role || null;

    } catch (err) {
        console.error("Invalid token", err);
        return null;
    }
}

export function isAdmin() {
    return getRole() === "Admin";
}

export function isLoggedIn() {
    return !!getToken();
}

export function getEmail() {
    const token = getToken();
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded.email || null;

    } catch (err) {
        console.error("Invalid token", err);
        return null;
    }
}

export async function verifyAuth() {
    try {
        const token = getToken();
        if (!token) return false;

        await verifyToken();
        return true;
    } catch (error) {
        localStorage.removeItem("token");
        return false;
    }
}
