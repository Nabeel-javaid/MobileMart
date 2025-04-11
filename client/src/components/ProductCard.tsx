import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, StarHalf } from 'lucide-react';
import type { Product } from '@shared/schema';

interface ProductCardProps {
  product: Product;
  variant?: 'light' | 'dark';
}

export default function ProductCard({ product, variant = 'light' }: ProductCardProps) {
  const bgColor = variant === 'light' ? 'bg-white' : 'bg-slate-50';

  // Calculate full and half stars
  const rating = parseFloat(product.rating.toString());
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <motion.div 
      className={`${bgColor} rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <div className="relative">
        <div className="overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        
        {/* Badge (if present) */}
        {product.badge && (
          <div className="absolute top-4 left-4">
            <span className={`
              ${product.badge.toLowerCase().includes('new') ? 'bg-primary' : 
               product.badge.toLowerCase().includes('sale') || product.badge.toLowerCase().includes('%') ? 'bg-secondary' : 
               'bg-accent'} 
              text-white text-xs font-medium px-2 py-1 rounded-full
            `}>
              {product.badge}
            </span>
          </div>
        )}
        
        {/* Wishlist button */}
        <motion.button 
          className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart className="h-4 w-4" />
        </motion.button>
      </div>
      
      <div className="p-6">
        <h3 className="font-montserrat font-semibold text-lg mb-2">{product.name}</h3>
        
        {/* Rating stars */}
        <div className="flex items-center text-sm text-yellow-500 mb-3">
          {[...Array(5)].map((_, i) => (
            i < fullStars ? (
              <Star key={i} className="fill-current h-4 w-4" />
            ) : (
              i === fullStars && hasHalfStar ? (
                <StarHalf key={i} className="fill-current h-4 w-4" />
              ) : (
                <Star key={i} className="text-yellow-500 opacity-50 h-4 w-4" />
              )
            )
          ))}
          <span className="ml-1 text-slate-600">({product.reviewCount})</span>
        </div>
        
        <p className="text-slate-600 text-sm mb-4">{product.description}</p>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="font-montserrat font-bold text-lg">${parseFloat(product.price.toString()).toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-slate-500 line-through text-sm ml-2">
                ${parseFloat(product.originalPrice.toString()).toFixed(2)}
              </span>
            )}
          </div>
          
          <motion.button 
            className={`${variant === 'light' ? 'bg-slate-100' : 'bg-white'} hover:bg-primary text-slate-700 hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-white`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
