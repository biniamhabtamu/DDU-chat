import { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { Badge } from '@/components/ui/badge';
import { GraduationCap } from 'lucide-react';
import heroImage from "@/assets/hero-university.jpg";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-hero opacity-95" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            <GraduationCap className="w-4 h-4 mr-2" />
            Dire Dawa University Students
          </Badge>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to{" "}
            <span className="text-gradient-primary">Dire-Dev</span>
          </h1>
          <p className="text-white/80">
            Your academic platform for collaboration and development
          </p>
        </div>

        {isLogin ? (
          <LoginForm onToggleMode={() => setIsLogin(false)} />
        ) : (
          <SignupForm onToggleMode={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};

export default Auth;