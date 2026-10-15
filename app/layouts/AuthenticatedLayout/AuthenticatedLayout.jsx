import { Form, useNavigation } from "react-router";
import Button from "~/components/Button/Button.jsx";
import Logo from "~/components/Logo/Logo.jsx";
import styles from "~/styles/layouts/AuthenticatedLayout.module.css";

export default function AuthenticatedLayout({ children }) {
  const navigation = useNavigation();
  const isLoggingOut = navigation.state !== "idle" && navigation.formAction === "/logout";

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Logo />
        <Form action="/logout" method="post">
          <Button type="submit" disabled={isLoggingOut} className={styles.logout}>
            {isLoggingOut ? "Déconnexion…" : "Se déconnecter"}
          </Button>
        </Form>
      </header>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
