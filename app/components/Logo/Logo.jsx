import logo from "~/assets/logos/logo.svg";
import LogoIcon from "./LogoIcon.jsx";
import styles from "~/styles/components/Logo.module.css";

export default function Logo({ animated = true, iconOnly = false, className = "", ...props }) {
  const logoClassName = [styles.logo, animated && styles.animated, className]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      role="img"
      aria-label="SportSee"
      {...props}
      className={logoClassName}
    >
      <LogoIcon />
      {!iconOnly && <img
        className={styles.wordmark}
        src={logo}
        alt=""
        aria-hidden="true"
        width={133}
        height={24}
      />}
    </span>
  );
}
