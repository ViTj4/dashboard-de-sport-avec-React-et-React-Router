import { Link } from "react-router";
import Logo     from "~/components/Logo/Logo.jsx";
import styles   from "~/styles/layouts/AuthLayout.module.css";

export default function AuthLayout({
  children,
  imageSrc,
  imageAlt = "",
  caption,
}) {
  return (
    <main    className = {styles.layout}>
    <section className = {styles.panel}>
    <header  className = {styles.header}>
    <Link    className = {styles.logoLink} to = "/" aria-label = "Accueil SportSee">
            <Logo />
          </Link>
        </header>

        <div className = {styles.content}>{children}</div>
      </section>

      <aside className = {styles.visual}>
        <img
          className     = {styles.image}
          src           = {imageSrc}
          alt           = {imageAlt}
          width         = {1616}
          height        = {2048}
          fetchPriority = "high"
        />
        {caption && <p className={styles.caption}>{caption}</p>}
      </aside>
    </main>
  );
}
