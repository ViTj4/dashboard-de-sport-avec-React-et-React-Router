import { useMatches }          from "react-router";
import AppHeader               from "~/components/AppHeader/AppHeader.jsx";
import AppFooter               from "~/components/AppFooter/AppFooter.jsx";
import styles                  from "~/styles/layouts/AuthenticatedLayout.module.css";

export default function AuthenticatedLayout({ children }) {
  const wideContent = useMatches().some((match) => match.handle?.wideContent);
  return (
    <div    className = {styles.layout}>
      <AppHeader />
      <main className = {[styles.content, wideContent ? styles.wide : ""].filter(Boolean).join(" ")}>{children}</main>
      <AppFooter />
    </div>
  );
}
