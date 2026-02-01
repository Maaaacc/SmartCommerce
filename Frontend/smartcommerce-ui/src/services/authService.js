import { loginRequest } from "../api/authApi";
import { registerRequest } from "../api/authApi";

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