const NavbarMenus = [
  { label: "Dashboard", path: "/dashboard" },
  {
    label: "Store",
    children: [
      { label: "Products", path: "/products" },
      { label: "Categories", path: "/categories" },
      { label: "Inventory", path: "/inventory" },
    ],
  },
  {
    label: "Sales",
    children: [
      { label: "Orders", path: "/orders" },
      { label: "Customers", path: "/customers" },
    ],
  },
  {
    label: "Analytics",
    children: [
      { label: "Reports", path: "/reports" },
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

export default NavbarMenus;