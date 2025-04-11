import { useState } from 'react';
import { motion } from 'framer-motion';
import { LockKeyhole, Mail, User, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signUpWithEmail, signInWithGoogle } from '@/lib/firebase';
import { FcGoogle } from 'react-icons/fc';

interface SignupFormProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function SignupForm({ onClose, onSwitchToLogin }: SignupFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: 'Missing information',
        description: 'Please fill out all fields',
        variant: 'destructive',
      });
      return false;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure your passwords match',
        variant: 'destructive',
      });
      return false;
    }
    
    if (password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { user, error } = await signUpWithEmail(email, password, name);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Account created',
        description: `Welcome to TechTreasure, ${name}!`,
      });
      
      onClose();
    } catch (error: any) {
      console.error('Signup error:', error);
      
      let errorMessage = 'Failed to create an account. Please try again.';
      
      // Firebase specific error handling
      if (error?.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please try logging in.';
      } else if (error?.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      }
      
      toast({
        title: 'Signup failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    
    try {
      const { user, error } = await signInWithGoogle();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Account created',
        description: `Welcome to TechTreasure, ${user?.displayName || 'new user'}!`,
      });
      
      onClose();
    } catch (error: any) {
      console.error('Google signup error:', error);
      
      toast({
        title: 'Signup failed',
        description: 'Failed to sign up with Google. Please try again.',
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
        <h2 className="text-2xl font-montserrat font-bold text-slate-800">Create Account</h2>
        <p className="text-slate-500 mt-1">Join TechTreasure to start shopping</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <User className="h-5 w-5" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
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
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <input
              type="password"
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <motion.button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-medium transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
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
            onClick={handleGoogleSignup}
            disabled={isLoading}
          >
            <FcGoogle className="h-5 w-5 mr-2" />
            <span>Sign up with Google</span>
          </motion.button>
        </div>
      </form>
      
      <div className="text-center mt-6">
        <p className="text-slate-600">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-primary font-medium hover:underline"
            disabled={isLoading}
          >
            Sign In
          </button>
        </p>
      </div>
    </motion.div>
  );
}