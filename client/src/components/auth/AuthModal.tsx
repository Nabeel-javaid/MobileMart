import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, defaultView = 'login' }: AuthModalProps) {
  const [view, setView] = useState<'login' | 'signup'>(defaultView);

  const handleSwitchToSignup = () => {
    setView('signup');
  };

  const handleSwitchToLogin = () => {
    setView('login');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            {view === 'login' ? (
              <LoginForm onClose={onClose} onSwitchToSignup={handleSwitchToSignup} />
            ) : (
              <SignupForm onClose={onClose} onSwitchToLogin={handleSwitchToLogin} />
            )}
          </div>
        </>
      )}
    </AnimatePresence>
  );
}