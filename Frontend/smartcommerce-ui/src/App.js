import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from "./pages/Home";
import Products from "./pages/Products";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | {" "}
        <Link to="/products">Products</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </Router>

  );
}

export default App;
