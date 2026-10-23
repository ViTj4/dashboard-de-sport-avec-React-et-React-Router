import { formatNumber } from "~/utils/formatters.js";
import styles from "~/styles/components/Charts.module.css";

export default function ChartTooltip({ active, payload, unit, getLabel }) {
  const entries = payload?.filter((entry) => entry.value !== null && entry.value !== undefined);
  if (!active || !entries?.length) return null;

  return (
    <div className={styles.tooltip}>
      <p>{getLabel(entries[0].payload)}</p>
      <ul>{entries.map((entry) => <li key={entry.dataKey}>
        {entry.name} : <strong>{formatNumber(entry.value)} {unit}</strong>
      </li>)}</ul>
    </div>
  );
}
