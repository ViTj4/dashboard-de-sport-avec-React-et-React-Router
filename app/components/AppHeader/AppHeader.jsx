import { Form, Link, NavLink, useNavigation } from "react-router";
import Button from "~/components/Button/Button.jsx";
import Logo from "~/components/Logo/Logo.jsx";
import styles from "~/styles/components/AppHeader.module.css";

/** Partage la navigation des pages connectées et déclenche la déconnexion par une action POST. */
export default function AppHeader() {
  const navigation = useNavigation();
  const isLoggingOut = navigation.state !== "idle" && navigation.formAction === "/logout";

  return (
    <header className={styles.header}>
      <Link className={styles.brand} to="/dashboard" aria-label="SportSee — Dashboard">
        <Logo />
      </Link>
      <nav className={styles.navigation} aria-label="Navigation principale">
        <NavLink className={styles.link} to="/dashboard">Dashboard</NavLink>
        <NavLink className={styles.link} to="/profile">Mon profil</NavLink>
        <Form className={styles.logout} action="/logout" method="post">
          <Button variant="text" type="submit" disabled={isLoggingOut}>
            {isLoggingOut ? "Déconnexion…" : "Se déconnecter"}
          </Button>
        </Form>
      </nav>
    </header>
  );
}
