import { useLoaderData } from "react-router";
import ProfileSummary from "~/components/ProfileSummary/ProfileSummary.jsx";
import ProfileDetails from "~/components/ProfileDetails/ProfileDetails.jsx";
import MetricCard from "~/components/MetricCard/MetricCard.jsx";
import { formatDate, getDurationParts } from "~/utils/formatters.js";
import styles from "~/styles/pages/Profile.module.css";

export default function Profile() {
  const { user, statistics, period } = useLoaderData();
  const duration = getDurationParts(statistics.totalDuration);

  return (
    <div className={styles.profile}>
      <div className={styles.identity}>
        <ProfileSummary user={user} variant="identity" />
        <ProfileDetails user={user} />
      </div>
      <section aria-labelledby="profile-statistics-title" className={styles.statistics}>
        <header className={styles.heading}>
          <h2 id="profile-statistics-title">Vos statistiques</h2>
          <p>depuis le <time dateTime={period.start}>{formatDate(period.start)}</time></p>
        </header>
        <div className={styles.metrics}>
          <MetricCard label="Temps total couru" variant="highlight">
            {duration.hours}h <span>{duration.minutes}min</span>
          </MetricCard>
          <MetricCard label="Calories brûlées" value={statistics.caloriesBurned} unit="cal" variant="highlight" />
          <MetricCard label="Distance totale parcourue" value={statistics.totalDistance} unit="km" variant="highlight" />
          <MetricCard label="Nombre de jours de repos" value={statistics.restDays} unit="jours" variant="highlight" />
          <MetricCard label="Nombre de sessions" value={statistics.totalSessions} unit="sessions" variant="highlight" />
        </div>
      </section>
    </div>
  );
}
