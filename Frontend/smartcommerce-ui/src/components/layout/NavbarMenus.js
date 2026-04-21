export const adminMenus = [
  { label: "Dashboard", path: "/admin" },
  {
    label: "Store",
    children: [
      { label: "Products (Admin)", path: "/admin/products" },
      { label: "Categories (Admin)", path: "/admin/categories" },
      { label: "Inventory", path: "/inventory" },
    ],
  },
  {
    label: "Sales",
    children: [
      { label: "Orders (Admin)", path: "/admin/orders" },
      { label: "Customers (Admin)", path: "/admin/customers" },
    ],
  },
  {
    label: "Analytics",
    children: [
      { label: "Reports (Admin)", path: "/admin/reports" },
      { label: "Revenue", path: "/revenue" },
    ],
  },
  {
    label: "Management",
    children: [
      { label: "Users", path: "/users" },
      { label: "Roles", path: "/roles" },
      { label: "Settings", path: "/settings" },
    ],
  },
];

export const userMenus = [
  {
    label: "Profile", path: "/profile",
  }
];

export const publicMenus = [
  {
    label: "Products", path: "/products",
  },
];