import { motion } from 'framer-motion';
import { 
  Laptop, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-1 mb-6">
              <span className="text-primary text-3xl">
                <Laptop />
              </span>
              <h2 className="text-xl font-montserrat font-bold">Tech<span className="text-primary">Treasure</span></h2>
            </div>
            <p className="text-slate-400 mb-6">
              Your destination for premium mobile phones and laptops with exceptional service and unbeatable prices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </motion.div>
          
          {/* Quick Links */}
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-montserrat font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Home</a></li>
              <li><a href="#mobile" className="text-slate-400 hover:text-primary transition-colors">Smartphones</a></li>
              <li><a href="#laptop" className="text-slate-400 hover:text-primary transition-colors">Laptops</a></li>
              <li><a href="#accessories" className="text-slate-400 hover:text-primary transition-colors">Accessories</a></li>
              <li><a href="#deals" className="text-slate-400 hover:text-primary transition-colors">Special Offers</a></li>
            </ul>
          </motion.div>
          
          {/* Support */}
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-montserrat font-semibold mb-6">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">FAQs</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Warranty</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Repair Services</a></li>
            </ul>
          </motion.div>
          
          {/* Contact Info */}
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-montserrat font-semibold mb-6">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mt-1 mr-3 text-primary h-5 w-5" />
                <span className="text-slate-400">123 Tech Street, Digital City, TC 12345</span>
              </li>
              <li className="flex items-start">
                <Phone className="mt-1 mr-3 text-primary h-5 w-5" />
                <span className="text-slate-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start">
                <Mail className="mt-1 mr-3 text-primary h-5 w-5" />
                <span className="text-slate-400">support@techtreasure.com</span>
              </li>
              <li className="flex items-start">
                <Clock className="mt-1 mr-3 text-primary h-5 w-5" />
                <span className="text-slate-400">Mon-Fri: 9AM - 6PM</span>
              </li>
            </ul>
          </motion.div>
        </div>
        
        {/* Footer Bottom */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm mb-4 md:mb-0">
              &copy; {currentYear} TechTreasure. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-slate-400 hover:text-primary text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-slate-400 hover:text-primary text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-slate-400 hover:text-primary text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
