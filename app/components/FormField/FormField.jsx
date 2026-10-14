import { useId } from "react";
import styles from "~/styles/components/FormField.module.css";

export default function FormField({
  label,
  id,
  name,
  type = "text",
  error,
  className = "",
  ...inputProps
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const describedBy = [
    inputProps["aria-describedby"],
    error ? errorId : null,
  ]
    .filter(Boolean)
    .join(" ");
  const fieldClassName = [styles.field, className].filter(Boolean).join(" ");

  return (
    <div className={fieldClassName}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <input
        {...inputProps}
        className={styles.input}
        id={inputId}
        name={name}
        type={type}
        aria-invalid={error ? true : inputProps["aria-invalid"]}
        aria-describedby={describedBy || undefined}
      />
      {error && (
        <p className={styles.error} id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
}
