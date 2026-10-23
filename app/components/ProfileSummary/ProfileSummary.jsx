import { useState } from "react";
import achievement from "~/assets/logos/achievement.svg";
import fallbackPicture from "~/assets/images/profil_picture_default.png";
import { formatDate, formatNumber } from "~/utils/formatters.js";
import styles from "~/styles/components/ProfileSummary.module.css";

export default function ProfileSummary({ user }) {
  const [failedPicture, setFailedPicture] = useState(null);
  const picture = !user.profilePicture || failedPicture === user.profilePicture ? fallbackPicture : user.profilePicture;

  return (
    <section className={styles.summary} aria-label="Résumé de votre profil">
      <div className={styles.identity}>
        <img className={styles.picture} src={picture} alt={`Profil de ${user.firstName} ${user.lastName}`}
          width={104} height={117} onError={() => setFailedPicture(user.profilePicture)} />
        <div>
          <h1 className={styles.name}>{user.firstName} {user.lastName}</h1>
          <p className={styles.membership}>Membre depuis le <time dateTime={user.createdAt}>{formatDate(user.createdAt)}</time></p>
        </div>
      </div>
      <div className={styles.distance}>
        <p className={styles.distanceLabel}>Distance totale parcourue</p>
        <div className={styles.achievement}>
          <img src={achievement} width={34} height={34} alt="" aria-hidden="true" />
          <span>{formatNumber(user.statistics.totalDistance)} km</span>
        </div>
      </div>
    </section>
  );
}
