import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import Home from "./pages/Home";
import Products from "./pages/admin/ProductPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { logout, getRole } from "./services/authService";
import { useState, useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoutes";

function NavBar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const role = getRole();

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav style={{ marginBottom: "20px" }}>
      <Link to="/">Home</Link> | {" "}
      
      {role === "Admin" && (
        <>
          <Link to="/products">Products</Link> | {" "}
        </>
      )}
      {!isLoggedIn && (
        <>
          <Link to="/login">Login</Link> | {" "}
          <Link to="/register">Register</Link>
        </>
      )}
      {isLoggedIn && (
        <button onClick={handleLogout} style={{ cursor: "pointer" }}>Logout</button>
      )}
    </nav>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Protected products route*/}
        <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
