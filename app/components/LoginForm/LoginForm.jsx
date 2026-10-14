import { useId } from "react";
import Button from "~/components/Button/Button.jsx";
import FormField from "~/components/FormField/FormField.jsx";
import styles from "~/styles/components/LoginForm.module.css";

export default function LoginForm({ onSubmit, onForgotPassword }) {
  const headingId = useId();

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    onSubmit?.({
      email: formData.get("email"),
      password: formData.get("password"),
    });
  }

  return (
    <form
      className={styles.form}
      method="post"
      aria-labelledby={headingId}
      onSubmit={handleSubmit}
    >
      <h2 className={styles.title} id={headingId}>
        Se connecter
      </h2>

      <div className={styles.fields}>
        <FormField
          label="Adresse email"
          name="email"
          type="email"
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
          required
        />
      </div>

      <Button className={styles.submit} type="submit">
        Se connecter
      </Button>

      <button
        className={styles.forgotPassword}
        type="button"
        onClick={onForgotPassword}
      >
        Mot de passe oublié ?
      </button>
    </form>
  );
}
