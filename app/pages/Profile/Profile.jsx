import ProfileSummary from "~/components/ProfileSummary/ProfileSummary.jsx";
import MetricCard from "~/components/MetricCard/MetricCard.jsx";
import { useAuth } from "~/hooks/useAuth.js";
import styles from "~/styles/pages/Profile.module.css";

export default function Profile() {
  const { user } = useAuth();
  return <>
    <ProfileSummary user={user} />
    <section className={styles.section} aria-labelledby="profile-details-title">
      <h2 id="profile-details-title">Mon profil</h2>
      <div className={styles.metrics}>
        <MetricCard label="Âge" value={user.age} unit="ans" />
        <MetricCard label="Taille" value={user.height} unit="cm" />
        <MetricCard label="Poids" value={user.weight} unit="kg" />
      </div>
    </section>
  </>;
}
