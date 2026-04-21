import { useState, useEffect } from "react";
import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";

const CATEGORIES = [
    { id: "", label: "All Categories" },
    { id: 1, label: "Category 1" },
    { id: 2, label: "Category 2" },
    { id: 3, label: "Category 3" },
];

const SORT_OPTIONS = [
    { value: "name", label: "Name" },
    { value: "priceLow", label: "Price: Low → High" },
    { value: "priceHigh", label: "Price: High → Low" },
];

const COLORS = {
    // Brand: unique electric‑indigo
    primary: "#5D5FEF",           // main brand color
    primaryDark: "#4A4BCB",       // hover / active
    primaryLight: "#E0E0FF",      // subtle background / active category

    // Warm accent for price / highlights
    accent: "#FF6F61",            // coral pink (price / sale / highlight)
    accentLight: "#FFE5E2",       // soft background (e.g., “Sale” badge)

    // Success / stock
    success: "#3ECF8E",           // in‑stock, success messages
    successLight: "#E0F7EF",

    // Backgrounds & text
    bgPage: "#F8F9FA",
    bgPaper: "#FFFFFF",
    border: "#E0E0E0",

    textPrimary: "#212529",
    textSecondary: "#6C757D",
    textLight: "#888888",
};

const sx = {
    page: {
        minHeight: "100vh",
        backgroundColor: COLORS.bgPage,
        fontFamily: "'Segoe UI', sans-serif",
    },

    topBarOuter: {
        maxWidth: "1260px",
        margin: "0 auto",
        padding: "16px 12px"
    },

    topBar: {
        backgroundColor: COLORS.primary,
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    },
    searchWrapper: {
        flex: 1,
        maxWidth: "560px",
        display: "flex",
        backgroundColor: COLORS.bgPaper,
        borderRadius: "2px",
        overflow: "hidden",
    },
    searchInput: {
        flex: 1,
        border: "none",
        outline: "none",
        padding: "8px 12px",
        fontSize: "14px",
        color: COLORS.textPrimary,
    },
    searchBtn: {
        backgroundColor: COLORS.primaryDark,
        border: "none",
        padding: "0 18px",
        cursor: "pointer",
        color: "#fff",
        fontSize: "18px",
        display: "flex",
        alignItems: "center",
    },
    sortBar: {
        display: "flex",
        alignItems: "center",
        gap: "0",
        marginLeft: "auto",
        border: "1px solid rgba(255,255,255,0.5)",
        borderRadius: "2px",
        overflow: "hidden",
    },
    sortLabel: {
        color: "rgba(255,255,255,0.85)",
        fontSize: "13px",
        padding: "6px 12px",
        backgroundColor: "rgba(0,0,0,0.1)",
        whiteSpace: "nowrap",
    },
    body: {
        display: "flex",
        maxWidth: "1260px",
        margin: "0 auto",
        padding: "16px 12px",
        gap: "12px",
        alignItems: "flex-start",
    },
    sidebar: {
        width: "180px",
        flexShrink: 0,
        backgroundColor: COLORS.bgPaper,
        borderRadius: "4px",
        overflow: "hidden",
        position: "sticky",
        top: "64px",
        border: `1px solid ${COLORS.border}`,
    },
    sidebarHeader: {
        padding: "12px 14px",
        borderBottom: "1px solid #f0f0f0",
        fontSize: "14px",
        fontWeight: 700,
        color: COLORS.textPrimary,
        display: "flex",
        alignItems: "center",
        gap: "6px",
    },
    catItem: (active) => ({
        padding: "9px 14px",
        fontSize: "13px",
        cursor: "pointer",
        color: active ? COLORS.primary : COLORS.textSecondary,
        backgroundColor: active ? COLORS.primaryLight : "transparent",
        borderLeft: active ? "3px solid" : "3px solid transparent",
        borderColor: active ? COLORS.primary : "transparent",
        fontWeight: active ? 600 : 400,
        transition: "all 0.15s",
        userSelect: "none",
    }),
    main: {
        flex: 1,
        minWidth: 0,
    },
    resultsBar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 14px",
        backgroundColor: COLORS.bgPaper,
        borderRadius: "4px",
        marginBottom: "10px",
        fontSize: "13px",
        color: COLORS.textSecondary,
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: "10px",
    },
};

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [sort, setSort] = useState("name");
    const [categoryId, setCategoryId] = useState("");

    useEffect(() => {
        getProducts()
            .then(setProducts)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSearch = () => setSearchTerm(searchInput);

    const filtered = products
        .filter((p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((p) => !categoryId || p.categoryId === categoryId)
        .sort((a, b) => {
            if (sort === "priceLow") return a.price - b.price;
            if (sort === "priceHigh") return b.price - a.price;
            return a.name.localeCompare(b.name);
        });

    return (
        <div style={sx.page}>
            <div style={sx.topBarOuter}>
                <div style={sx.topBar}>
                    <div style={sx.searchWrapper}>
                        <input
                            style={sx.searchInput}
                            placeholder="Search products..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        />
                        <button style={sx.searchBtn} onClick={handleSearch}>
                            🔍
                        </button>
                    </div>

                    {/* Sort pills */}
                    <div style={sx.sortBar}>
                        <span style={sx.sortLabel}>Sort by</span>
                        {SORT_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setSort(opt.value)}
                                style={{
                                    border: "none",
                                    padding: "6px 14px",
                                    fontSize: "13px",
                                    cursor: "pointer",
                                    whiteSpace: "nowrap",
                                    backgroundColor: sort === opt.value ? "#fff" : "rgba(255,255,255,0.15)",
                                    color: sort === opt.value ? COLORS.primary : "#fff",
                                    fontWeight: sort === opt.value ? 600 : 400,
                                    transition: "all 0.15s",
                                }}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Body (sidebar + main grid) ── */}
            <div style={sx.body}>
                {/* Sidebar (180px fixed) */}
                <div style={sx.sidebar}>
                    <div style={sx.sidebarHeader}>
                        <span>☰</span> Filter
                    </div>

                    <div style={{ borderBottom: "1px solid #f0f0f0", padding: "10px 14px 4px" }}>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
                            Category
                        </div>
                        {CATEGORIES.map((cat) => (
                            <div
                                key={cat.id}
                                style={sx.catItem(categoryId === cat.id)}
                                onClick={() => setCategoryId(cat.id)}
                            >
                                {cat.label}
                            </div>
                        ))}
                    </div>

                    <div style={{ padding: "10px 14px 14px" }}>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "#ccc", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            More filters soon...
                        </div>
                    </div>
                </div>

                {/* Main product area (flex: 1) */}
                <div style={sx.main}>
                    <div style={sx.resultsBar}>
                        <span>
                            {searchTerm && (
                                <span>
                                    Results for{" "}
                                    <strong style={{ color: COLORS.accent }}>"{searchTerm}"</strong>                                </span>
                            )}
                            <strong>{filtered.length}</strong> products found
                        </span>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: "center", padding: "60px", color: "#aaa" }}>Loading...</div>
                    ) : filtered.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "60px", color: "#aaa" }}>
                            <div style={{ fontSize: "48px" }}>📦</div>
                            <div style={{ marginTop: "12px", fontSize: "15px" }}>No products found</div>
                        </div>
                    ) : (
                        <div style={sx.grid}>
                            {filtered.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}