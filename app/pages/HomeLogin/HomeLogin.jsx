import backgroundAuthPage from "~/assets/images/background_auth_page.png";
import LoginForm from "~/components/LoginForm/LoginForm.jsx";
import AuthLayout from "~/layouts/AuthLayout/AuthLayout.jsx";
import styles from "~/styles/pages/HomeLogin.module.css";

export default function HomeLogin() {
  return (
    <AuthLayout
      imageSrc={backgroundAuthPage}
      caption="Analysez vos performances en un clin d’œil, suivez vos progrès et atteignez vos objectifs."
    >
      <div className={styles.card}>
        <h1 className={styles.title}>
          Transformez
          <br />
          vos stats en résultats
        </h1>
        <LoginForm />
      </div>
    </AuthLayout>
  );
}
