import Button from "~/components/Button/Button.jsx";
import { formatDate } from "~/utils/formatters.js";
import styles from "~/styles/components/DatePagination.module.css";

export default function DatePagination({ label, period, canGoPrevious, canGoNext, onPrevious, onNext, isPending }) {
  return (
    <nav className={styles.pagination} aria-label={`Période — ${label}`}>
      <Button variant="navigation" onClick={onPrevious} disabled={!canGoPrevious || isPending}
        aria-label={`${label} : période précédente`}>
        <svg className={styles.chevron} width={12} height={14} viewBox="0 0 12 14" fill="none" aria-hidden="true">
          <path d="M8 3 4 7l4 4" stroke="currentColor" strokeWidth="1" />
        </svg>
      </Button>
      <p className={styles.range} aria-live="polite" aria-atomic="true">
        <time dateTime={period.start}>{formatDate(period.start, { month: "short", year: undefined })}</time>
        {" – "}
        <time dateTime={period.end}>{formatDate(period.end, { month: "short", year: undefined })}</time>
      </p>
      <Button variant="navigation" onClick={onNext} disabled={!canGoNext || isPending}
        aria-label={`${label} : période suivante`}>
        <svg className={styles.chevron} width={12} height={14} viewBox="0 0 12 14" fill="none" aria-hidden="true">
          <path d="m4 3 4 4-4 4" stroke="currentColor" strokeWidth="1" />
        </svg>
      </Button>
    </nav>
  );
}
