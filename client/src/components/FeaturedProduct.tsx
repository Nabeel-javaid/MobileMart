import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Cpu, Camera, Battery, HardDrive } from 'lucide-react';
import type { Product } from '@shared/schema';
import { Badge } from '@/components/ui/badge';

interface FeaturedProductProps {
  product: Product;
}

export default function FeaturedProduct({ product }: FeaturedProductProps) {
  // Icons mapping for features
  const featureIcons: Record<string, JSX.Element> = {
    processor: <Cpu className="text-primary" />,
    camera: <Camera className="text-primary" />,
    battery: <Battery className="text-primary" />,
    storage: <HardDrive className="text-primary" />
  };

  // Get discount percentage
  const getDiscountPercentage = () => {
    if (!product.originalPrice) return null;
    const original = parseFloat(product.originalPrice.toString());
    const current = parseFloat(product.price.toString());
    return Math.round(((original - current) / original) * 100);
  };

  const discount = getDiscountPercentage();

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* Product Image with animated elements */}
          <div className="w-full md:w-1/2 relative">
            <motion.div
              className="absolute -top-10 -left-10 w-64 h-64 bg-primary opacity-10 rounded-full -z-10"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.1, 0.15, 0.1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <motion.div
              className="absolute -bottom-10 -right-10 w-48 h-48 bg-secondary opacity-10 rounded-full -z-10"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.1, 0.15, 0.1]
              }}
              transition={{
                duration: 3,
                delay: 1.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <motion.img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-auto rounded-2xl shadow-xl"
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </div>

          {/* Product Information */}
          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
              {product.badge || 'New Arrival'}
            </span>

            <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-4">
              {product.name}
            </h2>

            <p className="text-slate-600 mb-6">
              {product.description}
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-6 mb-8">
              {product.features && Array.isArray(product.features) && product.features.map((feature, index) => {
                const [key, value] = Object.entries(
                  typeof feature === 'string' ? { [feature.split(':')[0]]: feature.split(':')[1] } : feature
                )[0];

                return (
                  <div key={index} className="flex items-center gap-2">
                    {featureIcons[key.toLowerCase()] || <Cpu className="text-primary" />}
                    <span className="text-sm font-medium">{value || feature}</span>
                  </div>
                );
              })}
            </div>

            {/* Price information */}
            <div className="flex items-center mb-8">
              <span className="text-2xl font-montserrat font-bold">
                ${parseFloat(product.price.toString()).toFixed(2)}
              </span>

              {product.originalPrice && (
                <>
                  <span className="ml-3 text-slate-500 line-through">
                    ${parseFloat(product.originalPrice.toString()).toFixed(2)}
                  </span>
                  {discount && (
                    <span className="ml-3">
                      <Badge variant="success" className="text-sm px-2 py-1">Save {discount}%</Badge>
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4">
              <motion.button
                className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-medium transition-colors flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
              </motion.button>

              <motion.button
                className="bg-white border border-slate-300 hover:border-primary text-slate-800 hover:text-primary px-6 py-3 rounded-full font-medium transition-colors flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className="mr-2 h-5 w-5" /> Wishlist
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
