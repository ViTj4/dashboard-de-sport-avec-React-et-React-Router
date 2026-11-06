import { useMatches }          from "react-router";
import AppHeader               from "~/components/AppHeader/AppHeader.jsx";
import AppFooter               from "~/components/AppFooter/AppFooter.jsx";
import styles                  from "~/styles/layouts/AuthenticatedLayout.module.css";

/** Entoure les pages connectées de la navigation et du footer communs. */
export default function AuthenticatedLayout({ children }) {
  // Les métadonnées des routes pilotent la largeur sans tester leurs URL dans le layout.
  const wideContent = useMatches().some((match) => match.handle?.wideContent);
  return (
    <div    className = {styles.layout}>
      <AppHeader />
      <main className = {[styles.content, wideContent ? styles.wide : ""].filter(Boolean).join(" ")}>{children}</main>
      <AppFooter />
    </div>
  );
}
