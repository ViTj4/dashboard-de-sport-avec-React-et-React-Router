import { index, layout, route } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  layout("routes/authenticated.jsx", [
    route("dashboard", "routes/dashboard.jsx"),
    route("profile", "routes/profile.jsx"),
  ]),
  route("logout", "routes/logout.jsx"),
];
