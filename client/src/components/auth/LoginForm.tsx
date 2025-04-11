import { useState } from 'react';
import { motion } from 'framer-motion';
import { LockKeyhole, Mail, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmail, signInWithGoogle } from '@/lib/firebase';
import { FcGoogle } from 'react-icons/fc';

interface LoginFormProps {
  onClose: () => void;
  onSwitchToSignup: () => void;
}

export default function LoginForm({ onClose, onSwitchToSignup }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Missing information',
        description: 'Please enter your email and password',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { user, error } = await signInWithEmail(email, password);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Login successful',
        description: `Welcome back${user?.displayName ? `, ${user.displayName}` : ''}!`,
      });
      
      onClose();
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'Failed to log in. Please check your credentials.';
      
      // Firebase specific error handling
      if (error?.code === 'auth/user-not-found' || error?.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (error?.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      }
      
      toast({
        title: 'Login failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      const { user, error } = await signInWithGoogle();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Login successful',
        description: `Welcome, ${user?.displayName || 'new user'}!`,
      });
      
      onClose();
    } catch (error: any) {
      console.error('Google login error:', error);
      
      toast({
        title: 'Login failed',
        description: 'Failed to login with Google. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>
      
      <div className="text-center mb-6">
        <h2 className="text-2xl font-montserrat font-bold text-slate-800">Welcome Back</h2>
        <p className="text-slate-500 mt-1">Sign in to continue shopping</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <Mail className="h-5 w-5" />
            </div>
            <input
              type="email"
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <input
              type="password"
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <label className="inline-flex items-center">
              <input type="checkbox" className="w-4 h-4 rounded text-primary" />
              <span className="ml-2 text-slate-600">Remember me</span>
            </label>
            <a href="#" className="text-primary hover:underline">Forgot password?</a>
          </div>
          
          <motion.button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-medium transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </motion.button>
          
          <div className="relative flex items-center justify-center mt-6">
            <div className="border-t border-slate-300 absolute w-full"></div>
            <div className="bg-white px-4 relative z-10 text-sm text-slate-500">or continue with</div>
          </div>
          
          <motion.button
            type="button"
            className="w-full flex items-center justify-center bg-white border border-slate-300 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <FcGoogle className="h-5 w-5 mr-2" />
            <span>Sign in with Google</span>
          </motion.button>
        </div>
      </form>
      
      <div className="text-center mt-6">
        <p className="text-slate-600">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToSignup}
            className="text-primary font-medium hover:underline"
            disabled={isLoading}
          >
            Sign Up
          </button>
        </p>
      </div>
    </motion.div>
  );
}