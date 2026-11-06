import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import iconLogo from "~/assets/logos/Icon_logo_default.svg";
import "~/styles/global.css";

// Le favicon et la police sont déclarés une fois pour toutes les pages.
export const links = () => [
  { rel: "icon", type: "image/svg+xml", href: iconLogo },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap",
  },
];

/** Fournit le document HTML et les éléments React Router nécessaires au rendu et à l'hydratation. */
export function Layout({ children }) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>SportSee</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

/** Laisse la route active fournir le contenu du document partagé. */
export default function App() {
  return <Outlet />;
}
