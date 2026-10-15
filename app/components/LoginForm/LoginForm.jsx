import { useId } from "react";
import { Form } from "react-router";
import Button from "~/components/Button/Button.jsx";
import FormField from "~/components/FormField/FormField.jsx";
import styles from "~/styles/components/LoginForm.module.css";

export default function LoginForm({
  onSubmit,
  onForgotPassword,
  isSubmitting = false,
  error,
  errors = {},
  notice,
  username = "",
}) {
  const headingId = useId();
  const errorId = `${headingId}-error`;

  function handleSubmit(event) {
    if (!onSubmit) return;
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    onSubmit({
      username: formData.get("username").trim(),
      password: formData.get("password"),
    });
  }

  return (
    <Form
      className={styles.form}
      method="post"
      aria-labelledby={headingId}
      aria-describedby={error ? errorId : undefined}
      aria-busy={isSubmitting}
      onSubmit={handleSubmit}
    >
      <h2 className={styles.title} id={headingId}>
        Se connecter
      </h2>

      {notice && !error && <p className={styles.notice} role="status">{notice}</p>}
      {error && <p className={styles.error} id={errorId} role="alert">{error}</p>}

      <div className={styles.fields}>
        <FormField
          label="Nom d’utilisateur"
          name="username"
          type="text"
          defaultValue={username}
          error={errors.username}
          disabled={isSubmitting}
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          required
        />
        <FormField
          label="Mot de passe"
          name="password"
          type="password"
          autoComplete="current-password"
          error={errors.password}
          disabled={isSubmitting}
          required
        />
      </div>

      <Button className={styles.submit} type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Connexion…" : "Se connecter"}
      </Button>

      <button
        className={styles.forgotPassword}
        type="button"
        onClick={onForgotPassword}
      >
        Mot de passe oublié ?
      </button>
    </Form>
  );
}
