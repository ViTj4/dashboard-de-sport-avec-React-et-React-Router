import { useActionData, useLoaderData, useNavigation } from "react-router";
import backgroundAuthPage from "~/assets/images/background_auth_page.png";
import LoginForm from "~/components/LoginForm/LoginForm.jsx";
import AuthLayout from "~/layouts/AuthLayout/AuthLayout.jsx";
import styles from "~/styles/pages/HomeLogin.module.css";

export default function HomeLogin() {
  const actionData = useActionData();
  const { notice } = useLoaderData();
  const navigation = useNavigation();

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
        <LoginForm
          isSubmitting={navigation.state !== "idle" && navigation.formMethod === "POST"}
          error={actionData?.error}
          errors={actionData?.errors}
          username={actionData?.username}
          notice={notice}
        />
      </div>
    </AuthLayout>
  );
}
