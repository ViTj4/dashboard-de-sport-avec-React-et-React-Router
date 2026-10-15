import styles from "~/styles/components/StatusPanel.module.css";

export default function StatusPanel({ title, children }) {
  return (
    <section className={styles.panel}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.content}>{children}</div>
    </section>
  );
}
