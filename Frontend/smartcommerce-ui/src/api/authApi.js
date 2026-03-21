export async function loginRequest(email, password) {
    try {
        const response = await fetch("https://localhost:7250/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error("Invalid email or password");
        }

        return await response.json();

    } catch (error) {
        // This catches network errors like ERR_CONNECTION_REFUSED
        if (error.name === "TypeError") {
            throw new Error("Cannot connect to server. Backend is not running.");
        }

        throw error;
    }
}

export async function registerRequest(email, password) {
    const response = await fetch("https://localhost:7250/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    if (!response.ok) {
        let errorText = "Registration failed";
        try {
            const errorData = await response.json();
            errorText = errorData.message || errorText;
        } catch {
            errorText = await response.text();
        }

        throw new Error(errorText);
    }

    let result;
    try {
        result = await response.json();
    } catch {
        result = { message: await response.text() };
    }

    return result;
}