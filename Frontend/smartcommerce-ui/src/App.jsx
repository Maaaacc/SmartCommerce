// app.jsx - Updated version
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from "./pages/Home";
import ProductPage from "./pages/admin/ProductPage";
import CategoryPage from "./pages/admin/CategoryPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Navbar from "./components/layout/Navbar"; // Fixed path
import ProtectedRoute from "./components/ProtectedRoutes"; // Fixed path

function App() {
  return (
    <Router>
      <Navbar /> {/* Removed isLoggedIn prop - Navbar handles it internally */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProtectedRoute><ProductPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><div>Orders Page</div></ProtectedRoute>} />
        <Route path="/customers" element={<ProtectedRoute><div>Customers Page</div></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><div>Reports Page</div></ProtectedRoute>} />
        <Route path="/categories" element={<ProtectedRoute><CategoryPage /></ProtectedRoute>} />        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
