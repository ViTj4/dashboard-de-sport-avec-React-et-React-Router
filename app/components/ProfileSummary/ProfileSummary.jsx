import { useEffect, useRef, useState } from "react";
import achievement from "~/assets/logos/achievement.svg";
import fallbackPicture from "~/assets/images/profil_picture_default.png";
import { formatDate, formatNumber } from "~/utils/formatters.js";
import styles from "~/styles/components/ProfileSummary.module.css";

export default function ProfileSummary({ user, variant = "overview" }) {
  const [failedPicture, setFailedPicture] = useState(null);
  const pictureRef = useRef(null);
  const picture = !user.profilePicture || failedPicture === user.profilePicture ? fallbackPicture : user.profilePicture;

  useEffect(() => {
    const image = pictureRef.current;
    if (image?.complete && image.naturalWidth === 0) setFailedPicture(user.profilePicture);
  }, [user.profilePicture]);

  return (
    <section className={[styles.summary, variant === "identity" ? styles.identityCard : ""].filter(Boolean).join(" ")}
      aria-label="Résumé de votre profil">
      <div className={styles.identity}>
        <img ref={pictureRef} className={styles.picture} src={picture} alt={`Profil de ${user.firstName} ${user.lastName}`}
          width={104} height={117} onError={() => setFailedPicture(user.profilePicture)} />
        <div>
          <h1 className={styles.name}>{user.firstName} {user.lastName}</h1>
          <p className={styles.membership}>Membre depuis le <time dateTime={user.createdAt}>{formatDate(user.createdAt)}</time></p>
        </div>
      </div>
      {variant === "overview" && <div className={styles.distance}>
        <p className={styles.distanceLabel}>Distance totale parcourue</p>
        <div className={styles.achievement}>
          <img src={achievement} width={34} height={34} alt="" aria-hidden="true" />
          <span>{formatNumber(user.statistics.totalDistance)} km</span>
        </div>
      </div>}
    </section>
  );
}
