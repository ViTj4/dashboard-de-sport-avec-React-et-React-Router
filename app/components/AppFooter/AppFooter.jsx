import { Link } from "react-router";
import Logo from "~/components/Logo/Logo.jsx";
import styles from "~/styles/components/AppFooter.module.css";

// Sans destination configurée, une rubrique reste du texte plutôt qu'un lien sans cible.
const footerItems = [{ label: "Conditions générales" }, { label: "Contact" }];

/** Réutilise la version icône du logo animé et accepte les destinations propres à l'application. */
export default function AppFooter({ items = footerItems }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <p className={styles.copyright}>©Sportsee <span>Tous droits réservés</span></p>
        <div className={styles.links}>
          {items.map(({ label, to }) => to
            ? <Link key={label} to={to}>{label}</Link>
            : <span key={label}>{label}</span>)}
        </div>
        <Logo iconOnly />
      </div>
    </footer>
  );
}
