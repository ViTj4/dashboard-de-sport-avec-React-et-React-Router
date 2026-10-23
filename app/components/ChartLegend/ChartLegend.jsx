import styles from "~/styles/components/ChartLegend.module.css";

export default function ChartLegend({ items }) {
  return (
    <ul className={styles.legend} aria-label="Légende du graphique">
      {items.map(({ label, color, line }) => <li key={label}>
        <span className={`${styles.marker} ${line ? styles.line : ""}`} style={{ "--legend-color": color }} aria-hidden="true" />
        {label}
      </li>)}
    </ul>
  );
}
