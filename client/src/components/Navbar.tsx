import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Laptop, 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X
} from 'lucide-react';
import { Link } from 'wouter';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  
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
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('#mobile-menu') && !target.closest('#mobile-menu-btn')) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);
  
  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);
  
  // Navigation links
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Mobiles', href: '#mobile' },
    { name: 'Laptops', href: '#laptop' },
    { name: 'Accessories', href: '#accessories' },
    { name: 'Deals', href: '#deals' }
  ];

  return (
    <header className={`sticky top-0 z-50 w-full ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-sm shadow-md py-2' 
        : 'bg-white shadow-md py-3'
      } transition-all duration-300`}>
      {/* Navbar */}
      <nav className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-1">
          <span className="text-primary text-3xl">
            <Laptop />
          </span>
          <h1 className="text-2xl font-montserrat font-bold">Tech<span className="text-primary">Treasure</span></h1>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href} 
              className="text-slate-700 font-medium hover:text-primary transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>
        
        {/* Action Icons */}
        <div className="flex items-center space-x-4">
          <button className="hidden md:block text-slate-700 hover:text-primary transition-colors">
            <Search className="h-5 w-5" />
          </button>
          
          <button className="relative text-slate-700 hover:text-primary transition-colors">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          
          <button className="hidden md:block text-slate-700 hover:text-primary transition-colors">
            <User className="h-5 w-5" />
          </button>
          
          <button 
            id="mobile-menu-btn"
            className="md:hidden text-slate-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
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
            <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
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
              
              <div className="flex py-2 space-x-8">
                <button className="text-slate-700 hover:text-primary transition-colors flex items-center">
                  <Search className="h-5 w-5 mr-2" /> Search
                </button>
                <button className="text-slate-700 hover:text-primary transition-colors flex items-center">
                  <User className="h-5 w-5 mr-2" /> Account
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
