import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SignupFlow } from "../components/signup/SignupFlow";

const Signup = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Handle email verification callback URL
    const token = searchParams.get('token');
    const type = searchParams.get('type');
    
    if (token && type === 'signup') {
      // Email verification callback - the SignupFlow will handle this
      console.log('Email verification callback detected');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen">
      <SignupFlow />
    </div>
  );
};

export default Signup;