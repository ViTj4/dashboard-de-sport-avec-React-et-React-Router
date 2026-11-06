import styles from "~/styles/components/Button.module.css";

/** Mutualise les variantes visuelles tout en conservant les propriétés natives du bouton. */
export default function Button({
  children,
  variant   = "primary",
  type      = "button",
  disabled  = false,
  className = "",
  ...props
}) {
  // Le contenu des boutons de navigation est isolé pour compenser leur rotation CSS.
  const isNavigation     = variant === "navigation";
  const variants = { primary: styles.primary, navigation: styles.navigation, text: styles.text };
  const variantClassName = variants[variant] ?? styles.primary;
  const buttonClassName  = [styles.button, variantClassName, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      {...props}
      type      = {type}
      disabled  = {disabled}
      className = {buttonClassName}
    >
      {isNavigation ? (
        <span className = {styles.navigationContent}>{children}</span>
      ) : (
        children
      )}
    </button>
  );
}
