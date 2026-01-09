import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import LoginModal from "../components/LoginModal";
import SignupModal from "../components/SignupModal";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup') {
      setIsLogin(false);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-accent">
      {isLogin ? (
        <LoginModal onRegister={() => setIsLogin(false)} />
      ) : (
        <SignupModal onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
};

export default Auth;