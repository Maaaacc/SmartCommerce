import { Navigate } from "react-router-dom";
import { getRole } from "../services/authService";

export default function AdminRoute({ children }) {
    const role = getRole();

    if (!role) {
        return <Navigate to="/login" replace />;
    }

    if (role !== "Admin") {
        return <Navigate to="/" replace />;
    }

    return children;
}