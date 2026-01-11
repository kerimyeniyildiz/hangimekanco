import Login from '../screens/Login';
import Seo from '../components/Seo';

const LoginPage = () => {
  return (
    <>
      <Seo
        title="Oturum aç | hangimekan.co"
        description="hangimekan.co hesabına giriş yap."
        path="/login"
        noIndex
      />
      <Login />
    </>
  );
};

export default LoginPage;
