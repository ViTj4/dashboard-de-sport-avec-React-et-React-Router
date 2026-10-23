import Card from "~/components/Card/Card.jsx";
import { formatNumber } from "~/utils/formatters.js";
import styles from "~/styles/components/MetricCard.module.css";

export default function MetricCard({ label, value, unit, tone = "primary" }) {
  return <Card className={styles.card}>
    <p className={styles.label}>{label}</p>
    <p className={`${styles.value} ${styles[tone]}`}>
      {formatNumber(value)} <span>{unit}</span>
    </p>
  </Card>;
}
