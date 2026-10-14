import styles from "~/styles/components/Button.module.css";

export default function Button({
  children,
  variant   = "primary",
  type      = "button",
  disabled  = false,
  className = "",
  ...props
}) {
  const isNavigation     = variant === "navigation";
  const variantClassName = isNavigation ? styles.navigation : styles.primary;
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
