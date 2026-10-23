import { useId } from "react";
import Card from "~/components/Card/Card.jsx";
import { formatHeight, formatNumber } from "~/utils/formatters.js";
import styles from "~/styles/components/ProfileDetails.module.css";

export default function ProfileDetails({ user }) {
  const titleId = useId();
  const fields = [
    { label: "Âge", value: Number.isFinite(user.age) ? formatNumber(user.age) : null },
    { label: "Genre", value: user.gender },
    { label: "Taille", value: Number.isFinite(user.height) ? formatHeight(user.height) : null },
    { label: "Poids", value: Number.isFinite(user.weight) ? `${formatNumber(user.weight)}kg` : null },
  ];

  return (
    <Card className={styles.details}>
      <h2 id={titleId}>Votre profil</h2>
      <dl aria-labelledby={titleId}>
        {fields.map(({ label, value }) => <div key={label}>
          <dt>{label} :</dt> <dd>{value ?? "Non renseigné"}</dd>
        </div>)}
      </dl>
    </Card>
  );
}
