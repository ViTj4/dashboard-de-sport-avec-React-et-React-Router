import { useId } from "react";
import styles from "~/styles/components/Card.module.css";

export default function Card({ title, description, action, children, className = "", tone = "primary", busy = false }) {
  const titleId = useId();
  return (
    <section className={[styles.card, className].filter(Boolean).join(" ")}
      aria-labelledby={title ? titleId : undefined} aria-busy={busy}>
      {(title || action) && <header className={styles.header}>
        <h3 className={`${styles.title} ${styles[tone] ?? ""}`} id={titleId}>{title}</h3>
        {action}
      </header>}
      {description && <p className={styles.description}>{description}</p>}
      {children}
    </section>
  );
}
