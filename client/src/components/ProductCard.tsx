import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, StarHalf, Eye } from 'lucide-react';
import { Link } from 'wouter';
import type { Product } from '@shared/schema';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

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

  // Calculate discount percentage
  const getDiscountPercentage = () => {
    if (!product.originalPrice) return null;
    const original = parseFloat(product.originalPrice.toString());
    const current = parseFloat(product.price.toString());
    return Math.round(((original - current) / original) * 100);
  };

  const discount = getDiscountPercentage();

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.1
      }
    },
    hover: {
      y: -5,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.3,
        type: "tween"
      }
    }
  };

  // Button animations
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0,
        duration: 0.1
      }
    },
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.3
      }
    },
    tap: {
      scale: 0.9
    }
  };

  return (
    <Link href={`/product/${product.id}`}>
      <div
        className={`rounded-xl overflow-hidden h-full flex flex-col ${bgColor} hover:shadow-xl hover:-translate-y-1`}
        style={{ transition: 'transform 0.3s, box-shadow 0.3s' }}
      >
        {/* Image container with zoom effect */}
        <div className="relative overflow-hidden aspect-square">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105"
            style={{ transition: 'transform 0.3s' }}
          />

          {/* Stylish overlay that appears on hover */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 flex items-end"
            style={{ transition: 'opacity 0.3s' }}
          >
            <div className="p-4 w-full">
              <button
                className="bg-white w-full py-2 rounded-full text-primary font-medium flex items-center justify-center hover:bg-gray-100"
                style={{ transition: 'background-color 0.3s' }}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="font-montserrat font-semibold text-lg mb-2 truncate hover:text-primary"
            style={{ transition: 'color 0.3s' }}>
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
                <span
                  className="text-slate-500 line-through text-sm ml-2"
                >
                  ${parseFloat(product.originalPrice.toString()).toFixed(2)}
                </span>
              )}
              {discount && (
                <div
                  className="inline-block ml-2"
                >
                  <Badge variant="success">Save {discount}%</Badge>
                </div>
              )}
            </div>

            <button
              className={`${variant === 'light' ? 'bg-slate-100' : 'bg-white'} hover:bg-primary text-slate-700 hover:text-white w-10 h-10 rounded-full flex items-center justify-center`}
              style={{ transition: 'background-color 0.3s, color 0.3s' }}
              onClick={handleAddToCart}
              aria-label="Add to cart"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
