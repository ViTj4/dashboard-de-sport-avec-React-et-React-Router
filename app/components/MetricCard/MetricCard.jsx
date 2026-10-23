import Card from "~/components/Card/Card.jsx";
import { formatNumber } from "~/utils/formatters.js";
import styles from "~/styles/components/MetricCard.module.css";

export default function MetricCard({ label, value, unit, tone = "primary", variant = "default", children }) {
  return <Card className={[styles.card, variant === "highlight" ? styles.highlight : ""].filter(Boolean).join(" ")}>
    <p className={styles.label}>{label}</p>
    <p className={`${styles.value} ${styles[tone] ?? ""}`}>
      {children ?? <>{value == null ? "—" : formatNumber(value)} <span>{unit}</span></>}
    </p>
  </Card>;
}
