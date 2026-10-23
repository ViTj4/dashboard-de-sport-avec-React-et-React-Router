import { useLoaderData } from "react-router";
import Card from "~/components/Card/Card.jsx";
import DatePagination from "~/components/DatePagination/DatePagination.jsx";
import ProfileSummary from "~/components/ProfileSummary/ProfileSummary.jsx";
import DistanceChart from "~/components/charts/DistanceChart.jsx";
import HeartRateChart from "~/components/charts/HeartRateChart.jsx";
import WeeklyGoalChart from "~/components/charts/WeeklyGoalChart.jsx";
import MetricCard from "~/components/MetricCard/MetricCard.jsx";
import { dashboardSettings } from "~/config/dashboard.js";
import { useAuth } from "~/hooks/useAuth.js";
import { useDatePagination } from "~/hooks/useDatePagination.js";
import { formatNumber, formatNumericDate } from "~/utils/formatters.js";
import { addDays } from "~/utils/dates.js";
import styles from "~/styles/pages/Dashboard.module.css";

export default function Dashboard() {
  const { user } = useAuth();
  const { distance, heart, currentWeek, periods } = useLoaderData();
  const distancePagination = useDatePagination({ parameter: "distanceWeek", period: periods.distance, earliestDate: user.createdAt });
  const heartPagination = useDatePagination({ parameter: "heartWeek", period: periods.heart, earliestDate: user.createdAt });
  const goal = dashboardSettings.weeklySessionGoal;

  return (
    <>
      <ProfileSummary user={user} />
      <section className={styles.performances} aria-labelledby="performance-title">
        <h2 className={styles.sectionTitle} id="performance-title">Vos dernières performances</h2>
        <div className={styles.charts}>
          <Card title={`${formatNumber(distance.average)} km en moyenne`} description="Total des kilomètres des 4 dernières semaines"
            busy={distancePagination.isPending} className={`${styles.chartCard} ${styles.distanceCard}`}
            action={<DatePagination label="Distances" period={periods.distance} {...distancePagination} />}>
            <DistanceChart {...distance} />
          </Card>
          <Card title={heart.average === null ? "— BPM" : `${heart.average} BPM`} description="Fréquence cardiaque moyenne"
            tone="secondary" busy={heartPagination.isPending} className={styles.chartCard}
            action={<DatePagination label="Fréquence cardiaque" period={periods.heart} {...heartPagination} />}>
            <HeartRateChart {...heart} />
          </Card>
        </div>
      </section>
      <section className={styles.week} aria-labelledby="week-title">
        <h2 className={styles.sectionTitle} id="week-title">Cette semaine</h2>
        <p className={styles.weekDates}>Du {formatNumericDate(periods.currentWeek.start)} au {formatNumericDate(addDays(periods.currentWeek.end, 1))}</p>
        <div className={styles.weekGrid}>
          <Card className={styles.goalCard} description="Courses hebdomadaires réalisées"
            title={<><strong>x{currentWeek.sessions}</strong> <span className={styles.goalLabel}>sur objectif de {goal}</span></>}>
            <WeeklyGoalChart sessions={currentWeek.sessions} goal={goal} />
          </Card>
          <div className={styles.metrics}>
            <MetricCard label="Durée d’activité" value={currentWeek.duration} unit="minutes" />
            <MetricCard label="Distance" value={currentWeek.distance} unit="kilomètres" tone="secondary" />
          </div>
        </div>
      </section>
    </>
  );
}
