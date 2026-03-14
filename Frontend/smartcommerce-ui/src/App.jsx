import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from "./pages/Home";
import Products from "./pages/admin/ProductPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Navbar from "./components/layout/Navbar";
import { useState, useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoutes";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Protected products route*/}
        <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/orders" element={<div>Orders Page</div>} />
        <Route path="/customers" element={<div>Customers Page</div>} />
        <Route path="/reports" element={<div>Reports Page</div>} />
        <Route path="/categories" element={<div>Categories Page</div>} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
