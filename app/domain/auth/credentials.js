export function readLoginForm(formData) {
  const rawUsername = formData.get("username");
  const rawPassword = formData.get("password");
  const credentials = {
    username: typeof rawUsername === "string" ? rawUsername.trim() : "",
    password: typeof rawPassword === "string" ? rawPassword : "",
  };
  const errors = {};

  if (!credentials.username) {
    errors.username = "Saisissez votre nom d’utilisateur.";
  }

  if (!credentials.password) {
    errors.password = "Saisissez votre mot de passe.";
  }

  return { credentials, errors };
}
