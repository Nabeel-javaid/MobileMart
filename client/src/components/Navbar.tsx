import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Laptop, 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X,
  Heart,
  LogOut,
  LogIn
} from 'lucide-react';
import { Link } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { signOutUser } from '@/lib/firebase';
import AuthModal from './auth/AuthModal';
import CartSidebar from './cart/CartSidebar';
import { useToast } from '@/hooks/use-toast';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'signup'>('login');
  
  const { user } = useAuth();
  const { cartItems, cartCount, toggleCart } = useCart();
  const { toast } = useToast();
  
  // Check scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Handle mobile menu
      if (isMobileMenuOpen && 
          !target.closest('#mobile-menu') && 
          !target.closest('#mobile-menu-btn')) {
        setIsMobileMenuOpen(false);
      }
      
      // Handle user dropdown menu
      if (isUserMenuOpen && 
          !target.closest('#user-menu') && 
          !target.closest('#user-menu-btn')) {
        setIsUserMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen, isUserMenuOpen]);
  
  // Close menus when resizing
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);
  
  const handleSignOut = async () => {
    try {
      await signOutUser();
      setIsUserMenuOpen(false);
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "There was a problem signing out",
        variant: "destructive",
      });
    }
  };
  
  const openLoginModal = () => {
    setAuthModalView('login');
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false);
  };
  
  const openSignupModal = () => {
    setAuthModalView('signup');
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false);
  };
  
  // Navigation links
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Mobiles', href: '#mobile' },
    { name: 'Laptops', href: '#laptop' },
    { name: 'Accessories', href: '#accessories' },
    { name: 'Deals', href: '#deals' }
  ];

  return (
    <>
      <header className={`sticky top-0 z-40 w-full ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-md py-2' 
          : 'bg-white shadow-md py-3'
        } transition-all duration-300`}>
        {/* Navbar */}
        <nav className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-1">
            <motion.span 
              className="text-primary text-3xl"
              initial={{ rotate: 0 }}
              whileHover={{ rotate: [-10, 10, -5, 5, 0], transition: { duration: 0.5 } }}
            >
              <Laptop />
            </motion.span>
            <motion.h1 
              className="text-2xl font-montserrat font-bold"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              Tech<span className="text-primary">Treasure</span>
            </motion.h1>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <motion.a 
                key={link.name}
                href={link.href} 
                className="text-slate-700 font-medium hover:text-primary transition-colors relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                {link.name}
                <motion.span 
                  className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </div>
          
          {/* Action Icons */}
          <div className="flex items-center space-x-5">
            <motion.button 
              className="hidden md:flex items-center justify-center text-slate-700 hover:text-primary transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search className="h-5 w-5" />
            </motion.button>
            
            <motion.button 
              className="hidden md:flex items-center justify-center text-slate-700 hover:text-primary transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart className="h-5 w-5" />
            </motion.button>
            
            <motion.button 
              className="relative flex items-center justify-center text-slate-700 hover:text-primary transition-colors"
              onClick={toggleCart}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Open cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </motion.span>
              )}
            </motion.button>
            
            {user ? (
              <div className="relative">
                <motion.button 
                  id="user-menu-btn"
                  className="hidden md:flex items-center justify-center space-x-2 text-slate-700 hover:text-primary transition-colors bg-slate-50 px-3 py-1.5 rounded-full"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'User'} 
                      className="w-7 h-7 rounded-full object-cover border-2 border-primary/20"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="text-sm font-medium truncate max-w-[100px]">
                    {user.displayName || (user.email ? user.email.split('@')[0] : 'User')}
                  </span>
                </motion.button>
                
                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div 
                      id="user-menu"
                      className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium truncate">{user.displayName || 'User'}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                      <div className="pt-2">
                        <button 
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          onClick={handleSignOut}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button 
                className="hidden md:flex items-center justify-center bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-full font-medium transition-colors"
                onClick={openLoginModal}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogIn className="h-4 w-4 mr-1" />
                Sign In
              </motion.button>
            )}
            
            <motion.button 
              id="mobile-menu-btn"
              className="md:hidden text-slate-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </nav>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              id="mobile-menu"
              className="md:hidden bg-white absolute w-full left-0 shadow-md z-50"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container mx-auto px-4 py-6 flex flex-col space-y-4">
                {user && (
                  <div className="flex items-center space-x-3 pb-4 border-b">
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={user.displayName || 'User'} 
                        className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-lg">
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{user.displayName || 'User'}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                )}
                
                {navLinks.map((link) => (
                  <a 
                    key={link.name}
                    href={link.href} 
                    className="text-slate-700 py-2 font-medium hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                
                <div className="flex flex-col space-y-4 pt-2 border-t">
                  <button 
                    className="text-slate-700 hover:text-primary transition-colors flex items-center py-2"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Search className="h-5 w-5 mr-3" /> Search
                  </button>
                  
                  <button 
                    className="text-slate-700 hover:text-primary transition-colors flex items-center py-2"
                    onClick={() => {
                      toggleCart();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <ShoppingCart className="h-5 w-5 mr-3" /> Cart {cartCount > 0 && `(${cartCount})`}
                  </button>
                  
                  {user ? (
                    <button 
                      className="text-red-600 hover:text-red-700 transition-colors flex items-center py-2"
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-5 w-5 mr-3" /> Sign Out
                    </button>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <button 
                        className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-full font-medium transition-colors"
                        onClick={openLoginModal}
                      >
                        Sign In
                      </button>
                      <button 
                        className="w-full bg-transparent border border-primary text-primary hover:bg-primary/5 py-2 rounded-full font-medium transition-colors"
                        onClick={openSignupModal}
                      >
                        Create Account
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        defaultView={authModalView}
      />
      
      {/* Cart Sidebar */}
      <CartSidebar />
    </>
  );
}
