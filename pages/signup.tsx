import Signup from '../screens/Signup';
import Seo from '../components/Seo';

const SignupPage = () => {
  return (
    <>
      <Seo
        title="Kaydol | hangimekan.co"
        description="hangimekan.co'ya katıl, mekanları keşfet ve yorum yap."
        path="/signup"
        noIndex
      />
      <Signup />
    </>
  );
};

export default SignupPage;
