import styles from "~/styles/components/StatusPanel.module.css";

/** Structure visuelle commune des messages de page ; l'appelant choisit le contenu et les actions. */
export default function StatusPanel({ title, children }) {
  return (
    <section className={styles.panel}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.content}>{children}</div>
    </section>
  );
}
