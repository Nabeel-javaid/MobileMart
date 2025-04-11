import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, StarHalf, Eye } from 'lucide-react';
import { Link } from 'wouter';
import type { Product } from '@shared/schema';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  variant?: 'light' | 'dark';
}

export default function ProductCard({ product, variant = 'light' }: ProductCardProps) {
  const bgColor = variant === 'light' ? 'bg-white' : 'bg-slate-50';
  const { addToCart } = useCart();
  const { toast } = useToast();

  // Calculate full and half stars
  const rating = product.rating ? parseFloat(product.rating.toString()) : 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist`,
    });
  };

  // Card animations
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: { 
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
    }
  };

  // Button animations
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        delay: 0.2,
        duration: 0.3,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.9
    }
  };

  return (
    <Link href={`/product/${product.id}`}>
      <motion.div 
        className={`${bgColor} rounded-xl overflow-hidden shadow-sm cursor-pointer group`}
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        whileHover="hover"
      >
        <div className="relative">
          <div className="overflow-hidden aspect-[4/5]">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          
          {/* Product actions overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-2">
              <motion.button 
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-primary"
                variants={buttonVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                whileTap="tap"
                onClick={handleAddToCart}
                aria-label="Add to cart"
              >
                <ShoppingCart className="h-5 w-5" />
              </motion.button>
              
              <motion.button 
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-primary"
                variants={buttonVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                whileTap="tap"
                onClick={handleAddToWishlist}
                aria-label="Add to wishlist"
              >
                <Heart className="h-5 w-5" />
              </motion.button>
              
              <motion.div
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-primary"
                variants={buttonVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                whileTap="tap"
                aria-label="Quick view"
              >
                <Eye className="h-5 w-5" />
              </motion.div>
            </div>
          </div>
          
          {/* Badge (if present) */}
          {product.badge && (
            <motion.div 
              className="absolute top-4 left-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className={`
                ${product.badge.toLowerCase().includes('new') ? 'bg-primary' : 
                 product.badge.toLowerCase().includes('sale') || product.badge.toLowerCase().includes('%') ? 'bg-secondary' : 
                 'bg-accent'} 
                text-white text-xs font-medium px-2 py-1 rounded-full
              `}>
                {product.badge}
              </span>
            </motion.div>
          )}

          {/* If product is new */}
          {product.isNew && !product.badge && (
            <motion.div 
              className="absolute top-4 left-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="bg-primary text-white text-xs font-medium px-2 py-1 rounded-full">
                NEW
              </span>
            </motion.div>
          )}
        </div>
        
        <div className="p-6">
          <h3 className="font-montserrat font-semibold text-lg mb-2 truncate group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          {/* Rating stars */}
          {product.rating && (
            <div className="flex items-center text-sm text-yellow-500 mb-3">
              {[...Array(5)].map((_, i) => (
                i < fullStars ? (
                  <Star key={i} className="fill-current h-4 w-4" />
                ) : (
                  i === fullStars && hasHalfStar ? (
                    <StarHalf key={i} className="fill-current h-4 w-4" />
                  ) : (
                    <Star key={i} className="text-yellow-500 opacity-30 h-4 w-4" />
                  )
                )
              ))}
              <span className="ml-1 text-slate-600">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}
          
          <p className="text-slate-600 text-sm mb-4 line-clamp-2">{product.description}</p>
          
          <div className="flex justify-between items-center">
            <div>
              <span className="font-montserrat font-bold text-lg">${parseFloat(product.price).toFixed(2)}</span>
              {product.originalPrice && (
                <motion.span 
                  className="text-slate-500 line-through text-sm ml-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  ${parseFloat(product.originalPrice.toString()).toFixed(2)}
                </motion.span>
              )}
            </div>
            
            <motion.button 
              className={`${variant === 'light' ? 'bg-slate-100' : 'bg-white'} hover:bg-primary text-slate-700 hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              aria-label="Add to cart"
            >
              <ShoppingCart className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
