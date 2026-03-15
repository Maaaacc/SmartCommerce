import { getToken } from './authService';

export async function verifyToken() {
  const token = getToken();
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await fetch("https://localhost:7250/api/auth/verify", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error('Token verification failed');
    }

    return await response.json();
  } catch (error) {
    localStorage.removeItem("token"); // Clear invalid token
    throw error;
  }
}
