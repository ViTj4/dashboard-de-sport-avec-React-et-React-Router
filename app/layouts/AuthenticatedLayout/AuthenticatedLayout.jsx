import AppHeader               from "~/components/AppHeader/AppHeader.jsx";
import AppFooter               from "~/components/AppFooter/AppFooter.jsx";
import styles                  from "~/styles/layouts/AuthenticatedLayout.module.css";

export default function AuthenticatedLayout({ children }) {
  return (
    <div    className = {styles.layout}>
      <AppHeader />
      <main className = {styles.content}>{children}</main>
      <AppFooter />
    </div>
  );
}
