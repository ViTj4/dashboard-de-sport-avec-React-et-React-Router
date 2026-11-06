import { index, layout, route } from "@react-router/dev/routes";

// Le layout sans segment d'URL regroupe les pages protégées sous le même loader utilisateur.
export default [
  index("routes/home.jsx"),
  layout("routes/authenticated.jsx", [
    route("dashboard", "routes/dashboard.jsx"),
    route("profile", "routes/profile.jsx"),
  ]),
  route("logout", "routes/logout.jsx"),
];
