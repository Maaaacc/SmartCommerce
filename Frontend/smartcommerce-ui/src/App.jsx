import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProductPage from "./pages/admin/ProductPage";
import CategoryPage from "./pages/admin/CategoryPage";

// Layout & guards
import Navbar from "./components/layout/Navbar";
import RequireAuth from "./guards/RequireAuth";
import AdminProtectedRoute from "./guards/AdminProtectedRoute";

import "./App.css";
// Themes & styles
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme";

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>

        <Navbar />

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin-only routes */}
          <Route
            path="/admin/products"
            element={
              <RequireAuth>
                <AdminProtectedRoute>
                  <ProductPage />
                </AdminProtectedRoute>
              </RequireAuth>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <RequireAuth>
                <AdminProtectedRoute>
                  <CategoryPage />
                </AdminProtectedRoute>
              </RequireAuth>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <RequireAuth>
                <AdminProtectedRoute>
                  <div>Orders (Admin)</div>
                </AdminProtectedRoute>
              </RequireAuth>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <RequireAuth>
                <AdminProtectedRoute>
                  <div>Customers (Admin)</div>
                </AdminProtectedRoute>
              </RequireAuth>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <RequireAuth>
                <AdminProtectedRoute>
                  <div>Reports (Admin)</div>
                </AdminProtectedRoute>
              </RequireAuth>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;