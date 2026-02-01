export async function loginRequest(email, password) {
    const response = await fetch("https://localhost:7250/api/auth/login", {
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
        throw new Error("Login failed");
    }

    return await response.json();
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